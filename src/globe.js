/** -*- compile-command: "jslint-cli globe.js" -*-
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

// req: osg, underscore as _

//=collate shaders { "transform": "array" }

//= fns/hex2num
//= types/wave
//= types/globe-manipulator

function Globe(canvas, options) {
    this.landColor = hex2num("#028482FF"); //[ 2/255.0, 132/255.0, 130/255.0,1];
    this.landFrontColor = hex2num("#7ABA7AAA"); //[122.0/255.0, 0.6470588235294118,0.7647058823529411,0.8666666666666667];

    this.countryColor = hex2num("#000000FF"); //[0.0,0.0,0.0,1];
    this.waveColor = hex2num("#000000FF");

    var w,h;
    if (options !== undefined) {
        if (options.globeBackColor !== undefined) {
            this.landColor = hex2num(options.globeBackColor);
        }

        if (options.globeFrontColor !== undefined) {
            this.landFrontColor = hex2num(options.globeFrontColor);
        }

        if (options.globeLinesColor !== undefined) {
            this.countryColor = hex2num(options.globeLinesColor);
        }

        if (options.waveColor !== undefined) {
            this.waveColor = hex2num(options.waveColor);
        }

        this.wave = options.wave && (new Wave());

        if (options.width !== undefined) {
            w = options.width;
        }
        if (options.height !== undefined) {
            h = options.height;
        }
    }

    
    if (w === undefined || h === undefined) {
        w = window.innerWidth;
        h = window.innerHeight;
    }

    this.canvas = canvas;
    canvas.width = w;
    canvas.height = h;
    var ratio = canvas.width/canvas.height;

//    try {
        this.viewer = new osgViewer.Viewer(canvas);
        this.viewer.init();
        this.viewer.getCamera().setProjectionMatrix(osg.Matrix.makePerspective(60, ratio, 1000.0, 100000000.0, []));

        var manipulator = new GlobeManipulator(options);
        this.viewer.setupManipulator(manipulator);
        manipulator.setDistance(2.5*6378137);
        manipulator.setMaxDistance(2.5*6378137);
        manipulator.setMinDistance(6378137);

        this.viewer.run = function() {
            osgViewer.Viewer.prototype.run.call(this);
        };

        var result = this.createScene();
        this.items = result.items;
        this.viewer.setSceneData(result.root);
        this.viewer.run();
//    } catch (er) {
//        osg.log("exception in osgViewer " + er);
//    }   
}

Globe.prototype = {
    getWaveShaderVolume: function() {
        var vertexshader = _shaders['wave.vert'];
        var fragmentshader = _shaders['wave.frag'];
        var program = new osg.Program(
            new osg.Shader(gl.VERTEX_SHADER, vertexshader),
            new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.waveColor,"fragColor");
        var scale = osg.Uniform.createFloat1(scale,"scale");
        var uniformTexture = osg.Uniform.createInt1(0, "Texture0");
        stateset.setAttributeAndMode(program);
        stateset.setAttributeAndMode(new osg.LineWidth(1.0));
        stateset.addUniform(uniform);
        stateset.addUniform(uniformTexture);
        stateset.addUniform(scale);
        return stateset;
    },
    getWaveShaderFlat: function() {
        var program = new osg.Program(
            new osg.Shader(gl.VERTEX_SHADER, _shaders['wave-flat.vert']),
            new osg.Shader(gl.FRAGMENT_SHADER, _shaders['wave-flat.frag']));
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.waveColor,"fragColor");
        var scale = osg.Uniform.createFloat1(scale,"scale");
        var uniformTexture = osg.Uniform.createInt1(0, "Texture0");
        stateset.setAttributeAndMode(program);
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
        this.items.addChild(node);

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
        while (this.items.getChildren().length > 0 ) {
            this.items.getChildren()[0].dispose();
        }
    },

    getWorldProgram: function() {
        if (this.WorldProgram === undefined) {
            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, _shaders['world.vert']),
                new osg.Shader(gl.FRAGMENT_SHADER, _shaders['world.frag']));

            this.WorldProgram = program;
        }
        return this.WorldProgram;
    },

    getWorldShaderBack: function() {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.landColor,"fragColor");
        stateset.setAttributeAndMode(this.getWorldProgram());
        stateset.addUniform(uniform);
        return stateset;
    },

    getWorldShaderFront: function () {
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.landFrontColor,"fragColor");
        stateset.setAttributeAndMode(this.getWorldProgram());
        stateset.addUniform(uniform);
        return stateset;
    },


    getCountryShader: function() {
        var program = new osg.Program(
            new osg.Shader(gl.VERTEX_SHADER, _shaders['country.vert']),
            new osg.Shader(gl.FRAGMENT_SHADER, _shaders['country.frag']));
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4(this.countryColor,"fragColor");
        stateset.setAttributeAndMode(program);
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
        if (this.ItemShader === undefined) {
            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, _shaders['item.vert']),
                new osg.Shader(gl.FRAGMENT_SHADER, _shaders['item.frag']));

            this.ItemShader = program;
        }
        var stateset = new osg.StateSet();
        var uniform = osg.Uniform.createFloat4([1.0,
                                                0.0,
                                                1.0,
                                                0.5],"fragColor");
        var baseColor = osg.Uniform.createFloat4([1.0,
                                                  1.0,
                                                  1.0,
                                                  1.0],"baseColor");
        stateset.setAttributeAndMode(this.ItemShader);
        //stateset.setAttributeAndMode(new osg.BlendFunc('ONE', 'ONE_MINUS_SRC_ALPHA'));
        stateset.addUniform(uniform);
        stateset.addUniform(baseColor);
        return stateset;
    },

    createScene: function() {
        var viewer = this.viewer;

        var optionsURL = function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };

        viewer.getCamera().setClearColor([0,0,0,0]);


        var canvas = this.canvas;
        var ratio = canvas.width/canvas.height;

        var scene = new osg.Node();

        var world = osgDB.parseSceneGraph(getWorld());
        var country = osgDB.parseSceneGraph(getCountry());
        var coast = osgDB.parseSceneGraph(getCoast());

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

        viewer.getManipulator().update(-2.0, 0);
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
    }
};