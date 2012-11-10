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

    // init ellipsoid model for lat/lng calculations
    this.ellipsoidModel = new osg.EllipsoidModel();

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

        var lat = latitude * Math.PI/180.0;
        var lng = longitude * Math.PI/180.0;
        var matrix = this.ellipsoidModel.computeLocalToWorldTransformFromLatLongHeight(lat, lng, 1000, []);

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
                            height = osg.WGS_84_RADIUS_EQUATOR*0.5;

                        if (dt > 1.0) {
                            scale = 1.0;
                        } else {
                            scale = osgAnimation.EaseOutElastic(dt);
                        }

                        scale = scale * (height/osg.WGS_84_RADIUS_EQUATOR);
                        /*
                        if (this.manipulator.height > this.limit) {
                            var rr = 1.0 - (this.manipulator.height-this.limit) * 0.8/(2.5*osg.WGS_84_RADIUS_EQUATOR-this.limit);
                            scale *= rr;
                        }
                        */
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
            items = this.items = new osg.Node(),
            ratio = canvas.width / canvas.height,

            // parse the data scene graphs
            world = osgDB.parseSceneGraph(typeof getWorld == 'function' ? getWorld() : {}),
            country = osgDB.parseSceneGraph(typeof getCountry == 'function' ? getCountry() : {}),
            coast = osgDB.parseSceneGraph(typeof getCoast == 'function' ? getCoast() : {}),

            // create the front and back spheres
            backSphere = new osg.Node(),
            frontSphere = new osg.Node(),

            countryScale = new osg.MatrixTransform();

        viewer.getCamera().setClearColor([0,0,0,0]);

        backSphere.addChild(world);
        backSphere.setStateSet(this.getWorldShaderBack());
        backSphere.setNodeMask(2);
        backSphere.getOrCreateStateSet().setAttributeAndMode(new osg.CullFace('FRONT'));

        frontSphere.addChild(world);
        frontSphere.setStateSet(this.getWorldShaderFront());
        frontSphere.setNodeMask(2);
        frontSphere.getOrCreateStateSet().setAttributeAndMode(new osg.CullFace('BACK'));
        frontSphere.getOrCreateStateSet().getUniform('fragColor').set(this.landFrontColor);

        country.addChild(coast);

        osg.Matrix.makeScale(1.001,1.001,1.001, countryScale.getMatrix());
        countryScale.addChild(country);

        // add the scene children
        scene.add(backSphere, frontSphere, countryScale, items);

        /*
        scene.addChild(backSphere);
        scene.addChild(frontSphere);
        scene.addChild(countryScale);
        scene.addChild(items);
        */

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