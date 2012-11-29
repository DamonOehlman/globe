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
    this.motionDampingX = options.motionDampingX || 1;
    this.motionDampingY = options.motionDampingY || 2;

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
        this.dx = (accel.x / 180) * this.motionDampingX;
        this.dy = (accel.y / 180) * this.motionDampingY;
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