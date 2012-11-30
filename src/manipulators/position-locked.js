/**
# osgGlobe.OrbitManipulator
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

    // if we have a target position
    this.targetPos = undefined;

    // initialise the deviec motion
    this._initDeviceMotion();
}

osgGlobe.PositionLockedManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
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
        // initialise the antipode
        this.targetPos = {
            lat: lat > 180 ? lat - 180 : lat + 180,
            lng: -lng
        };

        // initialise the base location
        this.eye = this.ellipsoidModel.convertLatLongHeightToXYZ(
            lat * DEG2RAD, 
            lng * DEG2RAD, 
            WGS_84_RADIUS_EQUATOR,
            []
        );
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
        var eye = this.eye,
            target;

        // update the target based on the antipode position
        target = this.target =         osg.Matrix.makeLookAt(pos3d, [0,0,0], [0,0,-1], lookat);


        // success = osg.Matrix.inverse(this.computeRotation(this.dx, this.dy), tmpInv);
        // eye = this.eye = osg.Matrix.transformVec3(tmpInv, [0, 0, distance], eye);

        // calculate the inverse matrix
        return osg.Matrix.makeLookAt(osg.Vec3.add(target, eye, []), target, [0,0,1], []);
    },

    /**
    ## _handleMotion

    This is the event handler for the `devicemotion` event.  The handler is designed to be
    invoked bound to the manipulator scope.
    */
    _handleMotion: function(evt) {
        var accel = evt.accelerationIncludingGravity;

        // if we have an antipode specified then update
        if (this.antipode) {
            this.antipode.lat += (accel.y / 180) * this.motionDampingY;
            this.antipode.lng += (accel.x / 180) * this.motionDampingX;

            // clamp
        }
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