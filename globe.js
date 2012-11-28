/** -*- compile-command: "jslint-cli globe.js" -*-
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

// req: osg, underscore as _

var WGS_84_RADIUS_EQUATOR = 6378137.0,
    DEG2RAD = Math.PI / 180;

// create the osgGlobe namespace
var osgGlobe = {};

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
/**
# osgGlobe.OrbitManipulator
*/
osgGlobe.OrbitManipulator = function(options) {
    osgGA.Manipulator.call(this);

    // ensure we have options
    options = options || {};

    this.ellipsoidModel = new osg.EllipsoidModel();
    this.distance = 25;
    this.target = [ 0,0, 0];
    this.eye = [ 0, this.distance, 0];
    this.rotation = [];
    this.up = [0, 0, 1];
    this.time = 0.0;
    this.dx = 0.0;
    this.dy = 0.0;
    this.buttonup = true;
    this.scale = 1.0;
    this.targetDistance = this.distance;
    this.currentMode = "rotate";

    this.measureDeltaX = 0;
    this.measureDeltaY = 0;
    this.measureClientY = 0;
    this.measureClientX = 0;
    this.measureTime = 0;
    this.direction = 0.0;

    this.height = 0;
    this.motionWhenRelease = 1.0;

    this.maxDistance = 0;
    this.minDistance = 0;

    this.contactsIntialDistance =1.0;
    this.nbContacts = 0;
    this.contacts = [];
    this.contactsPosition = [];
    this.zoomModeUsed = false;

    // initialise the rotation
    osg.Matrix.makeRotate(-Math.PI/3.0, 1,0,0, this.rotation);

    this.scaleFactor = 10.0;
    if (options.rotationSpeedFactor !== undefined) {
        if (options.rotationSpeedFactor !== 0.0) {
            this.scaleFactor /= options.rotationSpeedFactor;
        }
    }

    this.minAutomaticMotion = 0.015;
    if (options.rotationIdleSpeedFactor !== undefined) {
        if (options.rotationIdleSpeedFactor !== 0.0) {
            this.minAutomaticMotion *= options.rotationIdleSpeedFactor;
        }
    }

    // create a temporary matrix for calculations
    this.tmpInv = new Array(16);

    // initialise the motion damping
    this.motionDamping = options.motionDamping || 0.25;

    // initialise transition properties
    this.transitionDuration = options.transitionDuration || 2;
    this.transitionStart = 0;

    // initialise the deviec motion
    this._initDeviceMotion();
}

osgGlobe.OrbitManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    getScaleFromHeight: function(eye) {
        var distFromSurface = eye;
        var scaleOneFromSurface = WGS_84_RADIUS_EQUATOR;
        var ratio = distFromSurface/scaleOneFromSurface;
        // clamp the scale
        if (ratio > 0.8) {
            ratio = 0.8;
        }
        //osg.log(ratio);
        var scale = ratio/20.0;
        return scale;
    },

    computeRotation: function(dx, dy) {
        
        var scale = this.scale,
            of = [];

        osg.Matrix.makeRotate(dx * scale, 0, 0, 1, of);
        var r = osg.Matrix.mult(this.rotation, of, []);

        osg.Matrix.makeRotate(dy * scale/2.0, 1,0,0, of);
        var r2 = osg.Matrix.mult(of,r, []);

        // test that the eye is not too up and not too down to not kill
        // the rotation matrix
        var eye = osg.Matrix.transformVec3(osg.Matrix.inverse(r2, []), [0, 0, this.distance], []);
        /*
        if (eye[2] > 0.99*this.distance || eye[2] < -0.99*this.distance) {
            //discard rotation on y
            this.rotation = r;
            return;
        }
        */

        return this.rotation = r2;
    },

    goToLocation: function(lat, lng) {
        var pos3d = [],
            lookat = [],
            q = [],
            qStart;

        // convert lat lng to xyz coord
        this.ellipsoidModel.convertLatLongHeightToXYZ(
            lat * DEG2RAD, 
            lng * DEG2RAD, 
            WGS_84_RADIUS_EQUATOR,
            pos3d
        );

        osg.Matrix.makeLookAt(pos3d, [0,0,0], [0,0,-1], lookat);

        osg.Matrix.getRotate(lookat, q);

        if (this.transitionStart) {
            qStart = this.getGoToLocationQuaternion();
            this.rotation = osg.Matrix.makeRotateFromQuat(osg.Quat.conj(qStart));
        }

        this.targetRotation = q;
        this.transitionStart = Date.now();
    },

    setDistance: function(d) {
        this.distance = d;
        this.targetDistance = this.distance;
    },
    setMaxDistance: function(d) {
        this.maxDistance =  d;
    },
    setMinDistance: function(d) {
        this.minDistance =  d;
    },

    getHeight: function() {
        var h, lat, lng, llh = [];

        this.ellipsoidModel.convertXYZToLatLongHeight(this.eye[0], this.eye[1], this.eye[2], llh);
        return llh[2];
        //osg.log("height " + llh[2] + " distance " + this.distance);
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
        if (intDelta > 0){
                if (this.distanceDecrease) {
                    this.distanceDecrease();
                }
        }
        else if (intDelta < 0){
                if (this.distanceIncrease) {
                    this.distanceIncrease();
                }
        }
    },

    distanceIncrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget + h/10.0;
        if (this.maxDistance > 0) {
            if (newTarget > this.maxDistance) {
                newTarget = this.maxDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    distanceDecrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget - h/10.0;
        if (this.minDistance > 0) {
            if (newTarget < this.minDistance) {
                newTarget = this.minDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    
    pushButton: function() {
        this.dx = this.dy = 0;
        this.buttonup = false;

        var hit = this.getIntersection();
        this.pushHit = hit;
    },

    getIntersection: function() {
        var hits = this.view.computeIntersections(this.clientX, this.clientY, 1);
        var l = hits.length;
        if (l === 0 ) {
            return undefined;
        }
        hits.sort(function(a,b) {
            return a.ratio - b.ratio;
        });

        // use the first hit
        var hit = hits[0].nodepath;
        var l2 = hit.length;
        var itemSelected;
        var itemID;
        while (l2-- >= 0) {
            if (hit[l2].itemToIntersect !== undefined) {
                itemID = hit[l2].itemID;
                //itemSelected = hit[l2].children[0].getUpdateCallback();
                itemSelected = hit[l2];
                break;
            }
        }
        return { 'itemID': itemID, 
                 'item': itemSelected };
    },

    getInverseMatrix: function () {
        var eye = [],
            distance = this.distance,
            target = this.target,
            tmpInv = this.tmpInv,
            success,
            eye,
            inv;

        if (this.transitionStart) {
            qCurrent = this._calcLocationQuarternion();

            eve = this.eye = osg.Matrix.transformVec3(osg.Matrix.makeRotateFromQuat(qCurrent, []), [0, 0, distance], eye);
            inv = osg.Matrix.makeLookAt(osg.Vec3.add(target, eye, []), target, [0,0,1], []);
        }
        else {
            success = osg.Matrix.inverse(this.computeRotation(this.dx, this.dy), tmpInv);
            eye = this.eye = osg.Matrix.transformVec3(tmpInv, [0, 0, distance], eye);

            // calculate the inverse matrix
            inv = osg.Matrix.makeLookAt(osg.Vec3.add(target,eye, []), target, [0,0,1], []);
        }

        this.height = this.getHeight();
        // this.scale = this.getScaleFromHeight(this.height);

        return inv;
    },

    /**
    ## _calcLocationQuarternion
    */
    _calcLocationQuarternion: function() {
        var target = this.target,
            distance = this.distance,
            q0 = osg.Matrix.getRotate(this.rotation),
            q1 = this.targetRotation,
            elapsed = (Date.now() - this.transitionStart) / 1000,
            qCurrent = [];

        if (elapsed > this.transitionDuration) {
            elapsed = 1;
            this.transitionStart = 0;
            osg.Matrix.makeRotateFromQuat(q1, this.rotation);

            this.dx = 0;
            this.dy = 0;
        } 
        else {
            elapsed = osgAnimation.EaseOutCubic(elapsed / this.transitionDuration);
        }

        qCurrent = osg.Quat.slerp(elapsed, q0, q1, qCurrent);
        osg.Quat.conj(qCurrent, qCurrent);

        return qCurrent;
    },


    /**
    ## _handleMotion

    This is the event handler for the `devicemotion` event.  The handler is designed to be
    invoked bound to the manipulator scope.
    */
    _handleMotion: function(evt) {
        var accel = evt.accelerationIncludingGravity;

        // update the delta change
        this.dx = (accel.x / 180) * this.motionDamping;
        this.dy = (accel.y / 180) * this.motionDamping;
    },

    /**
    ## _initDeviceMotion

    This method is used to listen for device motion events and apply the appropriate updates on 
    on the globe.
    */
    _initDeviceMotion: function() {
        window.addEventListener('devicemotion', this._handleMotion.bind(this), false);
    }
});
/**
# osgGlobe.PositionLockedManipulator
*/
osgGlobe.PositionLockedManipulator = function(options) {
    osgGA.Manipulator.call(this);

    // ensure we have options
    options = options || {};

    this.ellipsoidModel = new osg.EllipsoidModel();
    this.distance = 25;
    this.target = [ 0,0, 0];
    this.eye = [ 0, this.distance, 0];
    this.rotation = [];
    this.up = [0, 0, 1];
    this.time = 0.0;
    this.dx = 0.0;
    this.dy = 0.0;
    this.buttonup = true;
    this.scale = 1.0;
    this.targetDistance = this.distance;
    this.currentMode = "rotate";

    this.measureDeltaX = 0;
    this.measureDeltaY = 0;
    this.measureClientY = 0;
    this.measureClientX = 0;
    this.measureTime = 0;
    this.direction = 0.0;

    this.height = 0;
    this.motionWhenRelease = 1.0;

    this.maxDistance = 0;
    this.minDistance = 0;
    this.goToLocationRunning = false;

    this.contactsIntialDistance =1.0;
    this.nbContacts = 0;
    this.contacts = [];
    this.contactsPosition = [];
    this.zoomModeUsed = false;

    // initialise the rotation
    osg.Matrix.makeRotate(-Math.PI/3.0, 1,0,0, this.rotation);

    this.scaleFactor = 10.0;
    if (options.rotationSpeedFactor !== undefined) {
        if (options.rotationSpeedFactor !== 0.0) {
            this.scaleFactor /= options.rotationSpeedFactor;
        }
    }

    this.minAutomaticMotion = 0.015;
    if (options.rotationIdleSpeedFactor !== undefined) {
        if (options.rotationIdleSpeedFactor !== 0.0) {
            this.minAutomaticMotion *= options.rotationIdleSpeedFactor;
        }
    }

    // create a temporary matrix for calculations
    this.tmpInv = new Array(16);

    // initialise the motion damping
    this.motionDamping = options.motionDamping || 0.25;

    // initialise the deviec motion
    this._initDeviceMotion();
}

osgGlobe.PositionLockedManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    getScaleFromHeight: function(eye) {
        var distFromSurface = eye;
        var WGS_84_RADIUS_EQUATOR = 6378137.0;
        var scaleOneFromSurface = WGS_84_RADIUS_EQUATOR;
        var ratio = distFromSurface/scaleOneFromSurface;
        // clamp the scale
        if (ratio > 0.8) {
            ratio = 0.8;
        }
        //osg.log(ratio);
        var scale = ratio/20.0;
        return scale;
    },

    computeRotation: function(dx, dy) {
        
        var scale = this.scale,
            of = [];

        osg.Matrix.makeRotate(dx * scale, 0, 0, 1, of);
        var r = osg.Matrix.mult(this.rotation, of, []);

        osg.Matrix.makeRotate(dy * scale/2.0, 1,0,0, of);
        var r2 = osg.Matrix.mult(of,r, []);

        // test that the eye is not too up and not too down to not kill
        // the rotation matrix
        var eye = osg.Matrix.transformVec3(osg.Matrix.inverse(r2, []), [0, 0, this.distance], []);
        /*
        if (eye[2] > 0.99*this.distance || eye[2] < -0.99*this.distance) {
            //discard rotation on y
            this.rotation = r;
            return;
        }
        */

        return this.rotation = r2;
    },

    
    goToLocation: function(lat, lng) {
        // already running switch to new location
        var pos3d = this.ellipsoidModel.convertLatLongHeightToXYZ(lat*Math.PI/180.0, lng*Math.PI/180.0);
        var lookat = osg.Matrix.makeLookAt(pos3d, [0,0,0], [0,0,-1], []);
        var q = osg.Matrix.getRotate(lookat, []);

        if (this.goToLocationRunning) {
            var qStart = this.getGoToLocationQuaternion();
            this.rotation = osg.Matrix.makeRotateFromQuat(osg.Quat.conj(qStart));
        }
        this.targetRotation = q;
        this.goToLocationTime = (new Date()).getTime();
        this.goToLocationRunning = true;
    },

    setDistance: function(d) {
        this.distance = d;
        this.targetDistance = this.distance;
    },
    setMaxDistance: function(d) {
        this.maxDistance =  d;
    },
    setMinDistance: function(d) {
        this.minDistance =  d;
    },

    getHeight: function() {
        var h, lat, lng, llh = [];

        this.ellipsoidModel.convertXYZToLatLongHeight(this.eye[0], this.eye[1], this.eye[2], llh);
        return llh[2];
        //osg.log("height " + llh[2] + " distance " + this.distance);
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
        if (intDelta > 0){
                if (this.distanceDecrease) {
                    this.distanceDecrease();
                }
        }
        else if (intDelta < 0){
                if (this.distanceIncrease) {
                    this.distanceIncrease();
                }
        }
    },

    distanceIncrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget + h/10.0;
        if (this.maxDistance > 0) {
            if (newTarget > this.maxDistance) {
                newTarget = this.maxDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    distanceDecrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget - h/10.0;
        if (this.minDistance > 0) {
            if (newTarget < this.minDistance) {
                newTarget = this.minDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    
    pushButton: function() {
        this.dx = this.dy = 0;
        this.buttonup = false;

        var hit = this.getIntersection();
        this.pushHit = hit;
    },

    getIntersection: function() {
        var hits = this.view.computeIntersections(this.clientX, this.clientY, 1);
        var l = hits.length;
        if (l === 0 ) {
            return undefined;
        }
        hits.sort(function(a,b) {
            return a.ratio - b.ratio;
        });

        // use the first hit
        var hit = hits[0].nodepath;
        var l2 = hit.length;
        var itemSelected;
        var itemID;
        while (l2-- >= 0) {
            if (hit[l2].itemToIntersect !== undefined) {
                itemID = hit[l2].itemID;
                //itemSelected = hit[l2].children[0].getUpdateCallback();
                itemSelected = hit[l2];
                break;
            }
        }
        return { 'itemID': itemID, 
                 'item': itemSelected };
    },

    getGoToLocationQuaternion: function() {
        var goToLocationDuration = 2.0;
        target = this.target;
        distance = this.distance;

        var q0 = osg.Matrix.getRotate(this.rotation);
        var q1 = this.targetRotation;

        var t = ((new Date()).getTime() - this.goToLocationTime)/1000.0;
        if (t > goToLocationDuration) {
            t = 1.0;
            this.goToLocationRunning = false;
            this.rotation = osg.Matrix.makeRotateFromQuat(q1);
            this.dx = 0;
            this.dy = 0;
        } else {
            t = osgAnimation.EaseOutCubic(t/goToLocationDuration);
        }
        var qCurrent = osg.Quat.slerp(t, q0, q1);
        osg.Quat.conj(qCurrent, qCurrent);
        return qCurrent;
    },

    getInverseMatrix: function () {
        var distance = this.distance,
            target = this.target,
            tmpInv = this.tmpInv,
            success = osg.Matrix.inverse(this.computeRotation(this.dx, this.dy), tmpInv),
            eye = this.eye = osg.Matrix.transformVec3(tmpInv, [0, 0, distance], []),

            // calculate the inverse matrix
            inv = osg.Matrix.makeLookAt(osg.Vec3.add(target,eye, []), target, [0,0,1], []);

        this.height = this.getHeight();
        // this.scale = this.getScaleFromHeight(this.height);

        return inv;
    },

    /**
    ## _handleMotion

    This is the event handler for the `devicemotion` event.  The handler is designed to be
    invoked bound to the manipulator scope.
    */
    _handleMotion: function(evt) {
        var accel = evt.accelerationIncludingGravity;

        // update the delta change
        this.dx = (accel.x / 180) * this.motionDamping;
        this.dy = (accel.y / 180) * this.motionDamping;
    },

    /**
    ## _initDeviceMotion

    This method is used to listen for device motion events and apply the appropriate updates on 
    on the globe.
    */
    _initDeviceMotion: function() {
        window.addEventListener('devicemotion', this._handleMotion.bind(this), false);
    }
});
function GlobeManipulator(options) {
    osgGA.Manipulator.call(this);

    // ensure we have options
    options = options || {};

    // initialise the default state for capturing device motion
    options.deviceMotion = typeof options.deviceMotion == 'undefined' || options.deviceMotion;

    this.ellipsoidModel = new osg.EllipsoidModel();
    this.distance = 25;
    this.target = [ 0,0, 0];
    this.eye = [ 0, this.distance, 0];
    this.rotation = [];
    this.up = [0, 0, 1];
    this.time = 0.0;
    this.dx = 0.0;
    this.dy = 0.0;
    this.buttonup = true;
    this.scale = 1.0;
    this.targetDistance = this.distance;
    this.currentMode = "rotate";

    this.measureDeltaX = 0;
    this.measureDeltaY = 0;
    this.measureClientY = 0;
    this.measureClientX = 0;
    this.measureTime = 0;
    this.direction = 0.0;

    this.height = 0;
    this.motionWhenRelease = 1.0;

    this.maxDistance = 0;
    this.minDistance = 0;
    this.goToLocationRunning = false;

    this.contactsIntialDistance =1.0;
    this.nbContacts = 0;
    this.contacts = [];
    this.contactsPosition = [];
    this.zoomModeUsed = false;

    // initialise the rotation
    osg.Matrix.makeRotate(-Math.PI/3.0, 1,0,0, this.rotation);

    this.scaleFactor = 10.0;
    if (options.rotationSpeedFactor !== undefined) {
        if (options.rotationSpeedFactor !== 0.0) {
            this.scaleFactor /= options.rotationSpeedFactor;
        }
    }

    this.minAutomaticMotion = 0.015;
    if (options.rotationIdleSpeedFactor !== undefined) {
        if (options.rotationIdleSpeedFactor !== 0.0) {
            this.minAutomaticMotion *= options.rotationIdleSpeedFactor;
        }
    }

    // initialise the motion damping
    this.motionDamping = options.motionDamping || 0.1;

    // if we are using device motion, then initialize it now
    if (options.deviceMotion) {
        this._initDeviceMotion();
    }
}

GlobeManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    panModel: function(dx, dy) {

        var inv = osg.Matrix.inverse(this.rotation);
        var x = [ osg.Matrix.get(inv, 0,0), osg.Matrix.get(inv, 0,1), 0 ];
        x = osg.Vec3.normalize(x);
        var y = [ osg.Matrix.get(inv, 1,0), osg.Matrix.get(inv, 1,1), 0 ];
        y = osg.Vec3.normalize(y);

        osg.Vec3.add(this.target, osg.Vec3.mult(x, -dx), this.target);
        osg.Vec3.add(this.target, osg.Vec3.mult(y, -dy), this.target);
    },

    getScaleFromHeight: function(eye) {
        var distFromSurface = eye;
        var scaleOneFromSurface = WGS_84_RADIUS_EQUATOR;
        var ratio = distFromSurface/scaleOneFromSurface;
        // clamp the scale
        if (ratio > 0.8) {
            ratio = 0.8;
        }
        //osg.log(ratio);
        var scale = ratio/20.0;
        return scale;
    },

    computeRotation: function(dx, dy) {
        
        var scale = this.scale,
            of = [];

        osg.Matrix.makeRotate(dx * scale, 0, 0, 1, of);
        var r = osg.Matrix.mult(this.rotation, of, []);

        osg.Matrix.makeRotate(dy * scale/2.0, 1,0,0, of);
        var r2 = osg.Matrix.mult(of,r, []);

        // test that the eye is not too up and not too down to not kill
        // the rotation matrix
        var eye = osg.Matrix.transformVec3(osg.Matrix.inverse(r2, []), [0, 0, this.distance], []);
        if (eye[2] > 0.99*this.distance || eye[2] < -0.99*this.distance) {
            //discard rotation on y
            this.rotation = r;
            return;
        }
        this.rotation = r2;
    },

    getGoToLocationQuaternion: function() {
        var goToLocationDuration = 2.0,
            target = this.target,
            distance = this.distance,
            q0 = osg.Matrix.getRotate(this.rotation),
            q1 = this.targetRotation,
            t = ((new Date()).getTime() - this.goToLocationTime)/1000.0,
            qCurrent = [];


        if (t > goToLocationDuration) {
            t = 1.0;
            this.goToLocationRunning = false;
            osg.Matrix.makeRotateFromQuat(q1, this.rotation);
            this.dx = 0;
            this.dy = 0;
        } else {
            t = osgAnimation.EaseOutCubic(t/goToLocationDuration);
        }

        qCurrent = osg.Quat.slerp(t, q0, q1, qCurrent);
        osg.Quat.conj(qCurrent, qCurrent);

        return qCurrent;
    },
    
    goToLocation: function(lat, lng) {
        var pos3d = [],
            lookat = [],
            q = [],
            qStart;

        // convert lat lng to xyz coord
        this.ellipsoidModel.convertLatLongHeightToXYZ(
            lat * Math.PI/180.0, 
            lng * Math.PI/180.0, 
            WGS_84_RADIUS_EQUATOR,
            pos3d
        );

        osg.Matrix.makeLookAt(pos3d, [0,0,0], [0,0,-1], lookat);

        osg.Matrix.getRotate(lookat, q);

        if (this.goToLocationRunning) {
            qStart = this.getGoToLocationQuaternion();
            this.rotation = osg.Matrix.makeRotateFromQuat(osg.Quat.conj(qStart));
        }

        this.targetRotation = q;
        this.goToLocationTime = (new Date()).getTime();
        this.goToLocationRunning = true;

        this.disableAutomaticMotion(4.0);
    },

    updateDelta: function(dx, dy) {
        if (dx > 0) {
            this.direction = 1.0;
        } else if (dx < 0) {
            this.direction = -1.0;
        }
        this.dx += dx;
        this.dy += dy;

        if (Math.abs(dx) + Math.abs(dy) > 0.0) {
            this.time = (new Date()).getTime();
        }
    },

    dblclick: function() {
        this.goToLocation(-3.948104, -54.045366);
        return true;
    },
    updateWithDelay: function() {
        var f = 1.0;
        var dt;
        var max = 2.0;
        var dx = this.dx;
        var dy = this.dy;
        if (this.buttonup) {
            f = 0.0;
            dt = ((new Date()).getTime() - this.time)/1000.0;
            if (dt < max) {
                f = 1.0 - osgAnimation.EaseOutQuad(dt/max);
            }
            dx *= f;
            dy *= f;

            var min = this.minAutomaticMotion;
            if (Math.abs(dx) < min) {
                dx = min*this.direction * this.motionWhenRelease;
                this.dx = dx;
            }

            var val = Math.abs(this.dx) + Math.abs(this.dy);

        } else {
            this.dx = 0;
            this.dy = 0;
        }

        if (Math.abs(dx) + Math.abs(dy) > 0.0) {
            this.computeRotation(dx, dy);
        }
    },

    disableAutomaticMotion: function(duration) {
        var min = this.minAutomaticMotion;
        this.motionWhenRelease = 0.0;
        if (this.timeout === undefined) {
            var that = this;
            this.timeout = true;
            window.setTimeout(function() {
                if (Math.abs(that.dx) + Math.abs(that.dy) === 0.0) {
                    that.motionWhenRelease = 1.0;
                    that.updateDelta(min+0.0001,0);
                }
                delete that.timeout;
            }, duration * 1000);
        }
    },

    mouseup: function(ev) {
        this.buttonup = true;
        
        var time = (new Date()).getTime()/1000.0;
        if (time - this.lastMotion > 0.05) {
            this.dx = 0;
            this.dy = 0;
            this.disableAutomaticMotion(4.0);
        } else {
            this.dx = this.lastDeltaX;
            this.dy = this.lastDeltaY;
            this.motionWhenRelease = 1.0;
        }

        if (this.pushHit !== undefined) {
            var hit = this.getIntersection();
            if (hit !== undefined) {
                if (hit.itemID === this.pushHit.itemID && hit.item.hitCallback !== undefined) {
                    hit.item.hitCallback();
                }
            }
        }

        //osg.log(this.dx + " " + this.dy);
    },
    mousemove: function(ev) {

        if (this.buttonup === true) {
            return;
        }

        var curX;
        var curY;
        var deltaX;
        var deltaY;
        var pos = this.getPositionRelativeToCanvas(ev);

        curX = pos[0];
        curY = pos[1];

        deltaX = (this.clientX - curX) / this.scaleFactor;
        deltaY = (this.clientY - curY) / this.scaleFactor;
        this.clientX = curX;
        this.clientY = curY;

        var time = (new Date()).getTime()/1000.0;
        this.lastMotion = time;
        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;

        this.updateDelta(deltaX, deltaY);
    },
    mousedown: function(ev) {
        var pos = this.getPositionRelativeToCanvas(ev);
        this.clientX = pos[0];
        this.clientY = pos[1];
        this.pushButton();
        this.measureTime = (new Date()).getTime()/1000.0;
    },

    touchstart: function(ev) {
        if (this.nbContacts >= 2 || (this.nbContacts < 2 && this.zoomModeUsed === true)) {
            return;
        }
        this.contacts[this.nbContacts] = ev.streamId;
        if (this.contactsPosition[this.nbContacts] === undefined) {
            this.contactsPosition[this.nbContacts] = {};
        }
        this.contactsPosition[this.nbContacts].x = ev.clientX;
        this.contactsPosition[this.nbContacts].y = ev.clientY;
        this.nbContacts++;
        if (this.nbContacts === 1) {
            this.mousedown(ev);
        } else {

            var x1 = this.contactsPosition[0].x;
            var x2 = this.contactsPosition[1].x;
            var y1 = this.contactsPosition[0].y;
            var y2 = this.contactsPosition[1].y;
            var dist = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
            this.contactsIntialDistance = dist;
            //osg.log("2 contacts " + this.contactsIntialDistance);
            }
    },
    touchend: function(ev) {
        if (this.zoomModeUsed === false && this.nbContacts === 1) {
            //osg.log("use a mouse up ");
            this.mouseup(ev);
        }
        this.nbContacts--;
        if (this.nbContacts === 0) {
            this.zoomModeUsed = false;
        }
    },
    touchmove: function(ev) {
        if (this.nbContacts === 2) {
            // zoom mode
            this.zoomModeUsed = true;
            if (this.contacts[0] === ev.streamId) {
                if (this.contactsPosition[0] === undefined) {
                    this.contactsPosition[0] = {};
                }
                this.contactsPosition[0].x = ev.clientX;
                this.contactsPosition[0].y = ev.clientY;
            } else if (this.contacts[1] === ev.streamId) {
                if (this.contactsPosition[1] === undefined) {
                    this.contactsPosition[1] = {};
                }
                this.contactsPosition[1].x = ev.clientX;
                this.contactsPosition[1].y = ev.clientY;
            } else {
                osg.log("dont find the contact something weird");
            }
            var x1 = this.contactsPosition[0].x;
            var x2 = this.contactsPosition[1].x;
            var y1 = this.contactsPosition[0].y;
            var y2 = this.contactsPosition[1].y;
            var dist = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
            var ratio = this.contactsIntialDistance/dist;

            this.contactsIntialDistance = dist;
            var h = this.height;
            //this.distance = this.targetDistance;
            this.targetDistance += (ratio - 1.0) * this.scale * 50.0* 6378137/2.0;
            if (this.maxDistance !== 0.0 && this.targetDistance > this.maxDistance) {
                this.targetDistance = this.maxDistance;
            }
            if (this.minDistance !== 0.0 && this.targetDistance < this.minDistance) {
                this.targetDistance = this.minDistance;
            }
            this.distance = this.targetDistance;
            //osg.log("target distance " + this.targetDistance);
            this.timeMotion = (new Date()).getTime();
            
        } else {
            // rotation
            if (this.zoomModeUsed === false) {
                this.mousemove(ev);
            }
        }
    },

    setDistance: function(d) {
        this.distance = d;
        this.targetDistance = this.distance;
    },
    setMaxDistance: function(d) {
        this.maxDistance =  d;
    },
    setMinDistance: function(d) {
        this.minDistance =  d;
    },

    getHeight: function() {
        var h, lat, lng, llh = [];

        this.ellipsoidModel.convertXYZToLatLongHeight(this.eye[0], this.eye[1], this.eye[2], llh);
        return llh[2];
        //osg.log("height " + llh[2] + " distance " + this.distance);
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
    if (intDelta > 0){
            if (this.distanceDecrease) {
                this.distanceDecrease();
            }
    }
    else if (intDelta < 0){
            if (this.distanceIncrease) {
                this.distanceIncrease();
            }
    }
    },
    distanceIncrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget + h/10.0;
        if (this.maxDistance > 0) {
            if (newTarget > this.maxDistance) {
                newTarget = this.maxDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    distanceDecrease: function() {
        var h = this.height;
        var currentTarget = this.targetDistance;
        var newTarget = currentTarget - h/10.0;
        if (this.minDistance > 0) {
            if (newTarget < this.minDistance) {
                newTarget = this.minDistance;
            }
        }
        this.distance = currentTarget;
        this.targetDistance = newTarget;
        this.timeMotion = (new Date()).getTime();
    },
    
    pushButton: function() {
        this.dx = this.dy = 0;
        this.buttonup = false;

        var hit = this.getIntersection();
        this.pushHit = hit;
    },

    getIntersection: function() {
        var hits = this.view.computeIntersections(this.clientX, this.clientY, 1);
        var l = hits.length;
        if (l === 0 ) {
            return undefined;
        }
        hits.sort(function(a,b) {
            return a.ratio - b.ratio;
        });

        // use the first hit
        var hit = hits[0].nodepath;
        var l2 = hit.length;
        var itemSelected;
        var itemID;
        while (l2-- >= 0) {
            if (hit[l2].itemToIntersect !== undefined) {
                itemID = hit[l2].itemID;
                //itemSelected = hit[l2].children[0].getUpdateCallback();
                itemSelected = hit[l2];
                break;
            }
        }
        return { 'itemID': itemID, 
                 'item': itemSelected };
    },

    getInverseMatrix: function () {
        var inv,
            target = this.target,
            distance = this.distance,
            qCurrent;

        if (this.goToLocationRunning === true ) {
            qCurrent = this.getGoToLocationQuaternion();
            osg.Matrix.transformVec3(osg.Matrix.makeRotateFromQuat(qCurrent, []), [0, 0, distance], this.eye);
            inv = osg.Matrix.makeLookAt(osg.Vec3.add(target, this.eye, []), target, [0,0,1], []);

        } else {

            this.updateWithDelay();

            if (this.timeMotion !== undefined) { // we have a camera motion event
                var dt = ((new Date()).getTime() - this.timeMotion)/1000.0;
                var motionDuration = 1.0;
                if (dt < motionDuration) {
                    var r = osgAnimation.EaseOutQuad(dt/motionDuration);
                    if (this.targetMotion) {
                        target = osg.Vec3.add(this.target, osg.Vec3.mult(osg.Vec3.sub(this.targetMotion, this.target), r));
                    }
                    if (this.targetDistance) {
                        distance = this.distance + (this.targetDistance - this.distance) * r;
                    }
                } else {
                    if (this.targetMotion) {
                        this.target = this.targetMotion;
                        target = this.targetMotion;
                    }
                    if (this.targetDistance) {
                        this.distance = this.targetDistance;
                        distance = this.targetDistance;
                    }
                    this.timeMotion = undefined;
                }
            }
            
            //this.targetMotion
            var tmpInv = osg.Matrix._mytmp;
            if (tmpInv === undefined) {
                tmpInv = new Array(16);
                osg.Matrix._mytmp = tmpInv;
            }
            var success = osg.Matrix.inverse(this.rotation, tmpInv);
            osg.Matrix.transformVec3(tmpInv, [0, 0, distance], this.eye);
            inv = osg.Matrix.makeLookAt(osg.Vec3.add(target, this.eye, []), target, [0,0,1], []);
        }

        this.height = this.getHeight();
        this.scale = this.getScaleFromHeight(this.height);
//        osg.log("height " + this.height + " scale " + this.height/6378137.0);
        return inv;
    },

    /**
    ## _handleMotion

    This is the event handler for the `devicemotion` event.  The handler is designed to be
    invoked bound to the manipulator scope.
    */
    _handleMotion: function(evt) {
        var accel = evt.accelerationIncludingGravity;

        this.disableAutomaticMotion(0.5);
        this.updateDelta(
            (accel.x / 180) * this.motionDamping, 
            (accel.y / 180) * this.motionDamping
        );
    },

    /**
    ## _initDeviceMotion

    This method is used to listen for device motion events and apply the appropriate updates on 
    on the globe.
    */
    _initDeviceMotion: function() {
        window.addEventListener('devicemotion', this._handleMotion.bind(this), false);
    }
});

/**
# osgGlobe.Globe
*/
osgGlobe.Globe = function(canvas, options) {
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

    // create the manipulators
    manipulator = this._initManipulators(options);

    // initialise the viewer
    viewer = this.viewer = new osgViewer.Viewer(canvas);
    viewer.init();
    viewer.getCamera().setProjectionMatrix(osg.Matrix.makePerspective(30, ratio, 1000.0, 100000000.0, []));
    viewer.setupManipulator(manipulator);

    // create the scene
    this.sceneData = this.createScene();
    viewer.setSceneData(this.sceneData.root);
    viewer.run();

    setTimeout(function() {
        manipulator.goToLocation(-27, 153);
    }, 500);

    /*
    this.viewer.run = function() {
        osgViewer.Viewer.prototype.run.call(this);
    };
    */
}

osgGlobe.Globe.prototype = {
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
        scene.addChild(backSphere);
        scene.addChild(frontSphere);
        scene.addChild(countryScale);
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
    },

    /**
    ## _initManipulators()

    The _initManipulators method is used to create all the manipulators that are used, and a 
    single switch manipulator is returned.
    */
    _initManipulators: function(options) {
        var manipulator,
            manipulators = this.manipulators = {};

        // create the orbit manipulators
        manipulator = manipulators.orbit = new osgGlobe.OrbitManipulator(options);
        manipulator.setDistance(6378137 * 1.2);
        manipulator.setMaxDistance(6378137 * 2.5);
        manipulator.setMinDistance(6378137 * 0.95);

        // create the position locked manipulator
        manipulator = manipulators.locked = new osgGlobe.PositionLockedManipulator(options); 

        // return the default manipulator
        return manipulators[options.manipulator || 'orbit'];
    }
};
