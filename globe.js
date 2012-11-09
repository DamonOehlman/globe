/** -*- compile-command: "jslint-cli globe.js" -*-
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

// req: osg, underscore as _

var _shaders = {
  'country.frag': ['#ifdef GL_ES','precision highp float;','#endif','','uniform vec4 fragColor;','','void main(void) {','    gl_FragColor = fragColor;','}'].join('\n'),
  'country.vert': ['#ifdef GL_ES','precision highp float;','#endif','','attribute vec3 Vertex;','uniform mat4 ModelViewMatrix;','uniform mat4 ProjectionMatrix;','','void main(void) {','    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);','}'].join('\n'),
  'item.frag': ['#ifdef GL_ES','precision highp float;','#endif','','uniform vec4 fragColor;','uniform vec4 baseColor;','uniform sampler2D Texture0;','varying vec2 FragTexCoord0;','','void main(void) {','    vec4 color = texture2D( Texture0, FragTexCoord0.xy);','    float a = color[3];','    color = color*a;','    color[3]= a;','    gl_FragColor = (baseColor*color)*fragColor[0];','}'].join('\n'),
  'item.vert': ['#ifdef GL_ES','precision highp float;','#endif','','attribute vec3 Vertex;','attribute vec2 TexCoord0;','uniform mat4 ModelViewMatrix;','uniform mat4 ProjectionMatrix;','varying vec2 FragTexCoord0;','','void main(void) {','    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);','    FragTexCoord0 = TexCoord0;','}'].join('\n'),
  'wave.frag': ['#ifdef GL_ES','precision highp float;','#endif','','uniform vec4 fragColor;','varying float height;','','void main(void) {','      gl_FragColor = fragColor * height;','}'].join('\n'),
  'wave.vert': ['#ifdef GL_ES','precision highp float;','#endif','','attribute vec3 Vertex;','attribute vec3 TexCoord0;','uniform mat4 ModelViewMatrix;','uniform mat4 ProjectionMatrix;','uniform mat4 NormalMatrix;','uniform float scale;','uniform sampler2D Texture0;','varying float height;','','float maxHeight = 1400000.0;','void main(void) {','    vec4 color = texture2D( Texture0, TexCoord0.xy);','    height = color[0];','    vec3 normal = normalize(Vertex);','    vec3 normalTransformed = vec3(NormalMatrix * vec4(normal,0.0));','    float dotComputed = dot(normalTransformed, vec3(0,0,1));','    height *= max(0.0, dotComputed);','    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex +  normal * ( height * maxHeight * scale),1.0);','    height *= 5.0 * scale;','}'].join('\n'),
  'waveflat.frag': ['#ifdef GL_ES','precision highp float;','#endif','','uniform sampler2D Texture0;','uniform vec4 fragColor;','uniform float scale;','varying float dotComputed;','varying vec2 TexCoordFragment;','','void main(void) {','    vec4 color = texture2D( Texture0, TexCoordFragment.xy);','    gl_FragColor = fragColor * min(2.0*dotComputed * color.x, 0.999999);','}'].join('\n'),
  'waveflat.vert': ['#ifdef GL_ES','precision highp float;','#endif','','attribute vec3 Vertex;','attribute vec3 TexCoord0;','uniform mat4 ModelViewMatrix;','uniform mat4 ProjectionMatrix;','uniform mat4 NormalMatrix;','varying float dotComputed;','varying vec2 TexCoordFragment;','','void main(void) {','    TexCoordFragment = TexCoord0.xy;','    vec3 normal = normalize(Vertex);','    vec3 normalTransformed = vec3(NormalMatrix * vec4(normal,0.0));','    dotComputed = max(0.0, dot(normalTransformed, vec3(0,0,1)));','','    if (dotComputed > 0.001) {','        dotComputed = 1.0;','    }','','    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1);','}'].join('\n'),
  'world.frag': ['#ifdef GL_ES','precision highp float;','#endif','','uniform vec4 fragColor;','','void main(void) {','    gl_FragColor = fragColor;','}'].join('\n'),
  'world.vert': ['#ifdef GL_ES','precision highp float;','#endif','','attribute vec3 Vertex;','uniform mat4 ModelViewMatrix;','uniform mat4 ProjectionMatrix;','uniform vec4 fragColor;','','void main(void) {','    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);','}'].join('\n')
};


function hex2num(hex) {
    if(hex.charAt(0) == "#") { hex = hex.slice(1); }//Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(4);
    var k = 0;
    var int1,int2;
    for(var i=0;i<8;i+=2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
        value[k] = (int1 * 16) + int2;
        value[k] = value[k]/255.0;
        k++;
    }
    return(value);
}
function Wave() {
    this.buffers = [];
    this.buffers.push(document.getElementById("HeightMap1"));
    this.buffers.push(document.getElementById("HeightMap2"));
    this.currentBuffer = 0;
    var prevCtx = this.buffers[0].getContext("2d");
    prevCtx.fillStyle = "rgb(0,0,0)";
    prevCtx.fillRect(0,0, this.buffers[0].width,this.buffers[0].height);
    var newCtx = this.buffers[1].getContext("2d");
    newCtx.fillStyle = "rgb(0,0,0)";
    newCtx.fillRect(0,0, this.buffers[0].width,this.buffers[0].height);

    this.lastUpdate = undefined;
    this.hitsList = [];

    this.nb = 0;
    this.duration = 0;
}

Wave.prototype = {
    processHits: function(hits, prevImageData) {
        for (var h = 0, nbl = hits.length; h < nbl; h++) {
            var width = prevImageData.width;
            var pdata2 = prevImageData.data;
            coord = hits[h];
            var x = parseInt(Math.floor(coord[0]),10);
            var y = parseInt(Math.floor(coord[1]),10);
            var currentHeight = pdata2[(y * width + x ) * 4];
            currentHeight += 25;
            if (currentHeight > 255) {
                currentHeight = 255;
            }
            pdata2[(y * width + x ) * 4] = currentHeight;
        }
    },
    update: function() {
        var enter = (new Date()).getTime();
        var dt = 1.0/30.0;
        var currentTime = (new Date()).getTime()/1000.0;
        if (this.lastUpdate === undefined) {
            this.lastUpdate = currentTime;
        }
        var diff = currentTime-this.lastUpdate;
        if (diff < dt) {
            //osg.log("skip");
            return;
        }

        var nb = parseInt(Math.floor(diff/dt),10);
        for (var step = 0, l = nb; step < l; step++) {
            
            var prevBuffer = this.buffers[this.currentBuffer];
            var newBuffer = this.buffers[(this.currentBuffer+1)%2];

            var prevCtx = prevBuffer.getContext("2d");
            var newCtx = newBuffer.getContext("2d");
            
            var prevImageData = prevCtx.getImageData(0, 0, prevBuffer.width, prevBuffer.height);
            var newImageData = newCtx.getImageData(0, 0, prevBuffer.width, prevBuffer.height);

            var width = prevBuffer.width;
            var height = prevBuffer.height;

            var coord;
            var refresh = (this.hitsList.length > 0);
            if (refresh === true) {
                this.processHits(this.hitsList, prevImageData);
                prevCtx.putImageData(prevImageData, 0, 0);
                this.hitsList.length = 0;
            }

            for (var total = 0, w = width, h = height, totalIteration = width*height; total < totalIteration; total++) {
                
                var A = dt*dt*340.0/10.0;
                var B = 2.0-4.0*A;
                var damping = 0.996;
                
                var i = total%w;
                var j = Math.floor(total/w);

                var pdata = prevImageData.data;
                var ndata = newImageData.data;
                var up = pdata[(((j-1+h)%h) * w + i) * 4];
                var down = pdata[(((j+1)%h) * w + i) * 4];
                var left  = pdata[(j * w + (i-1+w)%w ) * 4];
                var right = pdata[(j * w + (i+1)%w ) * 4];
                var newvalue = A*(up+down+left+right) + B*pdata[(j * w + i ) * 4] - ndata[(j * w + i) * 4];
                newvalue *= damping;
                ndata[(j * w + i) * 4] = newvalue;
            }

            newCtx.putImageData(newImageData, 0, 0);
            this.swapbuffer();
        }
        this.lastUpdate += dt*nb;

        this.duration += (new Date()).getTime()-enter;
        this.nb +=1;
        if (this.lastDisplay === undefined) {
            this.lastDisplay = enter;
        }
        if (false && (enter - this.lastDisplay)/1000.0 > 2.0) {
            this.lastDisplay = enter;
            osg.log("average time in ms per iteration " + this.duration/this.nb);
        }
    },

    setLatLng: function(lat, lng) {
        var canvas = this.buffers[this.currentBuffer];
        lng = lng * canvas.width/360.0 + canvas.width/2.0;
        lat = -1.0 * lat * canvas.height/180.0 + canvas.height/2.0;
        this.hitsList.push([lng,lat]);
    },

    getCanvas: function() {
        return this.buffers[(this.currentBuffer+1)%2];
    },

    swapbuffer: function() {
        this.currentBuffer = (this.currentBuffer + 1)%2;
    }
};
// types/globe-manipulator

function Globe(canvas, options) {
    var w, h, ratio, viewer, manipulator;

    // assign the canvas
    this.canvas = canvas;

    // ensure options is valid
    options = options || {};

    // initialise the width and height
    w = canvas.width = typeof options.width != 'undefined' ? options.width : window.innerWidth;
    h = canvas.height = typeof options.height != 'undefined' ? options.height : window.innerHeight;
    ratio = w / h;

    // initialise colors
    this.landColor = hex2num(options.globeBackColor || '#028482FF');
    this.landFrontColor = hex2num(options.globeFrontColor || '#7ABA7AAA');
    this.countryColor = hex2num(options.globeLinesColor || '#000000FF');
    this.waveColor = hex2num(options.waveColor || '#000000FF');

    // create the wave (if we are using it)
    this.wave = options.wave && (new Wave());

    // initialise the viewer manipulator
    manipulator = new osgGA.OrbitManipulator(options);
    manipulator.setDistance(2.5*6378137);
    manipulator.setMaxDistance(2.5*6378137);
    manipulator.setMinDistance(6378137);

    // initialise the viewer
    viewer = this.viewer = new osgViewer.Viewer(canvas);
    viewer.init();
    viewer.getCamera().setProjectionMatrix(osg.Matrix.makePerspective(60, ratio, 1000.0, 100000000.0, []));
    viewer.setupManipulator(manipulator);

    // create the scene
    this.sceneData = this.createScene();
    viewer.setSceneData(this.sceneData.root);
    viewer.run();

    /*
    this.viewer.run = function() {
        osgViewer.Viewer.prototype.run.call(this);
    };
    */
}

Globe.prototype = {
    getWaveShaderVolume: function() {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.waveColor,"fragColor");
        var scale = osg.Uniform.createFloat1(scale,"scale");
        var uniformTexture = osg.Uniform.createInt1(0, "Texture0");

        stateset.setAttributeAndMode(this._getProgram('wave'));
        stateset.setAttributeAndMode(new osg.LineWidth(1.0));
        stateset.addUniform(uniform);
        stateset.addUniform(uniformTexture);
        stateset.addUniform(scale);

        return stateset;
    },

    getWaveShaderFlat: function() {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.waveColor,"fragColor");
        var scale = osg.Uniform.createFloat1(scale,"scale");
        var uniformTexture = osg.Uniform.createInt1(0, "Texture0");

        stateset.setAttributeAndMode(this._getProgram('waveflat'));
        stateset.setAttributeAndMode(new osg.LineWidth(1.0));
        stateset.addUniform(uniform);
        stateset.addUniform(uniformTexture);
        stateset.addUniform(scale);

        return stateset;
    },

    addImage: function(latitude, longitude, image, options, cb) {

        // manage a uniq id for item created
        if (this.itemID === undefined) {
            this.itemID = 0;
        }
        this.itemID += 1;

        var texture = new osg.Texture();
        texture.setMinFilter('LINEAR');
        texture.setImage(image);

        var w = 500000;
        var h = 500000;
        var node = new osg.MatrixTransform();
        var geom = osg.createTexturedQuadGeometry(-w/2.0, -h/2.0, 0,
                                                  w, 0, 0,
                                                  0, h, 0);
        node.addChild(geom);
        var stateSet = this.getItemShader();
        stateSet.setTextureAttributeAndMode(0, texture);

        var uniform = osg.Uniform.createInt1(0.0, "Texture0");
        geom.setStateSet(stateSet);
        node.uniform = stateSet.getUniform('fragColor');

        node.setUpdateCallback(this.getItemUpdateCallback());
        node.itemType = "Item";

        if (options !== undefined) {
            if (options.color !== undefined) {
                var baseColor = stateSet.getUniform('baseColor');
                baseColor.set(options.color);
            }
        }

        if (this.ellipsoidModel === undefined) {
            this.ellipsoidModel = new osg.EllipsoidModel();
        }

        var lat = latitude * Math.PI/180.0;
        var lng = longitude * Math.PI/180.0;
        var matrix = [];

        this.ellipsoidModel.computeLocalToWorldTransformFromLatLongHeight(lat, lng, 1000, matrix);
        node.originalMatrix = osg.Matrix.copy(matrix);
        node.setMatrix(matrix);
        
        node.name = image.src;

        node.setNodeMask(~0);
        node.itemID = this.itemID;
        node.itemToIntersect = true;
        node.hitCallback = cb;
        node.startTime = undefined;
        node.duration = undefined;

        // add the node to the sceneGraph
        this.sceneData.items.addChild(node);

        node.dispose = function() {
            this.updateCallback = undefined;
            this.removeChildren();
            while(this.parents.length > 0) {
                this.parents[0].removeChildren(this);
            }
        };

        if (this.wave !== undefined) {
            this.wave.setLatLng(latitude, longitude);
        }

        return node;
    },

    dispose: function() {
        while (this.sceneData.items.getChildren().length > 0 ) {
            this.sceneData.items.getChildren()[0].dispose();
        }
    },

    getWorldShaderBack: function() {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.landColor,"fragColor");

        stateset.setAttributeAndMode(this._getProgram('world'));
        stateset.addUniform(uniform);

        return stateset;
    },

    getWorldShaderFront: function () {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.landFrontColor,"fragColor");

        stateset.setAttributeAndMode(this._getProgram('world'));
        stateset.addUniform(uniform);

        return stateset;
    },


    getCountryShader: function() {
        var stateset = new osg.StateSet(),
            uniform = osg.Uniform.createFloat4(this.countryColor,"fragColor");

        stateset.setAttributeAndMode(this._getProgram('country'));
        stateset.addUniform(uniform);

        return stateset;
    },

    getItemUpdateCallback: function() {
        var that = this;
        if (this.itemUpdateCallback === undefined) {
            var UpdateCallback = function() {
                this.limit = osg.WGS_84_RADIUS_EQUATOR*0.5;
                this.manipulator = that.viewer.getManipulator();
            };
            UpdateCallback.prototype = {
                update: function(node, nv) {
                    var ratio = 0;
                    var currentTime = nv.getFrameStamp().getSimulationTime();
                    if (node.startTime === undefined) {
                        node.startTime = currentTime;
                        if (node.duration === undefined) {
                            node.duration = 5.0;
                        }
                    }

                    var dt = currentTime - node.startTime;
                    if (dt > node.duration) {
                        node.setNodeMask(0);
                        return;
                    }
                    ratio = dt/node.duration;
                    if (node.originalMatrix) {
                        var scale;
                        if (dt > 1.0) {
                            scale = 1.0;
                        } else {
                            scale = osgAnimation.EaseOutElastic(dt);
                        }

                        scale = scale * (this.manipulator.height/osg.WGS_84_RADIUS_EQUATOR);
                        if (this.manipulator.height > this.limit) {
                            var rr = 1.0 - (this.manipulator.height-this.limit) * 0.8/(2.5*osg.WGS_84_RADIUS_EQUATOR-this.limit);
                            scale *= rr;
                        }
                        node.setMatrix(osg.Matrix.mult(node.originalMatrix, osg.Matrix.makeScale(scale, scale, scale), []));
                    }

                    var value = (1.0 - osgAnimation.EaseInQuad(ratio));
                    var uniform = node.uniform;
                    var c = [value, value, value, value];
                    uniform.set(c);
                    node.traverse(nv);
                }
            };
            this.itemUpdateCallback = new UpdateCallback();
        }
        return this.itemUpdateCallback;
    },

    getItemShader: function() {
        var stateset = new osg.StateSet(),
            uniform = osg.Uniform.createFloat4([1.0, 0.0, 1.0, 0.5],"fragColor"),
            baseColor = osg.Uniform.createFloat4([1.0, 1.0, 1.0, 1.0],"baseColor");

        stateset.setAttributeAndMode(this._getProgram('item'));
        //stateset.setAttributeAndMode(new osg.BlendFunc('ONE', 'ONE_MINUS_SRC_ALPHA'));
        stateset.addUniform(uniform);
        stateset.addUniform(baseColor);

        return stateset;
    },

    createScene: function() {
        var canvas = this.canvas,
            viewer = this.viewer,
            scene = new osg.Node(),
            ratio = canvas.width / canvas.height;

        viewer.getCamera().setClearColor([0,0,0,0]);

        var world = osgDB.parseSceneGraph(getWorld());
        var country = osgDB.parseSceneGraph(getCountry());
        var coast = osgDB.parseSceneGraph({});

        var backSphere = new osg.Node();
        backSphere.addChild(world);

        var frontSphere = new osg.Node();
        frontSphere.addChild(world);

        backSphere.setStateSet(this.getWorldShaderBack());
        backSphere.setNodeMask(2);
        backSphere.getOrCreateStateSet().setAttributeAndMode(new osg.CullFace('FRONT'));

        frontSphere.setStateSet(this.getWorldShaderFront());
        frontSphere.setNodeMask(2);
        frontSphere.getOrCreateStateSet().setAttributeAndMode(new osg.CullFace('BACK'));
        frontSphere.getOrCreateStateSet().getUniform('fragColor').set(this.landFrontColor);

        country.addChild(coast);

        var countryScale = new osg.MatrixTransform();
        osg.Matrix.makeScale(1.001,1.001,1.001, countryScale.getMatrix());
        countryScale.addChild(country);


        scene.addChild(backSphere);
        scene.addChild(frontSphere);
        scene.addChild(countryScale);

        var items = new osg.Node();
        scene.addChild(items);
        items.getOrCreateStateSet().setAttributeAndMode(new osg.Depth('DISABLE'));
        items.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA'));

        backSphere.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA'));
        frontSphere.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA'));

        country.setStateSet(this.getCountryShader());
        //    country.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('ONE', 'ONE'));
        //coast.getOrCreateStateSet().setAttributeAndMode(new osg.Depth());
        //frontSphere.getOrCreateStateSet().setAttributeAndMode(new osg.Depth('ALWAYS', 0, 1.0, false));
        //scene.getOrCreateStateSet().setAttributeAndMode(new osg.Depth());
        //country.getOrCreateStateSet().setAttributeAndMode(new osg.Depth(osg.Depth.LEQUAL, 0, 1.0, false));

        var createGoToLocation = function(location) {
            var f = function(event) {
                viewer.getManipulator().goToLocation(location.lat, location.lng);
            };
            return f;
        };

        // viewer.getManipulator().update(-2.0, 0);
        if (this.wave !== undefined) {
            var that = this;
            var getWaveShader = function() { return that.getWaveShaderVolume(); };
            var numTexturesAvailableInVertexShader = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            osg.log("Nb Texture Unit in vertex shader " + numTexturesAvailableInVertexShader);
            if (numTexturesAvailableInVertexShader < 1) {
                osg.log("VolumeWave disabled because your OpenGL implementation has " + numTexturesAvailableInVertexShader + " vertex texture units and wave option require at least 1");
                getWaveShader = function() { return that.getWaveShaderFlat(); };
            }
            

            var UpdateWaveCallback = function() {
                this.rate = 1.0/30.0; // update per second
            };
            UpdateWaveCallback.prototype = {
                setUniformScale: function(uniform) {
                    this.scale = uniform;
                },
                setTexture: function(texture) {
                    this.texture = texture;
                },
                getHeightMapCanvas: function() {
                    if (this.canvas === undefined) {
                        this.canvas = document.getElementById("HeightMap1");
                    }
                    return this.canvas;
                },
                update: function(node, nv) {
                    var scale = viewer.getManipulator().scale*25.0;
                    this.scale.set([scale]);
                    //osg.log("scale " + scale);
                    if (that.wave !== undefined) {
                        that.wave.update();
                        this.texture.setFromCanvas(that.wave.getCanvas());
                    }
                    node.traverse(nv);
                }
            };

            var height = osg.ParseSceneGraph(getHeight());
            var heightStateSet = getWaveShader();
            height.setStateSet(heightStateSet);
            var heightTexture = new osg.Texture();
            heightStateSet.setTextureAttributeAndMode(0, heightTexture);
            var heightUpdateCallback = new UpdateWaveCallback();
            heightUpdateCallback.setUniformScale(heightStateSet.getUniform('scale'));
            heightUpdateCallback.setTexture(heightTexture);
            height.setUpdateCallback(heightUpdateCallback);
            heightStateSet.setAttributeAndMode(new osg.BlendFunc('ONE', 'ONE_MINUS_SRC_ALPHA'));
            heightStateSet.setAttributeAndMode(new osg.Depth('DISABLE'));
            scene.addChild(height);
        }

        return { root: scene, items: items};
    },

    /**
    ## _getProgram(name)

    This internal method is used to create a new program and cache it in the world instance
    */
    _getProgram: function(name) {
        return this[name + 'Program'] || (this[name + 'Program'] = new osg.Program(
            new osg.Shader(gl.VERTEX_SHADER, _shaders[name + '.vert']),
            new osg.Shader(gl.FRAGMENT_SHADER, _shaders[name + '.frag'])));
    }
};
