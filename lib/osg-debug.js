// osg-debug-0.1.0.js commit e461cc628287759c0435f1caf708f864e334add5 - http://github.com/cedricpinson/osgjs
/** -*- compile-command: "jslint-cli osg.js" -*- */
var osg = {};

osg.version = '0.1.0';
osg.copyright = 'Cedric Pinson - cedric.pinson@plopbyte.com';

// log function
osg.log = function (str) {
    if (window.console !== undefined) {
        window.console.log(str);
    }
};

osg.info = function(str) {
    if (window.console !== undefined) {
        window.console.info(str);
    }
};

osg.warn = function (str) {
    if (window.console !== undefined) {
        window.console.warn(str);
    }
};

osg.debug = function (str) {
    if (window.console !== undefined) {
        window.console.debug(str);
    }
};

osg.DEBUG = 0;
osg.INFO = 1;
osg.NOTICE = 2;
osg.WARN = 3;

osg.setNotifyLevel = function (level) {
    var log = function (str) {
        if (window.console !== undefined) {
            window.console.log(str);
        }
    };

    var info = function(str) {
        if (window.console !== undefined) {
            window.console.info(str);
        }
    };

    var warn = function (str) {
        if (window.console !== undefined) {
            window.console.warn(str);
        }
    };

    var debug = function (str) {
        if (window.console !== undefined) {
            window.console.debug(str);
        }
    };

    var dummy = function () {};

    osg.debug = dummy;
    osg.info = dummy;
    osg.log = dummy;
    osg.warn = dummy;

    if (level <= osg.DEBUG) {
        osg.debug = debug;
    }
    if (level <= osg.INFO) {
        osg.info = info;
    }
    if (level <= osg.NOTICE) {
        osg.log = log;
    }
    if (level <= osg.WARN) {
        osg.warn = warn;
    }
};

osg.reportWebGLError = false;

osg.init = function () {
    osg.setNotifyLevel(osg.NOTICE);
};

// from jquery
osg.isArray = function ( obj ) {
    return toString.call(obj) === "[object Array]";
};

osg.extend = function () {
    // Save a reference to some core methods
    var toString = Object.prototype.toString,
    hasOwnPropertyFunc = Object.prototype.hasOwnProperty;

    var isFunction = function (obj) {
        return toString.call(obj) === "[object Function]";
    };
    var isArray = osg.isArray;
    var isPlainObject = function ( obj ) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
            return false;
	}
	
	// Not own constructor property must be Object
	if ( obj.constructor && 
             !hasOwnPropertyFunc.call(obj, "constructor") && 
             !hasOwnPropertyFunc.call(obj.constructor.prototype, "isPrototypeOf") ) {
            return false;
	}
	
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	
	var key;
	for ( key in obj ) {}
	
	return key === undefined || hasOwnPropertyFunc.call( obj, key );
    };

    // copy reference to target object
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
	deep = target;
	target = arguments[1] || {};
	// skip the boolean and the target
	i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !isFunction (target) ) {
	target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
	target = this;
	--i;
    }

    for ( ; i < length; i++ ) {
	// Only deal with non-null/undefined values
	if ( (options = arguments[ i ]) !== null ) {
            // Extend the base object
            for ( name in options ) {
		src = target[ name ];
		copy = options[ name ];

		// Prevent never-ending loop
		if ( target === copy ) {
                    continue;
		}

		// Recurse if we're merging object literal values or arrays
		if ( deep && copy && ( isPlainObject(copy) || isArray(copy) ) ) {
                    var clone = src && ( isPlainObject(src) || isArray(src) ) ? src
			: isArray(copy) ? [] : {};

                    // Never move original objects, clone them
                    target[ name ] = osg.extend( deep, clone, copy );

                    // Don't bring in undefined values
		} else if ( copy !== undefined ) {
                    target[ name ] = copy;
		}
            }
	}
    }

    // Return the modified object
    return target;
};

osg.objectInehrit = osg.objectInherit = function (base, extras) {
    function F(){}
    F.prototype = base;
    var obj = new F();
    if(extras)  {osg.objectMix(obj, extras, false); }
    return obj;
};
osg.objectMix = function (obj, properties, test){
    for (var key in properties) {
        if(!(test && obj[key])) { obj[key] = properties[key]; }
    }
    return obj;
};

osg.objectLibraryClass = function(object, libName, className) {
    object.className = function() { return className; };
    object.libraryName = function() { return libName; };
    var libraryClassName = libName+"::"+className;
    object.libraryClassName = function() { return libraryClassName; };
    return object;
};

osg.objectType = {};
osg.objectType.type = 0;
osg.objectType.generate = function (arg) {
    var t = osg.objectType.type;
    osg.objectType[t] = arg;
    osg.objectType[arg] = t;
    osg.objectType.type += 1;
    return t;
};

osg.Float32Array = Float32Array;
osg.Int32Array = Int32Array;
osg.Uint16Array = Uint16Array;


/** @class Vec2 Operations */
osg.Vec2 = {
    copy: function(a, r) {
        r[0] = a[0];
        r[1] = a[1];
        return r;
    },

    valid: function(a) {
        if (isNaN(a[0])) {
            return false;
        }
        if (isNaN(a[1])) {
            return false;
        }
        return true;
    },

    mult: function(a, b, r) {
        r[0] = a[0] * b;
        r[1] = a[1] * b;
        return r;
    },

    length2: function(a) {
        return a[0]*a[0] + a[1]*a[1];
    },

    length: function(a) {
        return Math.sqrt( a[0]*a[0] + a[1]* a[1]);
    },

    distance: function(a, b) {
        var x = a[0]-b[0];
        var y = a[1]-b[1];
        return Math.sqrt( x*x + y*y );
    },

    /** 
        normalize an Array of 2 elements and write it in r
     */
    normalize: function(a, r) {
        var norm = this.length2(a);
        if (norm > 0.0) {
            var inv = 1.0/Math.sqrt(norm);
            r[0] = a[0] * inv;
            r[1] = a[1] * inv;
        } else {
            r[0] = a[0];
            r[1] = a[1];
        }
        return r;
    },

    /** 
        Compute the dot product 
    */
    dot: function(a, b) {
        return a[0]*b[0]+a[1]*b[1];
    },

    /**
       Compute a - b and put the result in r
     */
    sub: function(a, b, r) {
        r[0] = a[0]-b[0];
        r[1] = a[1]-b[1];
        return r;
    },

    add: function(a, b, r) {
        r[0] = a[0]+b[0];
        r[1] = a[1]+b[1];
        return r;
    },

    neg: function(a, r) {
        r[0] = -a[0];
        r[1] = -a[1];
        return r;
    },

    lerp: function(t, a, b, r) {
        var tmp = 1.0-t;
        r[0] = a[0]*tmp + t*b[0];
        r[1] = a[1]*tmp + t*b[1];
        return r;
    }

};
/** @class Vec3 Operations */
osg.Vec3 = {
    init: function(a) {
        a[0] = 0; a[1] = 0; a[2] = 0;
        return a;
    },

    copy: function(a, r) {
        r[0] = a[0];
        r[1] = a[1];
        r[2] = a[2];
        return r;
    },

    cross: function(a, b, r) {
        var x = a[1]*b[2]-a[2]*b[1]; 
        var y = a[2]*b[0]-a[0]*b[2];
        var z = a[0]*b[1]-a[1]*b[0];
        r[0] = x;
        r[1] = y;
        r[2] = z;
        return r;
    },

    valid: function(a) {
        if (isNaN(a[0])) {
            return false;
        }
        if (isNaN(a[1])) {
            return false;
        }
        if (isNaN(a[2])) {
            return false;
        }
        return true;
    },

    mult: function(a, b, r) {
        r[0] = a[0] * b;
        r[1] = a[1] * b;
        r[2] = a[2] * b;
        return r;
    },

    length2: function(a) {
        return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];
    },

    length: function(a) {
        return Math.sqrt( a[0]*a[0] + a[1]* a[1] + a[2]*a[2] );
    },

    distance: function(a, b) {
        var x = a[0]-b[0];
        var y = a[1]-b[1];
        var z = a[2]-b[2];
        return Math.sqrt( x*x + y*y + z*z );
    },

    normalize: function(a, r) {
        var norm = this.length2(a);
        if (norm > 0.0) {
            var inv = 1.0/Math.sqrt(norm);
            r[0] = a[0] * inv;
            r[1] = a[1] * inv;
            r[2] = a[2] * inv;
        } else {
            r[0] = a[0];
            r[1] = a[1];
            r[2] = a[2];
        }
        return r;
    },

    dot: function(a, b) {
        return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    },

    sub: function(a, b, r) {
        r[0] = a[0]-b[0];
        r[1] = a[1]-b[1];
        r[2] = a[2]-b[2];
        return r;
    },

    add: function(a, b, r) {
        r[0] = a[0]+b[0];
        r[1] = a[1]+b[1];
        r[2] = a[2]+b[2];
        return r;
    },

    neg: function(a, r) {
        r[0] = -a[0];
        r[1] = -a[1];
        r[2] = -a[2];
        return r;
    },

    lerp: function(t, a, b, r) {
        r[0] = a[0] + (b[0]-a[0])*t;
        r[1] = a[1] + (b[1]-a[1])*t;
        r[2] = a[2] + (b[2]-a[2])*t;
        return r;
    }

};



/** @class Vec4 Operations */
osg.Vec4 = {

    dot: function(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
    },

    copy: function(a, r) {
        r[0] = a[0];
        r[1] = a[1];
        r[2] = a[2];
        r[3] = a[3];
        return r;
    },

    sub: function(a, b, r) {
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];
        r[3] = a[3] - b[3];
        return r;
    },

    mult: function(a, b, result) {
        r[0] = a[0] * b;
        r[1] = a[1] * b;
        r[2] = a[2] * b;
        r[3] = a[3] * b;
        return r;
    },

    add: function(a, b, r) {
        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];
        r[3] = a[3] + b[3];
        return r;
    },

    neg: function(a, r) {
        r[0] = -a[0];
        r[1] = -a[1];
        r[2] = -a[2];
        r[3] = -a[3];
        return r;
    },

    lerp: function(t, a, b, r) {
        var tmp = 1.0-t;
        r[0] = a[0]*tmp + t*b[0];
        r[1] = a[1]*tmp + t*b[1];
        r[2] = a[2]*tmp + t*b[2];
        r[3] = a[3]*tmp + t*b[3];
        return r;
    }
};
/** -*- compile-command: "jslint-cli Object.js" -*- */

/** 
 *  Object class
 *  @class Object
 */
osg.Object = function () {
    this._name = undefined;
    this._userdata = undefined;
};

/** @lends osg.Object.prototype */
osg.Object.prototype = osg.objectLibraryClass( 
    {
        setName: function(name) { this._name = name; },
        getName: function() { return this._name; },
        setUserData: function(data) { this._userdata = data; },
        getUserData: function() { return this._userdata; }
    }, 
    "osg","Object");


/** @class Matrix Operations */
osg.Matrix = {
    _tmp0: [],
    _tmp1: [],
    valid: function(matrix) {
        for (var i = 0; i < 16; i++) {
            if (isNaN(matrix[i])) {
                return false;
            }
        }
        return true;
    },
    setRow: function(matrix, row, v0, v1, v2, v3) {
        var rowIndex = row*4;
        matrix[rowIndex + 0 ] = v0;
        matrix[rowIndex + 1 ] = v1;
        matrix[rowIndex + 2 ] = v2;
        matrix[rowIndex + 3 ] = v3;
    },
    innerProduct: function(a, b, r, c) {
        var rIndex = r * 4;
        return ((a[rIndex + 0] * b[0 + c]) + (a[rIndex + 1] * b[4 + c]) + (a[rIndex +2] * b[8 + c]) + (a[rIndex + 3] * b[12 + c]));
    },

    set: function(matrix, row, col, value) {
        matrix[row * 4 + col] = value;
	return value;
    },

    get: function(matrix, row, col) {
        return matrix[row * 4 + col];
    },

    makeIdentity: function(matrix) {
        if (matrix === undefined) {
            matrix = [];
            osg.log("osg.Matrix.makeIdentity without matrix destination is deprecated"); 
        }
        osg.Matrix.setRow(matrix, 0,    1, 0, 0, 0 );
        osg.Matrix.setRow(matrix, 1,    0, 1, 0, 0 );
        osg.Matrix.setRow(matrix, 2,    0, 0, 1, 0 );
        osg.Matrix.setRow(matrix, 3,    0, 0, 0, 1 );
        return matrix;
    },

    /**
     * @param {Number} x position
     * @param {Number} y position
     * @param {Number} z position
     * @param {Array} matrix to write result
     */
    makeTranslate: function(x, y, z, matrix) {
        if (matrix === undefined) {
            matrix = [];
        }
        osg.Matrix.setRow(matrix, 0,    1, 0, 0, 0 );
        osg.Matrix.setRow(matrix, 1,    0, 1, 0, 0 );
        osg.Matrix.setRow(matrix, 2,    0, 0, 1, 0 );
        osg.Matrix.setRow(matrix, 3,    x, y, z, 1 );
        return matrix;
    },

    setTrans: function(matrix, x, y, z) {
        matrix[12] = x;
        matrix[13] = y;
        matrix[14] = z;
        return matrix;
    },

    getTrans: function(matrix, result) {
        result[0] = matrix[12];
        result[1] = matrix[13];
        result[2] = matrix[14];
        return result;
    },

    // do a * b and result in a
    preMult: function(a, b) {
        var atmp0, atmp1, atmp2, atmp3;

        atmp0 = (b[0] * a[0]) + (b[1] * a[4]) + (b[2] * a[8]) + (b[3] * a[12]);
        atmp1 = (b[4] * a[0]) + (b[5] * a[4]) + (b[6] * a[8]) + (b[7] * a[12]);
        atmp2 = (b[8] * a[0]) + (b[9] * a[4]) + (b[10] * a[8]) + (b[11] * a[12]);
        atmp3 = (b[12] * a[0]) + (b[13] * a[4]) + (b[14] * a[8]) + (b[15] * a[12]);
        a[0]  = atmp0;
        a[4]  = atmp1;
        a[8]  = atmp2;
        a[12] = atmp3;

        atmp0 = (b[0] * a[1]) + (b[1] * a[5]) + (b[2] * a[9]) + (b[3] * a[13]);
        atmp1 = (b[4] * a[1]) + (b[5] * a[5]) + (b[6] * a[9]) + (b[7] * a[13]);
        atmp2 = (b[8] * a[1]) + (b[9] * a[5]) + (b[10] * a[9]) + (b[11] * a[13]);
        atmp3 = (b[12] * a[1]) + (b[13] * a[5]) + (b[14] * a[9]) + (b[15] * a[13]);
        a[1]  = atmp0;
        a[5]  = atmp1;
        a[9]  = atmp2;
        a[13] = atmp3;

        atmp0 = (b[0] * a[2]) + (b[1] * a[6]) + (b[2] * a[10]) + (b[3] * a[14]);
        atmp1 = (b[4] * a[2]) + (b[5] * a[6]) + (b[6] * a[10]) + (b[7] * a[14]);
        atmp2 = (b[8] * a[2]) + (b[9] * a[6]) + (b[10] * a[10]) + (b[11] * a[14]);
        atmp3 = (b[12] * a[2]) + (b[13] * a[6]) + (b[14] * a[10]) + (b[15] * a[14]);
        a[2]  = atmp0;
        a[6]  = atmp1;
        a[10] = atmp2;
        a[14] = atmp3;

        atmp0 = (b[0] * a[3]) + (b[1] * a[7]) + (b[2] * a[11]) + (b[3] * a[15]);
        atmp1 = (b[4] * a[3]) + (b[5] * a[7]) + (b[6] * a[11]) + (b[7] * a[15]);
        atmp2 = (b[8] * a[3]) + (b[9] * a[7]) + (b[10] * a[11]) + (b[11] * a[15]);
        atmp3 = (b[12] * a[3]) + (b[13] * a[7]) + (b[14] * a[11]) + (b[15] * a[15]);
        a[3]  = atmp0;
        a[7]  = atmp1;
        a[11] = atmp2;
        a[15] = atmp3;

        return a;
    },

    // do a * b and result in b
    postMult: function(a, b) {
        // post mult
        btmp0 = (b[0] * a[0]) + (b[1] * a[4]) + (b[2] * a[8]) + (b[3] * a[12]);
        btmp1 = (b[0] * a[1]) + (b[1] * a[5]) + (b[2] * a[9]) + (b[3] * a[13]);
        btmp2 = (b[0] * a[2]) + (b[1] * a[6]) + (b[2] * a[10]) + (b[3] * a[14]);
        btmp3 = (b[0] * a[3]) + (b[1] * a[7]) + (b[2] * a[11]) + (b[3] * a[15]);
        b[0 ] = btmp0;
        b[1 ] = btmp1;
        b[2 ] = btmp2;
        b[3 ] = btmp3;

        btmp0 = (b[4] * a[0]) + (b[5] * a[4]) + (b[6] * a[8]) + (b[7] * a[12]);
        btmp1 = (b[4] * a[1]) + (b[5] * a[5]) + (b[6] * a[9]) + (b[7] * a[13]);
        btmp2 = (b[4] * a[2]) + (b[5] * a[6]) + (b[6] * a[10]) + (b[7] * a[14]);
        btmp3 = (b[4] * a[3]) + (b[5] * a[7]) + (b[6] * a[11]) + (b[7] * a[15]);
        b[4 ] = btmp0;
        b[5 ] = btmp1;
        b[6 ] = btmp2;
        b[7 ] = btmp3;

        btmp0 = (b[8] * a[0]) + (b[9] * a[4]) + (b[10] * a[8]) + (b[11] * a[12]);
        btmp1 = (b[8] * a[1]) + (b[9] * a[5]) + (b[10] * a[9]) + (b[11] * a[13]);
        btmp2 = (b[8] * a[2]) + (b[9] * a[6]) + (b[10] * a[10]) + (b[11] * a[14]);
        btmp3 = (b[8] * a[3]) + (b[9] * a[7]) + (b[10] * a[11]) + (b[11] * a[15]);
        b[8 ] = btmp0;
        b[9 ] = btmp1;
        b[10] = btmp2;
        b[11] = btmp3;

        btmp0 = (b[12] * a[0]) + (b[13] * a[4]) + (b[14] * a[8]) + (b[15] * a[12]);
        btmp1 = (b[12] * a[1]) + (b[13] * a[5]) + (b[14] * a[9]) + (b[15] * a[13]);
        btmp2 = (b[12] * a[2]) + (b[13] * a[6]) + (b[14] * a[10]) + (b[15] * a[14]);
        btmp3 = (b[12] * a[3]) + (b[13] * a[7]) + (b[14] * a[11]) + (b[15] * a[15]);
        b[12] = btmp0;
        b[13] = btmp1;
        b[14] = btmp2;
        b[15] = btmp3;

        return b;
    },
    multa: function(a, b, r) {
        if (r === a) {
            return this.preMult(a,b);
        } else if (r === b) {
            return this.postMult(a,b);
        } else {
            if (r === undefined) {
                r = [];
            }
            r[0] =  b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12];
            r[1] =  b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13];
            r[2] =  b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14];
            r[3] =  b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15];

            r[4] =  b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12];
            r[5] =  b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13];
            r[6] =  b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14];
            r[7] =  b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15];

            r[8] =  b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12];
            r[9] =  b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13];
            r[10] = b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14];
            r[11] = b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15];

            r[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12];
            r[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13];
            r[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14];
            r[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15];

            return r;
        }
    },
    /* r = a * b */
    mult: function(a, b, r) {
        var s00 = b[0];
        var s01 = b[1];
        var s02 = b[2];
        var s03 = b[3];
        var s10 = b[4];
        var s11 = b[5];
        var s12 = b[6];
        var s13 = b[7];
        var s20 = b[8];
        var s21 = b[9];
        var s22 = b[10];
        var s23 = b[11];
        var s30 = b[12];
        var s31 = b[13];
        var s32 = b[14];
        var s33 = b[15];

        var o00 = a[0];
        var o01 = a[1];
        var o02 = a[2];
        var o03 = a[3];
        var o10 = a[4];
        var o11 = a[5];
        var o12 = a[6];
        var o13 = a[7];
        var o20 = a[8];
        var o21 = a[9];
        var o22 = a[10];
        var o23 = a[11];
        var o30 = a[12];
        var o31 = a[13];
        var o32 = a[14];
        var o33 = a[15];

        r[0] =  s00 * o00 + s01 * o10 + s02 * o20 + s03 * o30;
        r[1] =  s00 * o01 + s01 * o11 + s02 * o21 + s03 * o31;
        r[2] =  s00 * o02 + s01 * o12 + s02 * o22 + s03 * o32;
        r[3] =  s00 * o03 + s01 * o13 + s02 * o23 + s03 * o33;

        r[4] =  s10 * o00 + s11 * o10 + s12 * o20 + s13 * o30;
        r[5] =  s10 * o01 + s11 * o11 + s12 * o21 + s13 * o31;
        r[6] =  s10 * o02 + s11 * o12 + s12 * o22 + s13 * o32;
        r[7] =  s10 * o03 + s11 * o13 + s12 * o23 + s13 * o33;

        r[8] =  s20 * o00 + s21 * o10 + s22 * o20 + s23 * o30;
        r[9] =  s20 * o01 + s21 * o11 + s22 * o21 + s23 * o31;
        r[10] = s20 * o02 + s21 * o12 + s22 * o22 + s23 * o32;
        r[11] = s20 * o03 + s21 * o13 + s22 * o23 + s23 * o33;

        r[12] = s30 * o00 + s31 * o10 + s32 * o20 + s33 * o30;
        r[13] = s30 * o01 + s31 * o11 + s32 * o21 + s33 * o31;
        r[14] = s30 * o02 + s31 * o12 + s32 * o22 + s33 * o32;
        r[15] = s30 * o03 + s31 * o13 + s32 * o23 + s33 * o33;

        return r;
    },
    multOrig: function(a, b, r) {
        var t;
        if (r === a) {
            // pre mult
            t = [];
            for (var col = 0; col < 4; col++) {
                t[0] = osg.Matrix.innerProduct(b, a, 0, col);
                t[1] = osg.Matrix.innerProduct(b, a, 1, col);
                t[2] = osg.Matrix.innerProduct(b, a, 2, col);
                t[3] = osg.Matrix.innerProduct(b, a, 3, col);
                a[0 + col] = t[0];
                a[4 + col] = t[1];
                a[8 + col] = t[2];
                a[12 + col] = t[3];
            }
            return a;
            //return this.preMult(r, b);
        } else if (r === b) {
            // post mult
            t = [];
            for (var row = 0; row < 4; row++) {
                t[0] = osg.Matrix.innerProduct(b, a, row, 0);
                t[1] = osg.Matrix.innerProduct(b, a, row, 1);
                t[2] = osg.Matrix.innerProduct(b, a, row, 2);
                t[3] = osg.Matrix.innerProduct(b, a, row, 3);
                this.setRow(b, row, t[0], t[1], t[2], t[3]);
            }
            return b;
            //return this.postMult(r, a);
        }
        if (r === undefined) {
            r = [];
        }

        var s00 = b[0];
        var s01 = b[1];
        var s02 = b[2];
        var s03 = b[3];
        var s10 = b[4];
        var s11 = b[5];
        var s12 = b[6];
        var s13 = b[7];
        var s20 = b[8];
        var s21 = b[9];
        var s22 = b[10];
        var s23 = b[11];
        var s30 = b[12];
        var s31 = b[13];
        var s32 = b[14];
        var s33 = b[15];

        var o00 = a[0];
        var o01 = a[1];
        var o02 = a[2];
        var o03 = a[3];
        var o10 = a[4];
        var o11 = a[5];
        var o12 = a[6];
        var o13 = a[7];
        var o20 = a[8];
        var o21 = a[9];
        var o22 = a[10];
        var o23 = a[11];
        var o30 = a[12];
        var o31 = a[13];
        var o32 = a[14];
        var o33 = a[15];

        r[0] =  s00 * o00 + s01 * o10 + s02 * o20 + s03 * o30;
        r[1] =  s00 * o01 + s01 * o11 + s02 * o21 + s03 * o31;
        r[2] =  s00 * o02 + s01 * o12 + s02 * o22 + s03 * o32;
        r[3] =  s00 * o03 + s01 * o13 + s02 * o23 + s03 * o33;

        r[4] =  s10 * o00 + s11 * o10 + s12 * o20 + s13 * o30;
        r[5] =  s10 * o01 + s11 * o11 + s12 * o21 + s13 * o31;
        r[6] =  s10 * o02 + s11 * o12 + s12 * o22 + s13 * o32;
        r[7] =  s10 * o03 + s11 * o13 + s12 * o23 + s13 * o33;

        r[8] =  s20 * o00 + s21 * o10 + s22 * o20 + s23 * o30;
        r[9] =  s20 * o01 + s21 * o11 + s22 * o21 + s23 * o31;
        r[10] = s20 * o02 + s21 * o12 + s22 * o22 + s23 * o32;
        r[11] = s20 * o03 + s21 * o13 + s22 * o23 + s23 * o33;

        r[12] = s30 * o00 + s31 * o10 + s32 * o20 + s33 * o30;
        r[13] = s30 * o01 + s31 * o11 + s32 * o21 + s33 * o31;
        r[14] = s30 * o02 + s31 * o12 + s32 * o22 + s33 * o32;
        r[15] = s30 * o03 + s31 * o13 + s32 * o23 + s33 * o33;

        return r;
    },

    makeLookAt: function(eye, center, up, result) {

        if (result === undefined) {
            result = [];
        }

        var f = osg.Vec3.sub(center, eye, []);
        osg.Vec3.normalize(f, f);

        var s = osg.Vec3.cross(f, up, []);
        osg.Vec3.normalize(s, s);

        var u = osg.Vec3.cross(s, f, []);
        osg.Vec3.normalize(u, u);

        // s[0], u[0], -f[0], 0.0,
        // s[1], u[1], -f[1], 0.0,
        // s[2], u[2], -f[2], 0.0,
        // 0,    0,    0,     1.0

        result[0]=s[0]; result[1]=u[0]; result[2]=-f[0]; result[3]=0.0;
        result[4]=s[1]; result[5]=u[1]; result[6]=-f[1]; result[7]=0.0;
        result[8]=s[2]; result[9]=u[2]; result[10]=-f[2];result[11]=0.0;
        result[12]=  0; result[13]=  0; result[14]=  0;  result[15]=1.0;

        osg.Matrix.multTranslate(result, osg.Vec3.neg(eye, []), result);
        return result;
    },
    makeOrtho: function(left, right,
                        bottom, top,
                        zNear, zFar, result)
    {
        if (result === undefined) {
            result = [];
        }
        // note transpose of Matrix_implementation wr.t OpenGL documentation, since the OSG use post multiplication rather than pre.
        // we will change this convention later
        var tx = -(right+left)/(right-left);
        var ty = -(top+bottom)/(top-bottom);
        var tz = -(zFar+zNear)/(zFar-zNear);
        var row = osg.Matrix.setRow;
        row(result, 0, 2.0/(right-left),              0.0,               0.0, 0.0);
        row(result, 1,              0.0, 2.0/(top-bottom),               0.0, 0.0);
        row(result, 2,              0.0,              0.0, -2.0/(zFar-zNear), 0.0);
        row(result, 3,               tx,               ty,                tz, 1.0);
        return result;
    },

    getLookAt: function(matrix, eye, center, up, distance) {
        if (distance === undefined) {
            distance = 1.0;
        }
        var inv = [];
        var result = osg.Matrix.inverse(matrix, inv);
        if (!result) {
            osg.Matrix.makeIdentity(inv);
        }
        osg.Matrix.transformVec3(inv, [0,0,0], eye);
        osg.Matrix.transform3x3(matrix, [0,1,0], up);
        osg.Matrix.transform3x3(matrix, [0,0,-1], center);
        osg.Vec3.normalize(center, center);
        osg.Vec3.add(osg.Vec3.mult(center, distance, [] ), eye, center);
    },

    //getRotate_David_Spillings_Mk1
    getRotate: function (mat, quatResult) {
        if (quatResult === undefined) {
            quatResult = [];
        }

        var s;
        var tq = [];
        var i, j;

        // Use tq to store the largest trace
        var mat00 = mat[4*0 + 0];
        var mat11 = mat[4*1 + 1];
        var mat22 = mat[4*2 + 2];
        tq[0] = 1 + mat00 + mat11 + mat22;
        tq[1] = 1 + mat00 - mat11 - mat22;
        tq[2] = 1 - mat00 + mat11 - mat22;
        tq[3] = 1 - mat00 - mat11 + mat22;

        // Find the maximum (could also use stacked if's later)
        j = 0;
        for(i=1;i<4;i++) {
            if ((tq[i]>tq[j])) {
                j = i;
            } else {
                j = j;
            }
        }

        // check the diagonal
        if (j===0)
        {
            /* perform instant calculation */
            quatResult[3] = tq[0];
            quatResult[0] = mat[1*4+2]-mat[2*4+1];
            quatResult[1] = mat[2*4+0]-mat[0  +2]; 
            quatResult[2] = mat[0  +1]-mat[1*4+0]; 
        }
        else if (j==1)
        {
            quatResult[3] = mat[1*4+2]-mat[2*4+1]; 
            quatResult[0] = tq[1];
            quatResult[1] = mat[0  +1]+mat[1*4+0]; 
            quatResult[2] = mat[2*4+0]+mat[0  +2];
        }
        else if (j==2)
        {
            quatResult[3] = mat[2*4+0]-mat[0+2]; 
            quatResult[0] = mat[0  +1]+mat[1*4+0]; 
            quatResult[1] = tq[2];
            quatResult[2] = mat[1*4+2]+mat[2*4+1]; 
        }
        else /* if (j==3) */
        {
            quatResult[3] = mat[0  +1]-mat[1*4+0]; 
            quatResult[0] = mat[2*4+0]+mat[0  +2]; 
            quatResult[1] = mat[1*4+2]+mat[2*4+1];
            quatResult[2] = tq[3];
        }

        s = Math.sqrt(0.25/tq[j]);
        quatResult[3] *= s;
        quatResult[0] *= s;
        quatResult[1] *= s;
        quatResult[2] *= s;

        return quatResult;
    },

    // Matrix M = Matrix M * Matrix Translate
    preMultTranslate: function(mat, translate) {
        if (translate[0] !== 0.0) {
            val = translate[0];
            mat[12] += val * mat[0];
            mat[13] += val * mat[1];
            mat[14] += val * mat[2];
            mat[15] += val * mat[3];
        }

        if (translate[1] !== 0.0) {
            val = translate[1];
            mat[12] += val * mat[4];
            mat[13] += val * mat[5];
            mat[14] += val * mat[6];
            mat[15] += val * mat[7];
        }

        if (translate[2] !== 0.0) {
            val = translate[2];
            mat[12] += val * mat[8];
            mat[13] += val * mat[9];
            mat[14] += val * mat[10];
            mat[15] += val * mat[11];
        }
        return mat;
    },


    // result = Matrix M * Matrix Translate
    multTranslate: function(mat, translate, result) {
        if (result === undefined) {
            result = [];
        }
        if (result !== mat) {
            osg.Matrix.copy(mat, result);
        }

        var val;
        if (translate[0] !== 0.0) {
            val = translate[0];
            result[12] += val * mat[0];
            result[13] += val * mat[1];
            result[14] += val * mat[2];
            result[15] += val * mat[3];
        }

        if (translate[1] !== 0.0) {
            val = translate[1];
            result[12] += val * mat[4];
            result[13] += val * mat[5];
            result[14] += val * mat[6];
            result[15] += val * mat[7];
        }

        if (translate[2] !== 0.0) {
            val = translate[2];
            result[12] += val * mat[8];
            result[13] += val * mat[9];
            result[14] += val * mat[10];
            result[15] += val * mat[11];
        }
        return result;
    },

    makeRotate: function (angle, x, y, z, result) {
        if (result === undefined) {
            osg.log("osg.makeRotate without given matrix destination is deprecated");
            result = [];
        }

        var mag = Math.sqrt(x*x + y*y + z*z);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        if (mag > 0.0) {
            var xx, yy, zz, xy, yz, zx, xs, ys, zs;
            var oneMinusCos;
            var rotMat;
            mag = 1.0/mag;

            x *= mag;
            y *= mag;
            z *= mag;

            xx = x * x;
            yy = y * y;
            zz = z * z;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * sinAngle;
            ys = y * sinAngle;
            zs = z * sinAngle;
            oneMinusCos = 1.0 - cosAngle;

            result[0] = (oneMinusCos * xx) + cosAngle;
            result[1] = (oneMinusCos * xy) - zs;
            result[2] = (oneMinusCos * zx) + ys;
            result[3] = 0.0;

            result[4] = (oneMinusCos * xy) + zs;
            result[5] = (oneMinusCos * yy) + cosAngle;
            result[6] = (oneMinusCos * yz) - xs;
            result[7] = 0.0;

            result[8] = (oneMinusCos * zx) - ys;
            result[9] = (oneMinusCos * yz) + xs;
            result[10] = (oneMinusCos * zz) + cosAngle;
            result[11] = 0.0;

            result[12] = 0.0;
            result[13] = 0.0;
            result[14] = 0.0;
            result[15] = 1.0;

            return result;
        } else {
            return osg.Matrix.makeIdentity(result);
        }

        return result;
    },

    transform3x3: function(m, v, result) {
        if (result === undefined) {
            result = [];
        }
        result[0] = m[0] * v[0] + m[1]*v[1] + m[2]*v[2];
        result[1] = m[4] * v[0] + m[5]*v[1] + m[6]*v[2];
        result[2] = m[8] * v[0] + m[9]*v[1] + m[10]*v[2];
        return result;
    },

    transformVec3: function(matrix, vector, result) {
        var d = 1.0/(matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15]); 

        if (result === undefined) {
            osg.warn("deprecated, osg.Matrix.transformVec3 needs a third parameter as result");
            result = [];
        }

        var tmp;
        if (result === vector) {
            tmp = [];
        } else {
            tmp = result;
        }
        tmp[0] = (matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12]) * d;
        tmp[1] = (matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13]) * d;
        tmp[2] = (matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14]) * d;

        if (result === vector) {
            osg.Vec3.copy(tmp, result);
        }
        return result;
    },

    transformVec4: function(matrix, vector, result) {
        if (result === undefined) {
            result = [];
        }
        var tmp;
        if (result === vector) {
            tmp = [];
        } else {
            tmp = result;
        }
        tmp[0] = (matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2] + matrix[3]*vector[3]);
        tmp[1] = (matrix[4] * vector[0] + matrix[5] * vector[1] + matrix[6] * vector[2] + matrix[7]*vector[3]);
        tmp[2] = (matrix[8] * vector[0] + matrix[9] * vector[1] + matrix[10] * vector[2] + matrix[11]*vector[3]);
        tmp[3] = (matrix[12] * vector[0] + matrix[13] * vector[1] + matrix[14] * vector[2] + matrix[15]*vector[3]);

        if (result === vector) {
            osg.Vec4.copy(tmp, result);
        }
        return result;
    },

    copy: function(matrix, result) {
        if (result === undefined) {
            result = [];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    },

    inverse: function(matrix, result) {
        if (result === matrix) {
            osg.Matrix.copy(matrix, osg.Matrix._tmp1);
            matrix = osg.Matrix._tmp1;
        }
        
        if (matrix[3] === 0.0 && matrix[7] === 0.0 && matrix[11] === 0.0 && matrix[15] === 1.0) {
            return this.inverse4x3(matrix,result);
        } else {
            return this.inverse4x4(matrix,result);
        }
    },

    /**
     *  if a result argument is given the return of the function is true or false
     *  depending if the matrix can be inverted, else if no result argument is given
     *  the return is identity if the matrix can not be inverted and the matrix overthise
     */
    inverse4x4: function(matrix, result) {
        var tmp_0 = matrix[10] * matrix[15];
        var tmp_1 = matrix[14] * matrix[11];
        var tmp_2 = matrix[6] * matrix[15];
        var tmp_3 = matrix[14] * matrix[7];
        var tmp_4 = matrix[6] * matrix[11];
        var tmp_5 = matrix[10] * matrix[7];
        var tmp_6 = matrix[2] * matrix[15];
        var tmp_7 = matrix[14] * matrix[3];
        var tmp_8 = matrix[2] * matrix[11];
        var tmp_9 = matrix[10] * matrix[3];
        var tmp_10 = matrix[2] * matrix[7];
        var tmp_11 = matrix[6] * matrix[3];
        var tmp_12 = matrix[8] * matrix[13];
        var tmp_13 = matrix[12] * matrix[9];
        var tmp_14 = matrix[4] * matrix[13];
        var tmp_15 = matrix[12] * matrix[5];
        var tmp_16 = matrix[4] * matrix[9];
        var tmp_17 = matrix[8] * matrix[5];
        var tmp_18 = matrix[0] * matrix[13];
        var tmp_19 = matrix[12] * matrix[1];
        var tmp_20 = matrix[0] * matrix[9];
        var tmp_21 = matrix[8] * matrix[1];
        var tmp_22 = matrix[0] * matrix[5];
        var tmp_23 = matrix[4] * matrix[1];

        var t0 = ((tmp_0 * matrix[5] + tmp_3 * matrix[9] + tmp_4 * matrix[13]) -
                  (tmp_1 * matrix[5] + tmp_2 * matrix[9] + tmp_5 * matrix[13]));
        var t1 = ((tmp_1 * matrix[1] + tmp_6 * matrix[9] + tmp_9 * matrix[13]) -
                  (tmp_0 * matrix[1] + tmp_7 * matrix[9] + tmp_8 * matrix[13]));
        var t2 = ((tmp_2 * matrix[1] + tmp_7 * matrix[5] + tmp_10 * matrix[13]) -
                  (tmp_3 * matrix[1] + tmp_6 * matrix[5] + tmp_11 * matrix[13]));
        var t3 = ((tmp_5 * matrix[1] + tmp_8 * matrix[5] + tmp_11 * matrix[9]) -
                  (tmp_4 * matrix[1] + tmp_9 * matrix[5] + tmp_10 * matrix[9]));

        var d1 = (matrix[0] * t0 + matrix[4] * t1 + matrix[8] * t2 + matrix[12] * t3);
        if (Math.abs(d1) < 1e-5) {
            osg.log("Warning can't inverse matrix " + matrix);
            return false;
        }
        var d = 1.0 / d1;

        var out_00 = d * t0;
        var out_01 = d * t1;
        var out_02 = d * t2;
        var out_03 = d * t3;

        var out_10 = d * ((tmp_1 * matrix[4] + tmp_2 * matrix[8] + tmp_5 * matrix[12]) -
                          (tmp_0 * matrix[4] + tmp_3 * matrix[8] + tmp_4 * matrix[12]));
        var out_11 = d * ((tmp_0 * matrix[0] + tmp_7 * matrix[8] + tmp_8 * matrix[12]) -
                          (tmp_1 * matrix[0] + tmp_6 * matrix[8] + tmp_9 * matrix[12]));
        var out_12 = d * ((tmp_3 * matrix[0] + tmp_6 * matrix[4] + tmp_11 * matrix[12]) -
                          (tmp_2 * matrix[0] + tmp_7 * matrix[4] + tmp_10 * matrix[12]));
        var out_13 = d * ((tmp_4 * matrix[0] + tmp_9 * matrix[4] + tmp_10 * matrix[8]) -
                          (tmp_5 * matrix[0] + tmp_8 * matrix[4] + tmp_11 * matrix[8]));

        var out_20 = d * ((tmp_12 * matrix[7] + tmp_15 * matrix[11] + tmp_16 * matrix[15]) -
                          (tmp_13 * matrix[7] + tmp_14 * matrix[11] + tmp_17 * matrix[15]));
        var out_21 = d * ((tmp_13 * matrix[3] + tmp_18 * matrix[11] + tmp_21 * matrix[15]) -
                          (tmp_12 * matrix[3] + tmp_19 * matrix[11] + tmp_20 * matrix[15]));
        var out_22 = d * ((tmp_14 * matrix[3] + tmp_19 * matrix[7] + tmp_22 * matrix[15]) -
                          (tmp_15 * matrix[3] + tmp_18 * matrix[7] + tmp_23 * matrix[15]));
        var out_23 = d * ((tmp_17 * matrix[3] + tmp_20 * matrix[7] + tmp_23 * matrix[11]) -
                          (tmp_16 * matrix[3] + tmp_21 * matrix[7] + tmp_22 * matrix[11]));

        var out_30 = d * ((tmp_14 * matrix[10] + tmp_17 * matrix[14] + tmp_13 * matrix[6]) -
                          (tmp_16 * matrix[14] + tmp_12 * matrix[6] + tmp_15 * matrix[10]));
        var out_31 = d * ((tmp_20 * matrix[14] + tmp_12 * matrix[2] + tmp_19 * matrix[10]) -
                          (tmp_18 * matrix[10] + tmp_21 * matrix[14] + tmp_13 * matrix[2]));
        var out_32 = d * ((tmp_18 * matrix[6] + tmp_23 * matrix[14] + tmp_15 * matrix[2]) -
                          (tmp_22 * matrix[14] + tmp_14 * matrix[2] + tmp_19 * matrix[6]));
        var out_33 = d * ((tmp_22 * matrix[10] + tmp_16 * matrix[2] + tmp_21 * matrix[6]) -
                          (tmp_20 * matrix[6] + tmp_23 * matrix[10] + tmp_17 * matrix[2]));

        result[0] = out_00;
        result[1] = out_01;
        result[2] = out_02;
        result[3] = out_03;
        result[4] = out_10;
        result[5] = out_11;
        result[6] = out_12;
        result[7] = out_13;
        result[8] = out_20;
        result[9] = out_21;
        result[10] = out_22;
        result[11] = out_23;
        result[12] = out_30;
        result[13] = out_31;
        result[14] = out_32;
        result[15] = out_33;

        return true;
    },

    // comes from OpenSceneGraph
    /*
      Matrix inversion technique:
      Given a matrix mat, we want to invert it.
      mat = [ r00 r01 r02 a
              r10 r11 r12 b
              r20 r21 r22 c
              tx  ty  tz  d ]
      We note that this matrix can be split into three matrices.
      mat = rot * trans * corr, where rot is rotation part, trans is translation part, and corr is the correction due to perspective (if any).
      rot = [ r00 r01 r02 0
              r10 r11 r12 0
              r20 r21 r22 0
              0   0   0   1 ]
      trans = [ 1  0  0  0
                0  1  0  0
                0  0  1  0
                tx ty tz 1 ]
      corr = [ 1 0 0 px
               0 1 0 py
               0 0 1 pz
               0 0 0 s ]

      where the elements of corr are obtained from linear combinations of the elements of rot, trans, and mat.
      So the inverse is mat' = (trans * corr)' * rot', where rot' must be computed the traditional way, which is easy since it is only a 3x3 matrix.
      This problem is simplified if [px py pz s] = [0 0 0 1], which will happen if mat was composed only of rotations, scales, and translations (which is common).  In this case, we can ignore corr entirely which saves on a lot of computations.
    */

    inverse4x3: function(matrix, result) {

        // Copy rotation components
        var r00 = matrix[0];
        var r01 = matrix[1];
        var r02 = matrix[2];

        var r10 = matrix[4];
        var r11 = matrix[5];
        var r12 = matrix[6];

        var r20 = matrix[8];
        var r21 = matrix[9];
        var r22 = matrix[10];

        // Partially compute inverse of rot
        result[0] = r11*r22 - r12*r21;
        result[1] = r02*r21 - r01*r22;
        result[2] = r01*r12 - r02*r11;

        // Compute determinant of rot from 3 elements just computed
        var one_over_det = 1.0/(r00*result[0] + r10*result[1] + r20*result[2]);
        r00 *= one_over_det; r10 *= one_over_det; r20 *= one_over_det;  // Saves on later computations

        // Finish computing inverse of rot
        result[0] *= one_over_det;
        result[1] *= one_over_det;
        result[2] *= one_over_det;
        result[3] = 0.0;
        result[4] = r12*r20 - r10*r22; // Have already been divided by det
        result[5] = r00*r22 - r02*r20; // same
        result[6] = r02*r10 - r00*r12; // same
        result[7] = 0.0;
        result[8] = r10*r21 - r11*r20; // Have already been divided by det
        result[9] = r01*r20 - r00*r21; // same
        result[10] = r00*r11 - r01*r10; // same
        result[11] = 0.0;
        result[15] = 1.0;

        var tx,ty,tz;

        var d  = matrix[15];
        var dm = d-1.0;
        if( dm*dm > 1.0e-6 )  // Involves perspective, so we must
        {                       // compute the full inverse
            
            var inv = osg.Matrix._tmp0;
            result[12] = result[13] = result[14] = 0.0;

            var a  = matrix[3]; 
            var b  = matrix[7]; 
            var c  = matrix[11];
            var px = result[0]*a + result[1]*b + result[2] *c;
            var py = result[4]*a + result[5]*b + result[6] *c;
            var pz = result[8]*a + result[9]*b + result[10]*c;

            tx = matrix[12]; 
            ty = matrix[13]; 
            tz = matrix[14];
            var one_over_s  = 1.0/(d - (tx*px + ty*py + tz*pz));

            tx *= one_over_s; 
            ty *= one_over_s; 
            tz *= one_over_s;  // Reduces number of calculations later on

            // Compute inverse of trans*corr
            inv[0] = tx*px + 1.0;
            inv[1] = ty*px;
            inv[2] = tz*px;
            inv[3] = -px * one_over_s;
            inv[4] = tx*py;
            inv[5] = ty*py + 1.0;
            inv[6] = tz*py;
            inv[7] = -py * one_over_s;
            inv[8] = tx*pz;
            inv[9] = ty*pz;
            inv[10] = tz*pz + 1.0;
            inv[11] = -pz * one_over_s;
            inv[12] = -tx;
            inv[13] = -ty;
            inv[14] = -tz;
            inv[15] = one_over_s;

            osg.Matrix.preMult(result, inv); // Finish computing full inverse of mat
        } else {

            tx = matrix[12]; 
            ty = matrix[13]; 
            tz = matrix[14];

            // Compute translation components of mat'
            result[12] = -(tx*result[0] + ty*result[4] + tz*result[8]);
            result[13] = -(tx*result[1] + ty*result[5] + tz*result[9]);
            result[14] = -(tx*result[2] + ty*result[6] + tz*result[10]);
        }
        return true;

    },

    transpose: function(mat, dest) {
        // from glMatrix
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if(mat === dest) {
            var a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a12 = mat[6], a13 = mat[7];
            var a23 = mat[11];
            
            mat[1] = mat[4];
            mat[2] = mat[8];
            mat[3] = mat[12];
            mat[4] = a01;
            mat[6] = mat[9];
            mat[7] = mat[13];
            mat[8] = a02;
            mat[9] = a12;
            mat[11] = mat[14];
            mat[12] = a03;
            mat[13] = a13;
            mat[14] = a23;
            return mat;
        } else {
            dest[0] = mat[0];
            dest[1] = mat[4];
            dest[2] = mat[8];
            dest[3] = mat[12];
            dest[4] = mat[1];
            dest[5] = mat[5];
            dest[6] = mat[9];
            dest[7] = mat[13];
            dest[8] = mat[2];
            dest[9] = mat[6];
            dest[10] = mat[10];
            dest[11] = mat[14];
            dest[12] = mat[3];
            dest[13] = mat[7];
            dest[14] = mat[11];
            dest[15] = mat[15];
            return dest;
        }
    },

    makePerspective: function(fovy, aspect, znear, zfar, result)
    {
        if (result === undefined) {
            result = [];
        }
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        return osg.Matrix.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar, result);
    },

    makeScale: function(x, y, z, result)
    {
        if (result === undefined) {
            result = [];
        }
        this.setRow(result, 0, x, 0, 0, 0);
        this.setRow(result, 1, 0, y, 0, 0);
        this.setRow(result, 2, 0, 0, z, 0);
        this.setRow(result, 3, 0, 0, 0, 1);
        return result;
    },

    // compute the 4 corners vector of the frustrum
    computeFrustrumCornersVectors: function(projectionMatrix, vectorsArray) {
        var znear = projectionMatrix[12 + 2] / (projectionMatrix[8 + 2]-1.0);
        var zfar = projectionMatrix[12 + 2] / (projectionMatrix[8 + 2]+1.0);
        var x = 1.0/projectionMatrix[0];
        var y = 1.0/projectionMatrix[1*4+1];

        vectorsArray[0] = [-x, y, 1.0];
        vectorsArray[1] = [-x, -y, 1.0];
        vectorsArray[2] = [x, -y, 1.0];
        vectorsArray[3] = [x, y, 1.0];
        return vectorsArray;
    },

    makeFrustum: function(left, right,
                          bottom, top,
                          znear, zfar, result) {
        if (result === undefined) {
            result = [];
        }
        var X = 2*znear/(right-left);
        var Y = 2*znear/(top-bottom);
        var A = (right+left)/(right-left);
        var B = (top+bottom)/(top-bottom);
        var C = -(zfar+znear)/(zfar-znear);
        var D = -2*zfar*znear/(zfar-znear);
        this.setRow(result, 0, X, 0, 0, 0);
        this.setRow(result, 1, 0, Y, 0, 0);
        this.setRow(result, 2, A, B, C, -1);
        this.setRow(result, 3, 0, 0, D, 0);
        return result;
    },

    makeRotateFromQuat: function (quat, result) {
        this.makeIdentity(result);
        return this.setRotateFromQuat(result, quat);
    },

    setRotateFromQuat: function (matrix, quat) {
        var length2 = osg.Quat.length2(quat);
        if (Math.abs(length2) <= Number.MIN_VALUE)
        {
            matrix[0] = 0.0;
            matrix[1] = 0.0;
            matrix[2] = 0.0;

            matrix[4] = 0.0;
            matrix[5] = 0.0;
            matrix[6] = 0.0;

            matrix[8] = 0.0;
            matrix[9] = 0.0;
            matrix[10] = 0.0;
        }
        else
        {
            var rlength2;
            // normalize quat if required.
            // We can avoid the expensive sqrt in this case since all 'coefficients' below are products of two q components.
            // That is a square of a square root, so it is possible to avoid that
            if (length2 !== 1.0)
            {
                rlength2 = 2.0/length2;
            }
            else
            {
                rlength2 = 2.0;
            }

            // Source: Gamasutra, Rotating Objects Using Quaternions
            //
            //http://www.gamasutra.com/features/19980703/quaternions_01.htm

            var wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;

            // calculate coefficients
            x2 = rlength2*quat[0];
            y2 = rlength2*quat[1];
            z2 = rlength2*quat[2];

            xx = quat[0] * x2;
            xy = quat[0] * y2;
            xz = quat[0] * z2;

            yy = quat[1] * y2;
            yz = quat[1] * z2;
            zz = quat[2] * z2;

            wx = quat[3] * x2;
            wy = quat[3] * y2;
            wz = quat[3] * z2;

            // Note.  Gamasutra gets the matrix assignments inverted, resulting
            // in left-handed rotations, which is contrary to OpenGL and OSG's
            // methodology.  The matrix assignment has been altered in the next
            // few lines of code to do the right thing.
            // Don Burns - Oct 13, 2001
            matrix[0] = 1.0 - (yy + zz);
            matrix[4] = xy - wz;
            matrix[8] = xz + wy;


            matrix[0+1] = xy + wz;
            matrix[4+1] = 1.0 - (xx + zz);
            matrix[8+1] = yz - wx;

            matrix[0+2] = xz - wy;
            matrix[4+2] = yz + wx;
            matrix[8+2] = 1.0 - (xx + yy);
        }
        return matrix;
    }
};
osg.ShaderGeneratorType = {
    VertexInit: 0,
    VertexFunction: 1,
    VertexMain: 2,
    VertexEnd: 3,
    FragmentInit: 5,
    FragmentFunction: 6,
    FragmentMain: 7,
    FragmentEnd: 8
};

/** 
 * Shader manage shader for vertex and fragment, you need both to create a glsl program.
 * @class Shader
 */
osg.Shader = function(type, text) {
    this.type = type;
    this.setText(text);
};

osg.Shader.VERTEX_SHADER = 0x8B31;
osg.Shader.FRAGMENT_SHADER = 0x8B30;

/** @lends osg.Shader.prototype */
osg.Shader.prototype = {
    setText: function(text) { this.text = text; },
    getText: function() { return this.text; },
    compile: function() {
        this.shader = gl.createShader(this.type);
        gl.shaderSource(this.shader, this.text);
        gl.compileShader(this.shader);
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
            osg.log("can't compile shader:\n" + this.text + "\n");
            var tmpText = "\n" + this.text;
            var splittedText = tmpText.split("\n");
            var newText = "\n";
            for (var i = 0, l = splittedText.length; i < l; ++i ) {
                newText += i + " " + splittedText[i] + "\n";
            }
            osg.log(newText);
            osg.log(gl.getShaderInfoLog(this.shader));
        }
    }
};

osg.Shader.create = function( type, text )
{
    osg.log("osg.Shader.create is deprecated, use new osg.Shader with the same arguments instead");
    return new osg.Shader(type, text);
};
/** 
 * StateAttribute base class
 * @class StateAttribute
 */
osg.StateAttribute = function() {
    osg.Object.call(this);
    this._dirty = true;
};

/** @lends osg.StateAttribute.prototype */
osg.StateAttribute.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Object.prototype, {
    isDirty: function() { return this._dirty; },
    dirty: function() { this._dirty = true; },
    setDirty: function(dirty) { this._dirty = dirty; }
}), "osg", "StateAttribute");

osg.StateAttribute.OFF = 0;
osg.StateAttribute.ON = 1;
osg.StateAttribute.OVERRIDE = 2;
osg.StateAttribute.PROTECTED = 4;
osg.StateAttribute.INHERIT = 8;
/** -*- compile-command: "jslint-cli Uniform.js" -*- */

/** 
 * Uniform manage variable used in glsl shader.
 * @class Uniform
 */
osg.Uniform = function () { 
    this.transpose = false; 
    this._dirty = true; 
    this.name = "";
    this.type = undefined;
};

osg.Uniform.isUniform = function(obj)  {
    if (obj.prototype === osg.Uniform.prototype) {
        return true;
    }
    return false;
};
/** @lends osg.Uniform.prototype */
osg.Uniform.prototype = {
    getName: function() { return this.name;},
    getType: function() { return this.type;},

    get: function() { // call dirty if you update this array outside
        return this.data;
    },
    set: function(array) {
        this.data = array;
        this.dirty();
    },
    dirty: function() { this._dirty = true; },
    apply: function(location) {
        if (this._dirty) {
            this.update.call(this.glData, this.data);
            this._dirty = false;
        }
        this.glCall(location, this.glData);
    },
    applyMatrix: function(location) {
        if (this._dirty) {
            this.update.call(this.glData, this.data);
            this._dirty = false;
        }
        this.glCall(location, this.transpose, this.glData);
    },
    update: function(array) {
        for (var i = 0, l = array.length; i < l; ++i ) { // FF not traced maybe short
            this[i] = array[i];
        }
    },

    _updateArray: function(array) {
        for (var i = 0, l = array.length; i < l; ++i ) { // FF not traced maybe short
            this[i] = array[i];
        }
    },

    _updateFloat1: function(f) {
        this[0] = f[0];
    },
    _updateFloat2: function(f) {
        this[0] = f[0];
        this[1] = f[1];
    },
    _updateFloat3: function(f) {
        this[0] = f[0];
        this[1] = f[1];
        this[2] = f[2];
    },
    _updateFloat4: function(f) {
        this[0] = f[0];
        this[1] = f[1];
        this[2] = f[2];
        this[3] = f[3];
    },
    _updateFloat9: function(f) {
        this[0] = f[0];
        this[1] = f[1];
        this[2] = f[2];
        this[3] = f[3];
        this[4] = f[4];
        this[5] = f[5];
        this[6] = f[6];
        this[7] = f[7];
        this[8] = f[8];
    },
    _updateFloat16: function(f) {
        this[0] = f[0];
        this[1] = f[1];
        this[2] = f[2];
        this[3] = f[3];
        this[4] = f[4];
        this[5] = f[5];
        this[6] = f[6];
        this[7] = f[7];
        this[8] = f[8];
        this[9] = f[9];
        this[10] = f[10];
        this[11] = f[11];
        this[12] = f[12];
        this[13] = f[13];
        this[14] = f[14];
        this[15] = f[15];
    }
};

osg.Uniform.createFloat1 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0];
    }
    var uniform = new osg.Uniform();
    uniform.data = [value];
    uniform.glCall = function (location, glData) {
        gl.uniform1fv(location, glData);
    };
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat1;
    uniform.set = function(value) {
        if (typeof value === "number") {
            this.data[0] = value;
        } else {
            this.data = value;
        }
        this.dirty();
    };

    uniform.name = name;
    uniform.type = "float";
    return uniform;
};
osg.Uniform.createFloat = osg.Uniform.createFloat1;
osg.Uniform['float'] = osg.Uniform.createFloat1;
osg.Uniform.createFloatArray = function(array , name) {
    var u = osg.Uniform.createFloat.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createFloat2 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform2fv(location, glData);
    };
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat2;
    uniform.name = name;
    uniform.type = "vec2";
    return uniform;
};
osg.Uniform.vec2 = osg.Uniform.createFloat2;
osg.Uniform.createFloat2Array = function(array , name) {
    var u = osg.Uniform.createFloat2.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createFloat3 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform3fv(location, glData);
    };
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat3;
    uniform.name = name;
    uniform.type = "vec3";
    return uniform;
};
osg.Uniform.vec3 = osg.Uniform.createFloat3;
osg.Uniform.createFloat3Array = function(array , name) {
    var u = osg.Uniform.createFloat3.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createFloat4 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0,0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform4fv(location, glData);
    };
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat4;
    uniform.name = name;
    uniform.type = "vec4";
    return uniform;
};
osg.Uniform.vec4 = osg.Uniform.createFloat4;
osg.Uniform.createFloat4Array = function(array , name) {
    var u = osg.Uniform.createFloat4.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createInt1 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0];
    }
    var uniform = new osg.Uniform();
    uniform.data = [value];
    uniform.glCall = function (location, glData) {
        gl.uniform1iv(location, glData);
    };
    uniform.set = function(value) {
        if (typeof value === "number") {
            this.data[0] = value;
        } else {
            this.data = value;
        }
        this.dirty();
    };

    uniform.glData = new osg.Int32Array(uniform.data);
    uniform.name = name;
    uniform.type = "int";
    return uniform;
};
osg.Uniform['int'] = osg.Uniform.createInt1;
osg.Uniform.createInt = osg.Uniform.createInt1;
osg.Uniform.createIntArray = function(array , name) {
    var u = osg.Uniform.createInt.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};


osg.Uniform.createInt2 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform2iv(location, glData);
    };
    uniform.glData = new osg.Int32Array(uniform.data);
    uniform.name = name;
    uniform.type = "vec2i";
    return uniform;
};
osg.Uniform.vec2i = osg.Uniform.createInt2;
osg.Uniform.createInt2Array = function(array , name) {
    var u = osg.Uniform.createInt2.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createInt3 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform3iv(location, glData);
    };
    uniform.glData = new osg.Int32Array(uniform.data);
    uniform.name = name;
    uniform.type = "vec3i";
    return uniform;
};
osg.Uniform.vec3i = osg.Uniform.createInt3;
osg.Uniform.createInt3Array = function(array , name) {
    var u = osg.Uniform.createInt3.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createInt4 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [0,0,0,0];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, glData) {
        gl.uniform4iv(location, glData);
    };
    uniform.glData = new osg.Int32Array(uniform.data);
    uniform.name = name;
    uniform.type = "vec4i";
    return uniform;
};
osg.Uniform.vec4i = osg.Uniform.createInt4;

osg.Uniform.createInt4Array = function(array , name) {
    var u = osg.Uniform.createInt4.call(this, array, name);
    u.update = osg.Uniform.prototype._updateArray;
    return u;
};

osg.Uniform.createMatrix2 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [1,0,0,1];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix2fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat4;
    uniform.name = name;
    uniform.type = "mat2";
    return uniform;
};
osg.Uniform.createMat2 = osg.Uniform.createMatrix2;
osg.Uniform.mat2 = osg.Uniform.createMat2;

osg.Uniform.createMatrix3 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [1,0,0, 0,1,0, 0,0,1];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix3fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat9;
    uniform.name = name;
    uniform.type = "mat3";
    return uniform;
};
osg.Uniform.createMat3 = osg.Uniform.createMatrix3;
osg.Uniform.mat3 = osg.Uniform.createMatrix3;

osg.Uniform.createMatrix4 = function(data, uniformName) {
    var value = data;
    var name = uniformName;
    if (name === undefined) {
        name = value;
        value = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    }
    var uniform = new osg.Uniform();
    uniform.data = value;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix4fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new osg.Float32Array(uniform.data);
    uniform.update = osg.Uniform.prototype._updateFloat16;
    uniform.name = name;
    uniform.type = "mat4";
    return uniform;
};
osg.Uniform.createMat4 = osg.Uniform.createMatrix4;
osg.Uniform.mat4 = osg.Uniform.createMatrix4;/** -*- compile-command: "jslint-cli Node.js" -*- */

/** 
 *  Node that can contains child node
 *  @class Node
 */
osg.Node = function () {
    osg.Object.call(this);

    this.children = [];
    this.parents = [];
    this.nodeMask = ~0;
    this.boundingSphere = new osg.BoundingSphere();
    this.boundingSphereComputed = false;
    this._updateCallbacks = [];
    this._cullCallback = undefined;
};

/** @lends osg.Node.prototype */
osg.Node.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Object.prototype, {
    /**
        Return StateSet and create it if it does not exist yet
        @type osg.StateSet
     */
    getOrCreateStateSet: function() {
        if (this.stateset === undefined) {
            this.stateset = new osg.StateSet();
        }
        return this.stateset;
    },
    getStateSet: function() { return this.stateset; },
    accept: function(nv) { 
        if (nv.validNodeMask(this)) {
            nv.pushOntoNodePath(this);
            nv.apply(this);
            nv.popFromNodePath();
        }
    },
    dirtyBound: function() {
        if (this.boundingSphereComputed === true) {
            this.boundingSphereComputed = false;
            for (var i = 0, l = this.parents.length; i < l; i++) {
                this.parents[i].dirtyBound();
            }
        }
    },
    setNodeMask: function(mask) { this.nodeMask = mask; },
    getNodeMask: function(mask) { return this.nodeMask; },
    setStateSet: function(s) { this.stateset = s; },

    /**
       <p>
        Set update node callback, called during update traversal.
        The Object must have the following method
        update(node, nodeVisitor) {}
        note, callback is responsible for scenegraph traversal so
        they must call traverse(node,nv) to ensure that the
        scene graph subtree (and associated callbacks) are traversed.
        </p>
        <p>
        Here a dummy UpdateCallback example
        </p>
        @example
        var DummyUpdateCallback = function() {};
        DummyUpdateCallback.prototype = {
            update: function(node, nodeVisitor) {
                return true;
            }
        };

        @param Oject callback
     */
    setUpdateCallback: function(cb) { this._updateCallbacks[0] = cb; },
    /** Get update node callback, called during update traversal.
        @type Oject
     */
    getUpdateCallback: function() { return this._updateCallbacks[0]; },
    
    addUpdateCallback: function(cb) { this._updateCallbacks.push(cb);},
    getUpdateCallbackList: function() { return this._updateCallbacks; },


    /**
       <p>
        Set cull node callback, called during cull traversal.
        The Object must have the following method
        cull(node, nodeVisitor) {}
        note, callback is responsible for scenegraph traversal so
        they must return true to traverse.
        </p>
        <p>
        Here a dummy CullCallback example
        </p>
        @example
        var DummyCullCallback = function() {};
        DummyCullCallback.prototype = {
            cull: function(node, nodeVisitor) {
                return true;
            }
        };

        @param Oject callback
     */
    setCullCallback: function(cb) { this._cullCallback = cb; },
    getCullCallback: function() { return this._cullCallback; },

    hasChild: function(child) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            if (this.children[i] === child) {
                return true;
            }
        }
        return false;
    },
    addChild: function (child) {
	var c =  this.children.push(child);
        child.addParent(this);
	this.dirtyBound();
	return c;
    },
    getChildren: function() { return this.children; },
    getParents: function() {
        return this.parents;
    },
    addParent: function( parent) {
        this.parents.push(parent);
    },
    removeParent: function(parent) {
        for (var i = 0, l = this.parents.length, parents = this.parents; i < l; i++) {
            if (parents[i] === parent) {
                parents.splice(i, 1);
                return;
            }
        }
    },
    removeChildren: function () {
        var children = this.children;
        if (children.length !== 0) {
            for (var i = 0, l = children.length; i < l; i++) {
                children[i].removeParent(this);
            }
            this.children.splice(0, this.children.length);
            this.dirtyBound();
        }
    },

    // preserve order
    removeChild: function (child) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            if (this.children[i] === child) {
                child.removeParent(this);
                this.children.splice(i, 1);
                this.dirtyBound();
            }
        }
    },

    traverse: function (visitor) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            child.accept(visitor);
        }
    },

    ascend: function (visitor) {
        for (var i = 0, l = this.parents.length; i < l; i++) {
            var parent = this.parents[i];
            parent.accept(visitor);
        }
    },

    getBound: function() {
        if(!this.boundingSphereComputed) {
            this.computeBound(this.boundingSphere);
            this.boundingSphereComputed = true;
        }
        return this.boundingSphere;
    },

    computeBound: function (bsphere) {
        var bb = new osg.BoundingBox();
        bb.init();
        bsphere.init();
	for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            if (child.referenceFrame === undefined || child.referenceFrame === osg.Transform.RELATIVE_RF) {
                bb.expandBySphere(child.getBound());
            }
	}
        if (!bb.valid()) {
            return bsphere;
        }
        bsphere._center = bb.center();
        bsphere._radius = 0.0;
	for (var j = 0, l2 = this.children.length; j < l2; j++) {
            var cc = this.children[j];
            if (cc.referenceFrame === undefined || cc.referenceFrame === osg.Transform.RELATIVE_RF) {
                bsphere.expandRadiusBySphere(cc.getBound());
            }
	}
            
	return bsphere;
    },

    getWorldMatrices: function(halt) {
        var CollectParentPaths = function(halt) {
            this.nodePaths = [];
            this.halt = halt;
            osg.NodeVisitor.call(this, osg.NodeVisitor.TRAVERSE_PARENTS);
        };
        CollectParentPaths.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {
            apply: function(node) {
                if (node.parents.length === 0 || node === this.halt) {
                    // copy
                    this.nodePaths.push(this.nodePath.slice(0));
                } else {
                    this.traverse(node);
                }
            }
        });
        var collected = new CollectParentPaths(halt);
        this.accept(collected);
        var matrixList = [];

        for(var i = 0, l = collected.nodePaths.length; i < l; i++) {
            var np = collected.nodePaths[i];
            if (np.length === 0) {
                matrixList.push(osg.Matrix.makeIdentity([]));
            } else {
                matrixList.push(osg.computeLocalToWorld(np));
            }
        }
        return matrixList;
    }
    

}), "osg","Node");
osg.Node.prototype.objectType = osg.objectType.generate("Node");
osg.NodeVisitor = function (traversalMode) {
    this.traversalMask = ~0x0;
    this.nodeMaskOverride = 0;
    this.traversalMode = traversalMode;
    if (traversalMode === undefined) {
        this.traversalMode = osg.NodeVisitor.TRAVERSE_ALL_CHILDREN;
    }
    this.nodePath = [];
};
//osg.NodeVisitor.TRAVERSE_NONE = 0;
osg.NodeVisitor.TRAVERSE_PARENTS = 1;
osg.NodeVisitor.TRAVERSE_ALL_CHILDREN = 2;
//osg.NodeVisitor.TRAVERSE_ACTIVE_CHILDREN = 3;
osg.NodeVisitor._traversalFunctions = {};
osg.NodeVisitor._traversalFunctions[osg.NodeVisitor.TRAVERSE_PARENTS] = function(node) { node.ascend(this); };
osg.NodeVisitor._traversalFunctions[osg.NodeVisitor.TRAVERSE_ALL_CHILDREN] = function(node) { node.traverse(this); };

osg.NodeVisitor._pushOntoNodePath = {};
osg.NodeVisitor._pushOntoNodePath[osg.NodeVisitor.TRAVERSE_PARENTS] = function(node) { this.nodePath.unshift(node); };
osg.NodeVisitor._pushOntoNodePath[osg.NodeVisitor.TRAVERSE_ALL_CHILDREN] = function(node) { this.nodePath.push(node); };

osg.NodeVisitor._popFromNodePath = {};
osg.NodeVisitor._popFromNodePath[osg.NodeVisitor.TRAVERSE_PARENTS] = function() { return this.nodePath.shift(); };
osg.NodeVisitor._popFromNodePath[osg.NodeVisitor.TRAVERSE_ALL_CHILDREN] = function() { this.nodePath.pop(); };

osg.NodeVisitor.prototype = {
    setNodeMaskOverride: function(m) { this.nodeMaskOverride = m; },
    getNodeMaskOverride: function() { return this.nodeMaskOverride; },

    setTraversalMask: function(m) { this.traversalMask = m; },
    getTraversalMask: function() { return this.traversalMask; },

    pushOntoNodePath: function(node) {
        osg.NodeVisitor._pushOntoNodePath[this.traversalMode].call(this, node);
    },
    popFromNodePath: function() {
        osg.NodeVisitor._popFromNodePath[this.traversalMode].call(this);
    },
    validNodeMask: function(node) {
        var nm = node.getNodeMask();
        return ((this.traversalMask & (this.nodeMaskOverride | nm)) !== 0);
    },
    apply: function ( node ) {
        this.traverse(node);
    },
    traverse: function ( node ) {
        osg.NodeVisitor._traversalFunctions[this.traversalMode].call(this, node);
    }
};
/** -*- compile-command: "jslint-cli Transform.js" -*- */

/** 
 * Transform - base class for Transform type node ( Camera, MatrixTransform )
 * @class Transform
 * @inherits osg.Node
 */
osg.Transform = function() {
    osg.Node.call(this);
    this.referenceFrame = osg.Transform.RELATIVE_RF;
};
osg.Transform.RELATIVE_RF = 0;
osg.Transform.ABSOLUTE_RF = 1;

/** @lends osg.Transform.prototype */
osg.Transform.prototype = osg.objectInehrit(osg.Node.prototype, {
    setReferenceFrame: function(value) { this.referenceFrame = value; },
    getReferenceFrame: function() { return this.referenceFrame; },

    computeBound: function(bsphere) {
        osg.Node.prototype.computeBound.call(this, bsphere);
        if (!bsphere.valid()) {
            return bsphere;
        }
        var matrix = osg.Matrix.makeIdentity([]);
        this.computeLocalToWorldMatrix(matrix);

        var xdash = osg.Vec3.copy(bsphere._center, []);
        xdash[0] += bsphere._radius;
        osg.Matrix.transformVec3(matrix, xdash, xdash);

        var ydash = osg.Vec3.copy(bsphere._center, []);
        ydash[1] += bsphere._radius;
        osg.Matrix.transformVec3(matrix, ydash, ydash);

        var zdash = osg.Vec3.copy(bsphere._center, []);
        zdash[2] += bsphere._radius;
        osg.Matrix.transformVec3(matrix, zdash, zdash);

        osg.Matrix.transformVec3(matrix, bsphere._center, bsphere._center);

        osg.Vec3.sub(xdash,
                     bsphere._center, 
                     xdash);
        var len_xdash = osg.Vec3.length(xdash);

        osg.Vec3.sub(ydash, 
                     bsphere._center, 
                     ydash);
        var len_ydash = osg.Vec3.length(ydash);

        osg.Vec3.sub(zdash, 
                     bsphere._center, 
                     zdash);
        var len_zdash = osg.Vec3.length(zdash);

        bsphere._radius = len_xdash;
        if (bsphere._radius<len_ydash) {
            bsphere._radius = len_ydash;
        }
        if (bsphere._radius<len_zdash) {
            bsphere._radius = len_zdash;
        }
        return bsphere;
    }
});

osg.computeLocalToWorld = function (nodePath, ignoreCameras) {
    var ignoreCamera = ignoreCameras;
    if (ignoreCamera === undefined) {
        ignoreCamera = true;
    }
    var matrix = osg.Matrix.makeIdentity([]);

    var j = 0;
    if (ignoreCamera) {
        for (j = nodePath.length-1; j > 0; j--) {
            var camera = nodePath[j];
            if (camera.objectType === osg.Camera.prototype.objectType &&
                (camera.getReferenceFrame !== osg.Transform.RELATIVE_RF || camera.getParents().length === 0 )) {
                break;
            }
        }
    }

    for (var i = j, l = nodePath.length; i < l; i++) {
        var node = nodePath[i];
        if (node.computeLocalToWorldMatrix) {
            node.computeLocalToWorldMatrix(matrix);
        }
    }
    return matrix;
};
/** 
 *  Manage Blending mode
 *  @class BlendFunc
 */
osg.BlendFunc = function (sourceRGB, destinationRGB, sourceAlpha, destinationAlpha) {
    osg.StateAttribute.call(this);
    this._sourceFactor = osg.BlendFunc.ONE;
    this._destinationFactor = osg.BlendFunc.ZERO;
    this._sourceFactorAlpha = this._sourceFactor;
    this._destinationFactorAlpha = this._destinationFactor;
    this._separate = false;
    if (sourceRGB !== undefined) {
        this.setSource(sourceRGB);
    }
    if (destinationRGB !== undefined) {
        this.setDestination(destinationRGB);
    }

    if (sourceAlpha !== undefined) {
        this.setSourceAlpha(sourceAlpha);
    }
    if (destinationAlpha !== undefined) {
        this.setDestinationAlpha(destinationAlpha);
    }
};

osg.BlendFunc.ZERO                           = 0;
osg.BlendFunc.ONE                            = 1;
osg.BlendFunc.SRC_COLOR                      = 0x0300;
osg.BlendFunc.ONE_MINUS_SRC_COLOR            = 0x0301;
osg.BlendFunc.SRC_ALPHA                      = 0x0302;
osg.BlendFunc.ONE_MINUS_SRC_ALPHA            = 0x0303;
osg.BlendFunc.DST_ALPHA                      = 0x0304;
osg.BlendFunc.ONE_MINUS_DST_ALPHA            = 0x0305;
osg.BlendFunc.DST_COLOR                      = 0x0306;
osg.BlendFunc.ONE_MINUS_DST_COLOR            = 0x0307;
osg.BlendFunc.SRC_ALPHA_SATURATE             = 0x0308;

/* Separate Blend Functions */
osg.BlendFunc.BLEND_DST_RGB                  = 0x80C8;
osg.BlendFunc.BLEND_SRC_RGB                  = 0x80C9;
osg.BlendFunc.BLEND_DST_ALPHA                = 0x80CA;
osg.BlendFunc.BLEND_SRC_ALPHA                = 0x80CB;
osg.BlendFunc.CONSTANT_COLOR                 = 0x8001;
osg.BlendFunc.ONE_MINUS_CONSTANT_COLOR       = 0x8002;
osg.BlendFunc.CONSTANT_ALPHA                 = 0x8003;
osg.BlendFunc.ONE_MINUS_CONSTANT_ALPHA       = 0x8004;
osg.BlendFunc.BLEND_COLOR                    = 0x8005;


/** @lends osg.BlendFunc.prototype */
osg.BlendFunc.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    /** 
        StateAttribute type of BlendFunc
        @type String
     */
    attributeType: "BlendFunc",
    /** 
        Create an instance of this StateAttribute
    */ 
    cloneType: function() /**osg.BlendFunc*/ {return new osg.BlendFunc(); },
    /** 
        @type String
    */ 
    getType: function() { return this.attributeType;},
    /** 
        @type String
    */ 
    getTypeMember: function() { return this.attributeType;},
    setSource: function(f) { 
        this.setSourceRGB(f); 
        this.setSourceAlpha(f); 
    },
    setDestination: function(f) { 
        this.setDestinationRGB(f); 
        this.setDestinationAlpha(f);
    },
    checkSeparate: function() {
        return (this._sourceFactor !== this._sourceFactorAlpha ||
                this._destinationFactor !== this._destinationFactorAlpha);
    },
    setSourceRGB: function(f) { 
        if (typeof f === "string") {
            this._sourceFactor = osg.BlendFunc[f];
        } else {
            this._sourceFactor = f;
        }
        this._separate = this.checkSeparate();
    },
    setSourceAlpha: function(f) {
        if (typeof f === "string") {
            this._sourceFactorAlpha = osg.BlendFunc[f];
        } else {
            this._sourceFactorAlpha = f;
        }
        this._separate = this.checkSeparate();
    },
    setDestinationRGB: function(f) { 
        if (typeof f === "string") {
            this._destinationFactor = osg.BlendFunc[f];
        } else {
            this._destinationFactor = f;
        }
        this._separate = this.checkSeparate();
    },
    setDestinationAlpha: function(f) { 
        if (typeof f === "string") {
            this._destinationFactorAlpha = osg.BlendFunc[f];
        } else {
            this._destinationFactorAlpha = f;
        }
        this._separate = this.checkSeparate();
    },

    /** 
        Apply the mode, must be called in the draw traversal
        @param state
    */
    apply: function(state) {
        var gl = state.getGraphicContext();
        gl.enable(gl.BLEND);
        if (this._separate) {
            gl.blendFuncSeparate(this._sourceFactor, this._destinationFactor,
                                 this._sourceFactorAlpha, this._destinationFactorAlpha);
        } else {
            gl.blendFunc(this._sourceFactor, this._destinationFactor); 
        }
    }
}), "osg", "BlendFunc");
/** 
 *  Manage BlendColor attribute
 *  @class BlendColor
 */
osg.BlendColor = function (color) {
    osg.StateAttribute.call(this);
    this._constantColor = new Array(4);
    this._constantColor[0] = this._constantColor[1] = this._constantColor[2] =this._constantColor[3] = 1.0;
    if (color !== undefined) {
        this.setConstantColor(color);
    }
};

/** @lends osg.BlendColor.prototype */
osg.BlendColor.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "BlendColor",
    cloneType: function() {return new osg.BlendColor(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    setConstantColor: function(color) {
        osg.Vec4.copy(color, this._constantColor);
    },
    getConstantColor: function() { return this._constantColor; },
    apply: function(state) {
        var gl = state.getGraphicContext();
        gl.blendColor(this._constantColor[0],
                      this._constantColor[1],
                      this._constantColor[2],
                      this._constantColor[3]);
        this._dirty = false;
    }
}), "osg", "BlendColor");
osg.BoundingBox = function() {
    this.init();
};
osg.BoundingBox.prototype = osg.objectLibraryClass( {
    _cache_radius2_tmp: [0, 0, 0],

    init: function() {
	this._min = [Infinity, Infinity, Infinity];
	this._max = [-Infinity, -Infinity, -Infinity];
    },

    valid: function() {
        return (this._max[0] >= this._min[0] &&  this._max[1] >= this._min[1] &&  this._max[2] >= this._min[2]);
    },

    expandBySphere: function(sh) {
        if (!sh.valid()) {
            return;
        }
        var max = this._max;
        var min = this._min;
        min[0] = Math.min(min[0], sh._center[0]-sh._radius);
        min[1] = Math.min(min[1], sh._center[1]-sh._radius);
        min[2] = Math.min(min[2], sh._center[2]-sh._radius);

        max[0] = Math.max(max[0], sh._center[0]+sh._radius);
        max[1] = Math.max(max[1], sh._center[1]+sh._radius);
        max[2] = Math.max(max[2], sh._center[2]+sh._radius);
    },

    expandByVec3: function(v){
        var min = this._min;
        var max = this._max;
	min[0] = Math.min(min[0], v[0]);
	min[1] = Math.min(min[1], v[1]);
	min[2] = Math.min(min[2], v[2]);

	max[0] = Math.max(max[0], v[0]);
	max[1] = Math.max(max[1], v[1]);
	max[2] = Math.max(max[2], v[2]);
    },

    center: function() {
        var min = this._min;
        var max = this._max;
	return [ (min[0] + max[0])*0.5,
                 (min[1] + max[1])*0.5,
                 (min[2] + max[2])*0.5 ];
    },

    radius: function() {
	return Math.sqrt(this.radius2());
    },

    radius2: function() {
        var min = this._min;
        var max = this._max;
        var cache = this._cache_radius2_tmp;
        cache[0] = max[0] - min[0];
        cache[1] = max[1] - min[1];
        cache[2] = max[2] - min[2];
	return 0.25*(cache[0] * cache[0] + cache[1] * cache[1] + cache[2] * cache[2]);
    },
    corner: function(pos) {
        ret = [0.0,0.0,0.0];
        if ( pos & 1 ) {
            ret[0]=this._max[0];
	} else {
            ret[0]=this._min[0];
	}
        if ( pos & 2 ) {
            ret[1]=this._max[1];
	} else {
            ret[1]=this._min[1];
	}
        if ( pos & 4 ) {
            ret[2]=this._max[2];
	} else {
            ret[2]=this._min[2];
	}
        return ret;
    }
}, "osg", "BoundingBox");
osg.BoundingSphere = function() {
    this._center = [0.0,0.0,0.0];
    this._radius = -1;
};
osg.BoundingSphere.prototype = {
    init: function() {
	this._center = [0.0,0.0,0.0];
	this._radius = -1;
    },
    valid: function() {
	return this._radius>=0.0;
    },
    set: function (center,radius)
    {
	this._center = center;
	this._radius = radius;
    },
    center: function() {return this._center;},
    radius: function() {return this._radius;},
    radius2: function() {return this._radius*this._radius;},

    expandByBox: function(bb) {
	if ( bb.valid() )
	{
            var c;
            if (this.valid()) {
		var newbb = new osg.BoundingBox();
		newbb._min[0]=bb._min[0];
		newbb._min[1]=bb._min[1];
		newbb._min[2]=bb._min[2];
		newbb._max[0]=bb._max[0];
		newbb._max[1]=bb._max[1];
		newbb._max[2]=bb._max[2];

                // this code is not valid c is defined after the loop
                // FIXME
		for (var i = 0 ; i < 8; i++) {
                    var v = osg.Vec3.sub(bb.corner(c),this._center, []); // get the direction vector from corner
                    osg.Vec3.normalize(v,v); // normalise it.
                    nv[0] *= -this._radius; // move the vector in the opposite direction distance radius.
                    nv[1] *= -this._radius; // move the vector in the opposite direction distance radius.
                    nv[2] *= -this._radius; // move the vector in the opposite direction distance radius.
                    nv[0] += this._center[0]; // move to absolute position.
                    nv[1] += this._center[1]; // move to absolute position.
                    nv[2] += this._center[2]; // move to absolute position.
                    newbb.expandBy(nv); // add it into the new bounding box.
		}

		c = newbb.center();
		this._center[0] = c[0];
		this._center[1] = c[1];
		this._center[2] = c[2];
		this._radius    = newbb.radius();
            } else {
		c = bb.center();
		this._center[0] = c[0];
		this._center[1] = c[1];
		this._center[2] = c[2];
		this._radius    = bb.radius();
            }
	}

    },

    expandByVec3: function(v){
	if ( this.valid()) {
            var dv = osg.Vec3.sub(v,this.center(), []);
            r = osg.Vec3.length(dv);
            if (r>this.radius())
            {
                dr = (r-this.radius())*0.5;
                this._center[0] += dv[0] * (dr/r);
                this._center[1] += dv[1] * (dr/r);
                this._center[2] += dv[2] * (dr/r);
                this._radius += dr;
            }
        }
        else
        {
            this._center[0] = v[0];
            this._center[1] = v[1];
            this._center[2] = v[2];
            this._radius = 0.0;
        }
    },

    expandRadiusBySphere: function(sh){
        if (sh.valid()) {
            if (this.valid()) {
                var sub = osg.Vec3.sub;
                var length = osg.Vec3.length;
                var r = length( sub(sh._center,
                                    this._center, 
                                    [])
                              ) + sh._radius;
                if (r>this._radius) {
                    this._radius = r;
                }
                // else do nothing as vertex is within sphere.
            } else {
                this._center = osg.Vec3.copy(sh._center, []);
                this._radius = sh._radius;
            }
        }
    },
    expandBy: function(sh){
        // ignore operation if incomming BoundingSphere is invalid.
        if (!sh.valid()) { return; }

        // This sphere is not set so use the inbound sphere
        if (!this.valid())
        {
            this._center[0] = sh._center[0];
            this._center[1] = sh._center[1];
            this._center[2] = sh._center[2];
            this._radius = sh.radius();

            return;
        }


        // Calculate d == The distance between the sphere centers
        var tmp= osg.Vec3.sub( this.center() , sh.center(), [] );
        d = osg.Vec3.length(tmp);

        // New sphere is already inside this one
        if ( d + sh.radius() <= this.radius() )
        {
            return;
        }

        //  New sphere completely contains this one
        if ( d + this.radius() <= sh.radius() )
        {
            this._center[0] = sh._center[0];
            this._center[1] = sh._center[1];
            this._center[2] = sh._center[2];
            this._radius    = sh._radius;
            return;
        }


        // Build a new sphere that completely contains the other two:
        //
        // The center point lies halfway along the line between the furthest
        // points on the edges of the two spheres.
        //
        // Computing those two points is ugly - so we'll use similar triangles
        new_radius = (this.radius() + d + sh.radius() ) * 0.5;
        ratio = ( new_radius - this.radius() ) / d ;

        this._center[0] += ( sh._center[0] - this._center[0] ) * ratio;
        this._center[1] += ( sh._center[1] - this._center[1] ) * ratio;
        this._center[2] += ( sh._center[2] - this._center[2] ) * ratio;

        this._radius = new_radius;

    },
    contains: function(v) {
        var vc = osg.Vec3.sub(v,this.center(), []);
        return valid() && (osg.Vec3.length2(vc)<=radius2());
    },
    intersects: function( bs ) {
        var lc = osg.Vec3.length2(osg.Vec3.sub(this.center() , 
                                               bs.center(),
                                              []));
        return valid() && bs.valid() &&
            (lc <= (this.radius() + bs.radius())*(this.radius() + bs.radius()));
    }
};
/** -*- compile-command: "jslint-cli BufferArray.js" -*- */

/** 
 * BufferArray manage vertex / normal / ... array used by webgl.
 * @class BufferArray
 */
osg.BufferArray = function (type, elements, itemSize) {
    if (osg.BufferArray.instanceID === undefined) {
        osg.BufferArray.instanceID = 0;
    }
    this.instanceID = osg.BufferArray.instanceID;
    osg.BufferArray.instanceID += 1;
    this.dirty();

    this._itemSize = itemSize;
    if (typeof(type) === "string") {
        type = osg.BufferArray[type];
    }
    this._type = type;

    if (elements !== undefined) {
        if (this._type === osg.BufferArray.ELEMENT_ARRAY_BUFFER) {
            this._elements = new osg.Uint16Array(elements);
        } else {
            this._elements = new osg.Float32Array(elements);
        }
    }
};

osg.BufferArray.ELEMENT_ARRAY_BUFFER = 0x8893;
osg.BufferArray.ARRAY_BUFFER = 0x8892;


/** @lends osg.BufferArray.prototype */
osg.BufferArray.prototype = {
    setItemSize: function(size) { this._itemSize = size; },
    isValid: function() {
        if (this._buffer !== undefined || 
            this._elements !== undefined) {
            return true;
        }
        return false;
    },

    releaseGLObjects: function(gl) {
        if (this._buffer !== undefined && this._buffer !== null) {
            gl.deleteBuffer(this._buffer);
        }
        this._buffer = undefined;
    },

    bind: function(gl) {

        var type = this._type;
        var buffer = this._buffer;

        if (buffer) {
            gl.bindBuffer(type, buffer);
            return;
        }

        if (!buffer && this._elements.length > 0 ) {
            this._buffer = gl.createBuffer();
            this._numItems = this._elements.length / this._itemSize;
            gl.bindBuffer(type, this._buffer);
        }
    },
    getItemSize: function() { return this._itemSize; },
    dirty: function() { this._dirty = true; },
    isDirty: function() { return this._dirty; },
    compile: function(gl) {
        if (this._dirty) {
            gl.bufferData(this._type, this._elements, gl.STATIC_DRAW);
            this._dirty = false;
        }
    },
    getElements: function() { return this._elements;},
    setElements: function(elements) { 
        this._elements = elements;
        this._dirty = true;
    }
};

osg.BufferArray.create = function(type, elements, itemSize) {
    osg.log("osg.BufferArray.create is deprecated, use new osg.BufferArray with same arguments instead");
    return new osg.BufferArray(type, elements, itemSize);
};
/** 
 *  Manage CullFace attribute
 *  @class CullFace
 */
osg.CullFace = function (mode) {
    osg.StateAttribute.call(this);
    if (mode === undefined) {
        mode = osg.CullFace.BACK;
    }
    this.setMode(mode);
};

osg.CullFace.DISABLE        = 0x0;
osg.CullFace.FRONT          = 0x0404;
osg.CullFace.BACK           = 0x0405;
osg.CullFace.FRONT_AND_BACK = 0x0408;

/** @lends osg.CullFace.prototype */
osg.CullFace.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "CullFace",
    cloneType: function() {return new osg.CullFace(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    setMode: function(mode) {
        if ( typeof mode === 'string') {
            mode = osg.CullFace[mode];
        }
        this._mode = mode;
    },
    getMode: function() { return this._mode; },
    apply: function(state) {
        var gl = state.getGraphicContext();
        if (this._mode === osg.CullFace.DISABLE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(this._mode);
        }
        this._dirty = false;
    }
}), "osg", "CullFace");
osg.CullSettings = function() {
    this._computeNearFar = true;
    this._nearFarRatio = 0.005;

    var lookVector =[0.0,0.0,-1.0];
    this.bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);
    this.bbCornerNear = (~this.bbCornerFar)&7;
};
osg.CullSettings.prototype = {
    setCullSettings: function(settings) {
        this._computeNearFar = settings._computeNearFar;
        this._nearFarRatio = settings._nearFarRatio;
    },
    setNearFarRatio: function( ratio) { this._nearFarRatio = ratio; },
    getNearFarRatio: function() { return this._nearFarRatio; },
    setComputeNearFar: function(value) { this._computeNearFar = value; },
    getComputeNearFar: function() { return this._computeNearFar; }
};
/** 
 * Camera - is a subclass of Transform which represents encapsulates the settings of a Camera.
 * @class Camera
 * @inherits osg.Transform osg.CullSettings
 */
osg.Camera = function () {
    osg.Transform.call(this);
    osg.CullSettings.call(this);

    this.viewport = undefined;
    this.setClearColor([0, 0, 0, 1.0]);
    this.setClearDepth(1.0);
    this.setClearMask(osg.Camera.COLOR_BUFFER_BIT | osg.Camera.DEPTH_BUFFER_BIT);
    this.setViewMatrix(osg.Matrix.makeIdentity([]));
    this.setProjectionMatrix(osg.Matrix.makeIdentity([]));
    this.renderOrder = osg.Camera.NESTED_RENDER;
    this.renderOrderNum = 0;
};

osg.Camera.PRE_RENDER = 0;
osg.Camera.NESTED_RENDER = 1;
osg.Camera.POST_RENDER = 2;

osg.Camera.COLOR_BUFFER_BIT = 0x00004000;
osg.Camera.DEPTH_BUFFER_BIT = 0x00000100;
osg.Camera.STENCIL_BUFFER_BIT = 0x00000400;

/** @lends osg.Camera.prototype */
osg.Camera.prototype = osg.objectLibraryClass( osg.objectInehrit(
    osg.CullSettings.prototype, 
    osg.objectInehrit(osg.Transform.prototype, {

        setClearDepth: function(depth) { this.clearDepth = depth;}, 
        getClearDepth: function() { return this.clearDepth;},

        setClearMask: function(mask) { this.clearMask = mask;}, 
        getClearMask: function() { return this.clearMask;},

        setClearColor: function(color) { this.clearColor = color;},
        getClearColor: function() { return this.clearColor;},

        setViewport: function(vp) { 
            this.viewport = vp;
            this.getOrCreateStateSet().setAttributeAndMode(vp);
        },
        getViewport: function() { return this.viewport; },


        setViewMatrix: function(matrix) {
            this.modelviewMatrix = matrix;
        },

        setProjectionMatrix: function(matrix) {
            this.projectionMatrix = matrix;
        },

        /** Set to an orthographic projection. See OpenGL glOrtho for documentation further details.*/
        setProjectionMatrixAsOrtho: function(left, right,
                                             bottom, top,
                                             zNear, zFar) {
            osg.Matrix.makeOrtho(left, right, bottom, top, zNear, zFar, this.getProjectionMatrix());
        },

        getViewMatrix: function() { return this.modelviewMatrix; },
        getProjectionMatrix: function() { return this.projectionMatrix; },
        getRenderOrder: function() { return this.renderOrder; },
        setRenderOrder: function(order, orderNum) {
            this.renderOrder = order;
            this.renderOrderNum = orderNum; 
        },

        attachTexture: function(bufferComponent, texture, level) {
            if (this.frameBufferObject) {
                this.frameBufferObject.dirty();
            }
            if (level === undefined) {
                level = 0;
            }
            if (this.attachments === undefined) {
                this.attachments = {};
            }
            this.attachments[bufferComponent] = { 'texture' : texture , 'level' : level };
        },

        attachRenderBuffer: function(bufferComponent, internalFormat) {
            if (this.frameBufferObject) {
                this.frameBufferObject.dirty();
            }
            if (this.attachments === undefined) {
                this.attachments = {};
            }
            this.attachments[bufferComponent] = { 'format' : internalFormat };
        },

        computeLocalToWorldMatrix: function(matrix,nodeVisitor) {
            if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
                osg.Matrix.preMult(matrix, this.modelviewMatrix);
            } else {// absolute
                matrix = this.modelviewMatrix;
            }
            return true;
        },

        computeWorldToLocalMatrix: function(matrix, nodeVisitor) {
            var inverse = [];
            osg.Matrix.inverse(this.modelviewMatrix, inverse);
            if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
                osg.Matrix.postMult(inverse, matrix);
            } else {
                matrix = inverse;
            }
            return true;
        }

    })), "osg", "Camera");
osg.Camera.prototype.objectType = osg.objectType.generate("Camera");

osg.Depth = function (func, near, far, writeMask) {
    osg.StateAttribute.call(this);
    
    this._func = osg.Depth.LESS;
    this._near = 0.0;
    this._far = 1.0;
    this._writeMask = true;

    if (func !== undefined) {
        if (typeof(func) === "string") {
            this._func = osg.Depth[func];
        } else {
            this._func = func;
        }
    }
    if (near !== undefined) {
        this._near = near;
    }
    if (far !== undefined) {
        this._far = far;
    }
    if (writeMask !== undefined) {
        this._writeMask = writeMask;
    }
};

osg.Depth.DISABLE   = 0x0000;
osg.Depth.NEVER     = 0x0200;
osg.Depth.LESS      = 0x0201;
osg.Depth.EQUAL     = 0x0202;
osg.Depth.LEQUAL    = 0x0203;
osg.Depth.GREATE    = 0x0204;
osg.Depth.NOTEQU    = 0x0205;
osg.Depth.GEQUAL    = 0x0206;
osg.Depth.ALWAYS    = 0x0207;

osg.Depth.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "Depth",
    cloneType: function() {return new osg.Depth(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    setRange: function(near, far) { this._near = near; this._far = far; },
    setWriteMask: function(mask) { this._writeMask = mask; },
    apply: function(state) {
        var gl = state.getGraphicContext();
        if (this._func === 0) {
            gl.disable(gl.DEPTH_TEST);
        } else {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(this._func);
            gl.depthMask(this._writeMask);
            gl.depthRange(this._near, this._far);
        }
    }
}), "osg", "Depth");
osg.WGS_84_RADIUS_EQUATOR = 6378137.0;
osg.WGS_84_RADIUS_POLAR = 6356752.3142;

osg.EllipsoidModel = function() {
    this._radiusEquator = osg.WGS_84_RADIUS_EQUATOR;
    this._radiusPolar = osg.WGS_84_RADIUS_POLAR;
    this.computeCoefficients();
};
osg.EllipsoidModel.prototype = {
    setRadiusEquator: function(r) { this._radiusEquator = radius; this.computeCoefficients();},
    getRadiusEquator: function() { return this._radiusEquator;},
    setRadiusPolar: function(radius) { this._radiusPolar = radius; 
                                              this.computeCoefficients(); },
    getRadiusPolar: function() { return this._radiusPolar; },
    convertLatLongHeightToXYZ: function ( latitude, longitude, height, result ) {
        if (result === undefined) {
            osg.warn("deprecated, use this signature convertLatLongHeightToXYZ( latitude, longitude, height, result )");
            result = [];
        }
        var sin_latitude = Math.sin(latitude);
        var cos_latitude = Math.cos(latitude);
        var N = this._radiusEquator / Math.sqrt( 1.0 - this._eccentricitySquared*sin_latitude*sin_latitude);
        var X = (N+height)*cos_latitude*Math.cos(longitude);
        var Y = (N+height)*cos_latitude*Math.sin(longitude);
        var Z = (N*(1-this._eccentricitySquared)+height)*sin_latitude;
        result[0] = X;
        result[1] = Y;
        result[2] = Z;
        return result;
    },
    convertXYZToLatLongHeight: function ( X,  Y,  Z , result) {
        if (result === undefined) {
            osg.warn("deprecated, use this signature convertXYZToLatLongHeight( X,  Y,  Z , result)");
            result = [];
        }
        // http://www.colorado.edu/geography/gcraft/notes/datum/gif/xyzllh.gif
        var p = Math.sqrt(X*X + Y*Y);
        var theta = Math.atan2(Z*this._radiusEquator , (p*this._radiusPolar));
        var eDashSquared = (this._radiusEquator*this._radiusEquator - this._radiusPolar*this._radiusPolar)/ (this._radiusPolar*this._radiusPolar);

        var sin_theta = Math.sin(theta);
        var cos_theta = Math.cos(theta);

        latitude = Math.atan( (Z + eDashSquared*this._radiusPolar*sin_theta*sin_theta*sin_theta) /
                         (p - this._eccentricitySquared*this._radiusEquator*cos_theta*cos_theta*cos_theta) );
        longitude = Math.atan2(Y,X);

        var sin_latitude = Math.sin(latitude);
        var N = this._radiusEquator / Math.sqrt( 1.0 - this._eccentricitySquared*sin_latitude*sin_latitude);

        height = p/Math.cos(latitude) - N;
        result[0] = latitude;
        result[1] = longitude;
        result[2] = height;
        return result;
    },
    computeLocalUpVector: function(X, Y, Z) {
        // Note latitude is angle between normal to ellipsoid surface and XY-plane
        var  latitude, longitude, altitude;
        var coord = this.convertXYZToLatLongHeight(X,Y,Z,latitude,longitude,altitude);
        latitude = coord[0];
        longitude = coord[1];
        altitude = coord[2];

        // Compute up vector
        return [ Math.cos(longitude) * Math.cos(latitude),
                 Math.sin(longitude) * Math.cos(latitude),
                 Math.sin(latitude) ];
    },
    isWGS84: function() { return(this._radiusEquator == osg.WGS_84_RADIUS_EQUATOR && this._radiusPolar == osg.WGS_84_RADIUS_POLAR);},

    computeCoefficients: function() {
        var flattening = (this._radiusEquator-this._radiusPolar)/this._radiusEquator;
        this._eccentricitySquared = 2*flattening - flattening*flattening;
    },
    computeLocalToWorldTransformFromLatLongHeight : function(latitude, longitude, height, result) {
        if (result === undefined) {
            osg.warn("deprecated, use this signature computeLocalToWorldTransformFromLatLongHeight(latitude, longitude, height, result)");
            result = new Array(16);
        }
        var pos = this.convertLatLongHeightToXYZ(latitude, longitude, height, result);
        var m = osg.Matrix.makeTranslate(pos[0], pos[1], pos[2], result);
        this.computeCoordinateFrame(latitude, longitude, result);
        return result;
    },
    computeLocalToWorldTransformFromXYZ : function(X, Y, Z) {
        var lla = this.convertXYZToLatLongHeight(X, Y, Z);
        var m = osg.Matrix.makeTranslate(X, Y, Z);
        this.computeCoordinateFrame(lla[0], lla[1], m);
        return m;
    },
    computeCoordinateFrame: function ( latitude,  longitude, localToWorld) {
        // Compute up vector
        var  up = [ Math.cos(longitude)*Math.cos(latitude), Math.sin(longitude)*Math.cos(latitude), Math.sin(latitude) ];

        // Compute east vector
        var east = [-Math.sin(longitude), Math.cos(longitude), 0];

        // Compute north vector = outer product up x east
        var north = osg.Vec3.cross(up,east, []);

        // set matrix
        osg.Matrix.set(localToWorld,0,0, east[0]);
        osg.Matrix.set(localToWorld,0,1, east[1]);
        osg.Matrix.set(localToWorld,0,2, east[2]);

        osg.Matrix.set(localToWorld,1,0, north[0]);
        osg.Matrix.set(localToWorld,1,1, north[1]);
        osg.Matrix.set(localToWorld,1,2, north[2]);

        osg.Matrix.set(localToWorld,2,0, up[0]);
        osg.Matrix.set(localToWorld,2,1, up[1]);
        osg.Matrix.set(localToWorld,2,2, up[2]);
    }
};
/** 
 * FrameBufferObject manage fbo / rtt 
 * @class FrameBufferObject
 */
osg.FrameBufferObject = function () {
    osg.StateAttribute.call(this);
    this.fbo = undefined;
    this.attachments = [];
    this.dirty();
};

osg.FrameBufferObject.COLOR_ATTACHMENT0 = 0x8CE0;
osg.FrameBufferObject.DEPTH_ATTACHMENT = 0x8D00;
osg.FrameBufferObject.DEPTH_COMPONENT16 = 0x81A5;

/** @lends osg.FrameBufferObject.prototype */
osg.FrameBufferObject.prototype = osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "FrameBufferObject",
    cloneType: function() {return new osg.FrameBufferObject(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    setAttachment: function(attachment) { this.attachments.push(attachment); },
    _reportFrameBufferError : function(code) {
        switch (code) {
        case 0x8CD6:
            osg.debug("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            break;
        case 0x8CD7:
            osg.debug("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            break;
        case 0x8CD9:
            osg.debug("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            break;
        case 0x8CDD:
            osg.debug("FRAMEBUFFER_UNSUPPORTED");
            break;
        default:
            osg.debug("FRAMEBUFFER unknown error " + code.toString(16));
        }
    },
    apply: function(state) {
        var gl = state.getGraphicContext();
        var status;
        if (this.attachments.length > 0) {
            if (this.isDirty()) {

                if (!this.fbo) {
                    this.fbo = gl.createFramebuffer();
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
                var hasRenderBuffer = false;
                for (var i = 0, l = this.attachments.length; i < l; ++i) {
                    
                    if (this.attachments[i].texture === undefined) { // render buffer
                        var rb = gl.createRenderbuffer();
                        gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
                        gl.renderbufferStorage(gl.RENDERBUFFER, this.attachments[i].format, this.attachments[i].width, this.attachments[i].height);
                        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, this.attachments[i].attachment, gl.RENDERBUFFER, rb);
                        hasRenderBuffer = true;
                    } else {
                        var texture = this.attachments[i].texture;
                        // apply on unit 0 to init it
                        state.applyTextureAttribute(0, texture);
                        
                        //gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachments[i].attachment, texture.getTextureTarget(), texture.getTextureObject(), this.attachments[i].level);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachments[i].attachment, texture.getTextureTarget(), texture.getTextureObject(), this.attachments[i].level);
                    }
                }
                status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status !== 0x8CD5) {
                    this._reportFrameBufferError(status);
                }
                
                if (hasRenderBuffer) { // set it to null only if used renderbuffer
                    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                }
                this.setDirty(false);
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
                if (osg.reportWebGLError === true) {
                    status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                    if (status !== 0x8CD5) {
                        this._reportFrameBufferError(status);
                    }
                }
            }
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
});
osg.FrameStamp = function() {
    var frame = 0;
    var startSimulation = 0.0;
    var currentSimulation = 0.0;
    
    this.setReferenceTime = function(s) { startSimulation = s; };
    this.setSimulationTime = function(s) { currentSimulation = s; };
    this.getReferenceTime = function() { return startSimulation; };
    this.getSimulationTime = function() { return currentSimulation; };
    this.setFrameNumber = function(n) { frame = n; };
    this.getFrameNumber = function() { return frame; };
};
/** -*- compile-command: "jslint-cli Geometry.js" -*- */

/** 
 * Geometry manage array and primitives to draw a geometry.
 * @class Geometry
 */
osg.Geometry = function () {
    osg.Node.call(this);
    this.primitives = [];
    this.attributes = {};
    this.boundingBox = new osg.BoundingBox();
    this.boundingBoxComputed = false;
    this.cacheAttributeList = {};
};

/** @lends osg.Geometry.prototype */
osg.Geometry.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Node.prototype, {
    releaseGLObjects: function(gl) {
        var i;
        for (i in this.attributes) {
            this.attributes[i].releaseGLObjects(gl);
        }
        for (var j = 0, l = this.primitives.length; j < l; j++) {
            var prim = this.primitives[j];
            if (prim.getIndices !== undefined) {
                if (prim.getIndices() !== undefined && prim.getIndices() !== null) {
                    prim.indices.releaseGLObjects(gl);
                }
            }
        }
    },
    dirtyBound: function() {
        if (this.boundingBoxComputed === true) {
            this.boundingBoxComputed = false;
        }
        osg.Node.dirtyBound.call(this);
    },

    dirty: function() {
        this.cacheAttributeList = {};
    },
    getPrimitives: function() { return this.primitives; },
    getAttributes: function() { return this.attributes; },
    getVertexAttributeList: function() { return this.attributes; },
    getPrimitiveSetList: function() { return this.primitives; },

    drawImplementation: function(state) {
        var program = state.getLastProgramApplied();
        var prgID = program.instanceID;
        if (this.cacheAttributeList[prgID] === undefined) {
            var attribute;
            var attributesCache = program.attributesCache;
            var attributeList = [];

            var generated = "//generated by Geometry::implementation\n";
            generated += "state.lazyDisablingOfVertexAttributes();\n";
            generated += "var attr;\n";

            for (var i = 0, l = attributesCache.attributeKeys.length; i < l; i++) {
                var key = attributesCache.attributeKeys[i];
                attribute = attributesCache[key];
                var attr = this.attributes[key];
                if (attr === undefined) {
                    continue;
                }
                attributeList.push(attribute);
                // dont display the geometry if missing data
                generated += "attr = this.attributes[\""+key+ "\"];\n";
                generated += "if (!attr.isValid()) { return; }\n";
                generated += "state.setVertexAttribArray(" + attribute + ", attr, false);\n";
            }
            generated += "state.applyDisablingOfVertexAttributes();\n";
            var primitives = this.primitives;
            generated += "var primitives = this.primitives;\n";
            for (var j = 0, m = primitives.length; j < m; ++j) {
                generated += "primitives["+j+"].draw(state);\n";
            }
            this.cacheAttributeList[prgID] = new Function ("state", generated);
        }
        this.cacheAttributeList[prgID].call(this, state);
    },

    // for testing disabling drawing
    drawImplementationDummy: function(state) {
        var program = state.getLastProgramApplied();
        var attribute;
        var attributeList = [];
        var attributesCache = program.attributesCache;


        var primitives = this.primitives;
        //state.disableVertexAttribsExcept(attributeList);

        for (var j = 0, m = primitives.length; j < m; ++j) {
            //primitives[j].draw(state);
        }
    },

    getBoundingBox: function() {
        if(!this.boundingBoxComputed) {
            this.computeBoundingBox(this.boundingBox);
            this.boundingBoxComputed = true;
        }
        return this.boundingBox;
    },

    computeBoundingBox: function(boundingBox) {
        var vertexArray = this.getAttributes().Vertex;
        
        if ( vertexArray !== undefined && 
             vertexArray.getElements() !== undefined &&
             vertexArray.getItemSize() > 2 ) {
            var v = [0,0,0];
            vertexes = vertexArray.getElements();
            for (var idx = 0, l = vertexes.length; idx < l; idx+=3) {
                v[0] = vertexes[idx];
                v[1] = vertexes[idx+1];
                v[2] = vertexes[idx+2];
                boundingBox.expandByVec3(v);
            }
        }
        return boundingBox;
    },

    computeBound: function (boundingSphere) {
        boundingSphere.init();
        var bb = this.getBoundingBox();
        boundingSphere.expandByBox(bb);
        return boundingSphere;
    }
}), "osg", "Geometry");
osg.Geometry.prototype.objectType = osg.objectType.generate("Geometry");
/** -*- compile-command: "jslint-cli Node.js" -*- */

/** 
 *  Light
 *  @class Light
 */
osg.Light = function (lightNumber) {
    osg.StateAttribute.call(this);

    if (lightNumber === undefined) {
        lightNumber = 0;
    }

    this._ambient = [ 0.2, 0.2, 0.2, 1.0 ];
    this._diffuse = [ 0.8, 0.8, 0.8, 1.0 ];
    this._specular = [ 0.2, 0.2, 0.2, 1.0 ];
    this._position = [ 0.0, 0.0, 1.0, 0.0 ];
    this._direction = [ 0.0, 0.0, -1.0 ];
    this._spotCutoff = 180.0;
    this._spotBlend = 0.01;
    this._constantAttenuation = 1.0;
    this._linearAttenuation = 0.0;
    this._quadraticAttenuation = 0.0;
    this._lightUnit = lightNumber;
    this._enabled = 0;

    this.dirty();
};

/** @lends osg.Light.prototype */
osg.Light.uniforms = {};
osg.Light.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "Light",
    cloneType: function() {return new osg.Light(this._lightUnit); },
    getType: function() { return this.attributeType; },
    getTypeMember: function() { return this.attributeType + this._lightUnit;},
    getOrCreateUniforms: function() {
        var uniforms = osg.Light.uniforms;
        var typeMember = this.getTypeMember();
        if (uniforms[typeMember] === undefined) {
            var uFact = osg.Uniform;
            uniforms[typeMember] = { 
                "ambient": uFact.createFloat4([ 0.2, 0.2, 0.2, 1], this.getUniformName("ambient")) ,
                "diffuse": uFact.createFloat4([ 0.8, 0.8, 0.8, 1], this.getUniformName('diffuse')) ,
                "specular": uFact.createFloat4([ 0.2, 0.2, 0.2, 1], this.getUniformName('specular')) ,
                "position": uFact.createFloat4([ 0, 0, 1, 0], this.getUniformName('position')),
                "direction": uFact.createFloat3([ 0, 0, 1], this.getUniformName('direction')),
                "spotCutoff": uFact.createFloat1( 180.0, this.getUniformName('spotCutoff')),
                "spotBlend": uFact.createFloat1( 0.01, this.getUniformName('spotBlend')),
                "constantAttenuation": uFact.createFloat1( 0, this.getUniformName('constantAttenuation')),
                "linearAttenuation": uFact.createFloat1( 0, this.getUniformName('linearAttenuation')),
                "quadraticAttenuation": uFact.createFloat1( 0, this.getUniformName('quadraticAttenuation')),
                "enable": uFact.createInt1( 0, this.getUniformName('enable')),
                "matrix": uFact.createMatrix4(osg.Matrix.makeIdentity([]), this.getUniformName('matrix')),
                "invMatrix": uFact.createMatrix4(osg.Matrix.makeIdentity([]), this.getUniformName('invMatrix'))
            };

            uniforms[typeMember].uniformKeys = Object.keys(uniforms[typeMember]);
        }
        return uniforms[typeMember];
    },

    setPosition: function(pos) { osg.Vec4.copy(pos, this._position); },
    getPosition: function() { return this._position; },

    setAmbient: function(a) { this._ambient = a; this.dirty(); },
    setSpecular: function(a) { this._specular = a; this.dirty(); },
    setDiffuse: function(a) { this._diffuse = a; this.dirty(); },

    setSpotCutoff: function(a) { this._spotCutoff = a; this.dirty(); },
    getSpotCutoff: function() { return this._spotCutoff; },

    setSpotBlend: function(a) { this._spotBlend = a; this.dirty(); },
    getSpotBlend: function() { return this._spotBlend; },

    setConstantAttenuation: function(value) { this._constantAttenuation = value; this.dirty();},
    setLinearAttenuation: function(value) { this._linearAttenuation = value; this.dirty();},
    setQuadraticAttenuation: function(value) { this._quadraticAttenuation = value; this.dirty();},

    setDirection: function(a) { this._direction = a; this.dirty(); },
    getDirection: function() { return this._direction; },

    setLightNumber: function(unit) { this._lightUnit = unit; this.dirty(); },
    getLightNumber: function() { return this._lightUnit; },

    getPrefix: function() { return this.getType() + this._lightUnit; },
    getParameterName: function (name) { return this.getPrefix()+ "_" + name; },
    getUniformName: function (name) { return this.getPrefix()+ "_uniform_" + name; },

    applyPositionedUniform: function(matrix, state) {
        var uniform = this.getOrCreateUniforms();
        osg.Matrix.copy(matrix, uniform.matrix.get());
        uniform.matrix.dirty();

        osg.Matrix.copy(matrix, uniform.invMatrix.get());
        uniform.invMatrix.get()[12] = 0;
        uniform.invMatrix.get()[13] = 0;
        uniform.invMatrix.get()[14] = 0;
        osg.Matrix.inverse(uniform.invMatrix.get(), uniform.invMatrix.get());
        osg.Matrix.transpose(uniform.invMatrix.get(), uniform.invMatrix.get());
        uniform.invMatrix.dirty();
    },

    apply: function(state)
    {
        var light = this.getOrCreateUniforms();

        light.ambient.set(this._ambient);
        light.diffuse.set(this._diffuse);
        light.specular.set(this._specular);
        light.position.set(this._position);
        light.direction.set(this._direction);

        var spotsize = Math.cos(this._spotCutoff*Math.PI/180.0);
        light.spotCutoff.get()[0] = spotsize;
        light.spotCutoff.dirty();

        light.spotBlend.get()[0] = (1.0 - spotsize)*this._spotBlend;
        light.spotBlend.dirty();

        light.constantAttenuation.get()[0] = this._constantAttenuation;
        light.constantAttenuation.dirty();

        light.linearAttenuation.get()[0] = this._linearAttenuation;
        light.linearAttenuation.dirty();

        light.quadraticAttenuation.get()[0] = this._quadraticAttenuation;
        light.quadraticAttenuation.dirty();

        //light._enable.set([this.enable]);

        this.setDirty(false);
    },


    _replace: function(prefix, list, text, func) {
        for ( var i = 0, l = list.length; i < l; i++) {
            var regex = new RegExp(prefix+list[i],'g');
            text = text.replace(regex, func.call(this, list[i] ));
        }
        return text;
    },

    // will contain functions to generate shader
    _shader: {},
    _shaderCommon: {},

    generateShader: function(type) {
        if (this._shader[type]) {
            return this._shader[type].call(this);
        }
        return "";
    },

    generateShaderCommon: function(type) {
        if (this._shaderCommon[type]) {
            return this._shaderCommon[type].call(this);
        }
        return "";
    }


}),"osg","Light");


// common shader generation functions
osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.VertexInit] = function()
{
    return [ "",
             "varying vec3 FragNormal;",
             "varying vec3 FragEyeVector;",
             "",
             "" ].join('\n');
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.VertexFunction] = function() 
{
    return [ "",
             "vec3 computeNormal() {",
             "   return vec3(NormalMatrix * vec4(Normal, 0.0));",
             "}",
             "",
             "vec3 computeEyeVertex() {",
             "   return vec3(ModelViewMatrix * vec4(Vertex,1.0));",
             "}",
             "",
             ""].join('\n');
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.VertexMain] = function() 
{
    return [ "",
             "  FragEyeVector = computeEyeVertex();",
             "  FragNormal = computeNormal();",
             "" ].join('\n');
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.FragmentInit] = function() {
            return [ "varying vec3 FragNormal;",
                     "varying vec3 FragEyeVector;",
                     "" ].join('\n');
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.FragmentFunction] = function() {
            return [ "",
                     "float getLightAttenuation(vec3 lightDir, float constant, float linear, float quadratic) {",
                     "    ",
                     "    float d = length(lightDir);",
                     "    float att = 1.0 / ( constant + linear*d + quadratic*d*d);",
                     "    return att;",
                     "}",
                     "vec4 computeLightContribution(vec4 materialAmbient,",
                     "                              vec4 materialDiffuse,",
                     "                              vec4 materialSpecular,",
                     "                              float materialShininess,",
                     "                              vec4 lightAmbient,",
                     "                              vec4 lightDiffuse,",
                     "                              vec4 lightSpecular,",
                     "                              vec3 normal,",
                     "                              vec3 eye,",
                     "                              vec3 lightDirection,",
                     "                              vec3 lightSpotDirection,",
                     "                              float lightCosSpotCutoff,",
                     "                              float lightSpotBlend,",
                     "                              float lightAttenuation)",
                     "{",
                     "    vec3 L = lightDirection;",
                     "    vec3 N = normal;",
                     "    float NdotL = max(dot(L, N), 0.0);",
                     "    float halfTerm = NdotL;",
                     "    vec4 ambient = lightAmbient;",
                     "    vec4 diffuse = vec4(0.0);",
                     "    vec4 specular = vec4(0.0);",
                     "    float spot = 0.0;",
                     "",
                     "    if (NdotL > 0.0) {",
                     "        vec3 E = eye;",
                     "        vec3 R = reflect(-L, N);",
                     "        float RdotE = max(dot(R, E), 0.0);",
                     "        if ( RdotE > 0.0) {", 
                     "           RdotE = pow( RdotE, materialShininess );",
                     "        }",
                     "        vec3 D = lightSpotDirection;",
                     "        spot = 1.0;",
                     "        if (lightCosSpotCutoff > 0.0) {",
                     "          float cosCurAngle = dot(-L, D);",
                     "          if (cosCurAngle < lightCosSpotCutoff) {",
                     "             spot = 0.0;",
                     "          } else {",
                     "             if (lightSpotBlend > 0.0)",
                     "               spot = cosCurAngle * smoothstep(0.0, 1.0, (cosCurAngle-lightCosSpotCutoff)/(lightSpotBlend));",
                     "          }",
                     "        }",

                     "        diffuse = lightDiffuse * ((halfTerm));",
                     "        specular = lightSpecular * RdotE;",
                     "    }",
                     "",
                     "    return (materialAmbient*ambient + (materialDiffuse*diffuse + materialSpecular*specular) * spot) * lightAttenuation;",
                     "}",
                     "float linearrgb_to_srgb1(const in float c)",
                     "{",
                     "  float v = 0.0;",
                     "  if(c < 0.0031308) {",
                     "    if ( c > 0.0)",
                     "      v = c * 12.92;",
                     "  } else {",
                     "    v = 1.055 * pow(c, 1.0/2.4) - 0.055;",
                     "  }",
                     "  return v;",
                     "}",

                     "vec4 linearrgb_to_srgb(const in vec4 col_from)",
                     "{",
                     "  vec4 col_to;",
                     "  col_to.r = linearrgb_to_srgb1(col_from.r);",
                     "  col_to.g = linearrgb_to_srgb1(col_from.g);",
                     "  col_to.b = linearrgb_to_srgb1(col_from.b);",
                     "  col_to.a = col_from.a;",
                     "  return col_to;",
                     "}",
                     "float srgb_to_linearrgb1(const in float c)",
                     "{",
                     "  float v = 0.0;",
                     "  if(c < 0.04045) {",
                     "    if (c >= 0.0)",
                     "      v = c * (1.0/12.92);",
                     "  } else {",
                     "    v = pow((c + 0.055)*(1.0/1.055), 2.4);",
                     "  }",
                     " return v;",
                     "}",
                     "vec4 srgb2linear(const in vec4 col_from)",
                     "{",
                     "  vec4 col_to;",
                     "  col_to.r = srgb_to_linearrgb1(col_from.r);",
                     "  col_to.g = srgb_to_linearrgb1(col_from.g);",
                     "  col_to.b = srgb_to_linearrgb1(col_from.b);",
                     "  col_to.a = col_from.a;",
                     "  return col_to;",
                     "}",

                     "" ].join('\n');
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.FragmentMain] = function() {
            return [ "",
                     "  vec3 normal = normalize(FragNormal);",
                     "  vec3 eyeVector = normalize(-FragEyeVector);",
                     "  vec4 lightColor = MaterialEmission;",
                     ""].join("\n");
};

osg.Light.prototype._shaderCommon[osg.ShaderGeneratorType.FragmentEnd] = function() {
    return [ "",
             "  fragColor *= lightColor;",
             ""].join('\n');
};


// shader generation per instance of attribute
osg.Light.prototype._shader[osg.ShaderGeneratorType.FragmentInit] = function()
{
    var str = [ "",
                "uniform vec4 Light_position;",
                "uniform vec3 Light_direction;",
                "uniform mat4 Light_matrix;",
                "uniform mat4 Light_invMatrix;",
                "uniform float Light_constantAttenuation;",
                "uniform float Light_linearAttenuation;",
                "uniform float Light_quadraticAttenuation;",
                "uniform vec4 Light_ambient;",
                "uniform vec4 Light_diffuse;",
                "uniform vec4 Light_specular;",
                "uniform float Light_spotCutoff;",
                "uniform float Light_spotBlend;",
                "" ].join('\n');

    // replace Light_xxxx by instance variable of 'this' light
    uniforms = Object.keys(this.getOrCreateUniforms());
    str = this._replace("Light_", uniforms, str, this.getUniformName);
    return str;
};

osg.Light.prototype._shader[osg.ShaderGeneratorType.FragmentMain] = function()
{
    var str = [ "",
                "  vec3 lightEye = vec3(Light_matrix * Light_position);",
                "  vec3 lightDir;",
                "  if (Light_position[3] == 1.0) {",
                "    lightDir = lightEye - FragEyeVector;",
                "  } else {",
                "    lightDir = lightEye;",
                "  }",
                "  vec3 spotDirection = normalize(mat3(vec3(Light_invMatrix[0]), vec3(Light_invMatrix[1]), vec3(Light_invMatrix[2]))*Light_direction);",
                "  float attenuation = getLightAttenuation(lightDir, Light_constantAttenuation, Light_linearAttenuation, Light_quadraticAttenuation);",
                "  lightDir = normalize(lightDir);",
                "  lightColor += computeLightContribution(MaterialAmbient,",
                "                                         MaterialDiffuse, ",
                "                                         MaterialSpecular,",
                "                                         MaterialShininess,",
                "                                         Light_ambient,",
                "                                         Light_diffuse,",
                "                                         Light_specular,",
                "                                         normal,",
                "                                         eyeVector,",
                "                                         lightDir,",
                "                                         spotDirection,",
                "                                         Light_spotCutoff,",
                "                                         Light_spotBlend,",
                "                                         attenuation);",
                "" ].join('\n');

    var fields = [ "lightEye",
                   "lightDir",
                   "spotDirection",
                   "attenuation"
                 ];
    str = this._replace("", fields, str, this.getParameterName);
    uniforms = Object.keys(this.getOrCreateUniforms());
    str = this._replace("Light_", uniforms, str, this.getUniformName);
    return str;
};
/** -*- compile-command: "jslint-cli Node.js" -*- */

/** 
 *  LightSource is a positioned node to use with StateAttribute Light
 *  @class LightSource
 */
osg.LightSource = function() {
    osg.Node.call(this);
    this._light = undefined;
};

/** @lends osg.LightSource.prototype */
osg.LightSource.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Node.prototype, {
    getLight: function() { return this._light; },
    setLight: function(light) { this._light = light; }
}), "osg","LightSource");
osg.LightSource.prototype.objectType = osg.objectType.generate("LightSource");
osg.LineWidth = function (lineWidth) {
    osg.StateAttribute.call(this);
    this.lineWidth = 1.0;
    if (lineWidth !== undefined) {
        this.lineWidth = lineWidth;
    }
};
osg.LineWidth.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "LineWidth",
    cloneType: function() {return new osg.LineWidth(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    apply: function(state) { state.getGraphicContext().lineWidth(this.lineWidth); }
}),"osg","LineWidth");
/** 
 * Material
 * @class Material
 */
osg.Material = function () {
    osg.StateAttribute.call(this);
    this.ambient = [ 0.2, 0.2, 0.2, 1.0 ];
    this.diffuse = [ 0.8, 0.8, 0.8, 1.0 ];
    this.specular = [ 0.0, 0.0, 0.0, 1.0 ];
    this.emission = [ 0.0, 0.0, 0.0, 1.0 ];
    this.shininess = 12.5;
};
/** @lends osg.Material.prototype */
osg.Material.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    setEmission: function(a) { osg.Vec4.copy(a, this.emission); this._dirty = true; },
    setAmbient: function(a) { osg.Vec4.copy(a, this.ambient); this._dirty = true; },
    setSpecular: function(a) { osg.Vec4.copy(a, this.specular); this._dirty = true; },
    setDiffuse: function(a) { osg.Vec4.copy(a, this.diffuse); this._dirty = true; },
    setShininess: function(a) { this.shininess = a; this._dirty = true; },

    getEmission: function() { return this.emission;},
    getAmbient: function() { return this.ambient; },
    getSpecular: function() { return this.specular;},
    getDiffuse: function() { return this.diffuse;},
    getShininess: function() { return this.shininess; },

    attributeType: "Material",
    cloneType: function() {return new osg.Material(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    getOrCreateUniforms: function() {
        if (osg.Material.uniforms === undefined) {
            osg.Material.uniforms = { "ambient": osg.Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialAmbient') ,
                                      "diffuse": osg.Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialDiffuse') ,
                                      "specular": osg.Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialSpecular') ,
                                      "emission": osg.Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialEmission') ,
                                      "shininess": osg.Uniform.createFloat1([ 0], 'MaterialShininess')
                                    };
            var uniformKeys = [];
            for (var k in osg.Material.uniforms) {
                uniformKeys.push(k);
            }
            osg.Material.uniforms.uniformKeys = uniformKeys;
        }
        return osg.Material.uniforms;
    },

    apply: function(state)
    {
        var uniforms = this.getOrCreateUniforms();
        uniforms.ambient.set(this.ambient);
        uniforms.diffuse.set(this.diffuse);
        uniforms.specular.set(this.specular);
        uniforms.emission.set(this.emission);
        uniforms.shininess.set([this.shininess]);
        this._dirty = false;
    },


    // will contain functions to generate shader
    _shader: {},
    _shaderCommon: {},

    generateShader: function(type) {
        if (this._shader[type]) {
            return this._shader[type].call(this);
        }
        return "";
    }

}),"osg","Material");


osg.Material.prototype._shader[osg.ShaderGeneratorType.VertexInit] = function()
{
    var str =  [ "uniform vec4 MaterialAmbient;",
                 "uniform vec4 MaterialDiffuse;",
                 "uniform vec4 MaterialSpecular;",
                 "uniform vec4 MaterialEmission;",
                 "uniform float MaterialShininess;",
                 ""].join('\n');
    return str;
};

osg.Material.prototype._shader[osg.ShaderGeneratorType.FragmentInit] = function()
{
    var str =  [ "uniform vec4 MaterialAmbient;",
                 "uniform vec4 MaterialDiffuse;",
                 "uniform vec4 MaterialSpecular;",
                 "uniform vec4 MaterialEmission;",
                 "uniform float MaterialShininess;",
                 ""].join('\n');
    return str;
};
/** -*- compile-command: "jslint-cli Node.js" -*- */

/** 
 *  MatrixTransform is a Transform Node that can be customized with user matrix
 *  @class MatrixTransform
 */
osg.MatrixTransform = function() {
    osg.Transform.call(this);
    this.matrix = osg.Matrix.makeIdentity([]);
};

/** @lends osg.MatrixTransform.prototype */
osg.MatrixTransform.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Transform.prototype, {
    getMatrix: function() { return this.matrix; },
    setMatrix: function(m) { this.matrix = m; },
    computeLocalToWorldMatrix: function(matrix,nodeVisitor) {
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.preMult(matrix, this.matrix);
        } else {
            matrix = this.matrix;
        }
        return true;
    },
    computeWorldToLocalMatrix: function(matrix,nodeVisitor) {
        var minverse = [];
        osg.Matrix.inverse(this.matrix, minverse);
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.postMult(minverse, matrix);
        } else {// absolute
            matrix = inverse;
        }
        return true;
    }
}),"osg","MatrixTransform");
osg.MatrixTransform.prototype.objectType = osg.objectType.generate("MatrixTransform");
osg.PrimitiveSet = function() {};
osg.PrimitiveSet.POINTS                         = 0x0000;
osg.PrimitiveSet.LINES                          = 0x0001;
osg.PrimitiveSet.LINE_LOOP                      = 0x0002;
osg.PrimitiveSet.LINE_STRIP                     = 0x0003;
osg.PrimitiveSet.TRIANGLES                      = 0x0004;
osg.PrimitiveSet.TRIANGLE_STRIP                 = 0x0005;
osg.PrimitiveSet.TRIANGLE_FAN                   = 0x0006;

/** 
 * DrawArrays manage rendering primitives
 * @class DrawArrays
 */
osg.DrawArrays = function (mode, first, count) 
{
    this.mode = mode;
    this.first = first;
    this.count = count;
};

/** @lends osg.DrawArrays.prototype */
osg.DrawArrays.prototype = {
    draw: function(state) {
        var gl = state.getGraphicContext();
        gl.drawArrays(this.mode, this.first, this.count);
    },
    getMode: function() { return this.mode; },
    getCount: function() { return this.count; },
    getFirst: function() { return this.first; }
};
osg.DrawArrays.create = function(mode, first, count) {
    osg.log("osg.DrawArrays.create is deprecated, use new osg.DrawArrays with same arguments");
    var d = new osg.DrawArrays(mode, first, count);
    return d;
};


/** 
 * DrawArrayLengths manage rendering primitives
 * @class DrawArrayLengths
 */
osg.DrawArrayLengths = function (mode, first, array)
{
    this._mode = mode;
    this._first = first;
    this._arrayLengths = array.slice(0);
};

/** @lends osg.DrawArrayLengths.prototype */
osg.DrawArrayLengths.prototype = {
    draw: function(state) {
        var gl = state.getGraphicContext();
        var mode = this._mode;
        var first = this._first;
        var array = this._arrayLengths;
        for (var i = 0, l = array.length; i < l; i++) {
            var count = array[i];
            gl.drawArrays(mode, first, count);
            first += count;
        }
    },
    getMode: function() { return this._mode; },
    getNumIndices: function() {
        var count = 0;
        var array = this._arrayLengths;
        for (var i = 0, l = array.length; i < l; i++) {
            count += array[i];
        }
        return count; 
    },
    getArrayLengths: function() { return this._arrayLengths; },
    getFirst: function() { return this._first; },
    setFirst: function(first) { this._first = first; }
};


/** 
 * DrawElements manage rendering of indexed primitives
 * @class DrawElements
 */
osg.DrawElements = function (mode, indices) {
    this.mode = osg.PrimitiveSet.POINTS;
    if (mode !== undefined) {
        this.mode = mode;
    }

    this.count = 0;
    this.offset = 0;
    this.indices = indices;
    if (indices !== undefined) {
        this.setIndices(indices);
    }
};

/** @lends osg.DrawElements.prototype */
osg.DrawElements.prototype = {
    getMode: function() { return this.mode; },
    draw: function(state) {
        state.setIndexArray(this.indices);
        var gl = state.getGraphicContext();
        gl.drawElements(this.mode, this.count, gl.UNSIGNED_SHORT, this.offset );
    },
    setIndices: function(indices) { 
        this.indices = indices;
        this.count = indices.getElements().length;
    },
    getIndices: function() { return this.indices; },
    setFirst: function(val) { this.offset = val; },
    getFirst: function() { return this.offset;},
    setCount: function(val) { this.count = val;},
    getCount: function() { return this.count; }

};

osg.DrawElements.create = function(mode, indices) {
    osg.log("osg.DrawElements.create is deprecated, use new osg.DrawElements with same arguments");
    return new osg.DrawElements(mode, indices);
};
/** 
 * Program encapsulate an vertex and fragment shader
 * @class Program
 */
osg.Program = function (vShader, fShader) { 
    osg.StateAttribute.call(this);

    if (osg.Program.instanceID === undefined) {
        osg.Program.instanceID = 0;
    }
    this.instanceID = osg.Program.instanceID;

    osg.Program.instanceID+= 1;

    this.program = null;
    this.setVertexShader(vShader);
    this.setFragmentShader(fShader);
    this.dirty = true;
};

/** @lends osg.Program.prototype */
osg.Program.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {

    attributeType: "Program",
    cloneType: function() { var p = new osg.Program(); p.default_program = true; return p; },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    setVertexShader: function(vs) { this.vertex = vs; },
    setFragmentShader: function(fs) { this.fragment = fs; },
    getVertexShader: function() { return this.vertex; },
    getFragmentShader: function() { return this.fragment; },
    apply: function(state) {
        if (!this.program || this.isDirty()) {

            if (this.default_program === true) {
                return;
            }

            if (!this.vertex.shader) {
                this.vertex.compile();
            }
            if (!this.fragment.shader) {
                this.fragment.compile();
            }
            this.program = gl.createProgram();
            gl.attachShader(this.program, this.vertex.shader);
            gl.attachShader(this.program, this.fragment.shader);
            gl.linkProgram(this.program);
            gl.validateProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS) &&
                !gl.isContextLost()) {
                osg.log("can't link program\n" + "vertex shader:\n" + this.vertex.text +  "\n fragment shader:\n" + this.fragment.text);
                osg.log(gl.getProgramInfoLog(this.program));
                this.setDirty(false);
                //debugger;
                return null;
            }

            this.uniformsCache = {};
            this.uniformsCache.uniformKeys = [];
            this.attributesCache = {};
            this.attributesCache.attributeKeys = [];

            this.cacheUniformList(this.vertex.text);
            this.cacheUniformList(this.fragment.text);
            //osg.log(this.uniformsCache);

            this.cacheAttributeList(this.vertex.text);

            this.setDirty(false);
        }

        gl.useProgram(this.program);
    },

    cacheUniformList: function(str) {
        var r = str.match(/uniform\s+\w+\s+\w+/g);
        if (r !== null) {
            for (var i = 0, l = r.length; i < l; i++) {
                var uniform = r[i].match(/uniform\s+\w+\s+(\w+)/)[1];
                var location = gl.getUniformLocation(this.program, uniform);
                if (location !== undefined && location !== null) {
                    if (this.uniformsCache[uniform] === undefined) {
                        this.uniformsCache[uniform] = location;
                        this.uniformsCache.uniformKeys.push(uniform);
                    }
                }
            }
        }
    },

    cacheAttributeList: function(str) {
        var r = str.match(/attribute\s+\w+\s+\w+/g);
        if (r !== null) {
            for (var i = 0, l = r.length; i < l; i++) {
                var attr = r[i].match(/attribute\s+\w+\s+(\w+)/)[1];
                var location = gl.getAttribLocation(this.program, attr);
                if (location !== -1 && location !== undefined) {
                    if (this.attributesCache[attr] === undefined) {
                        this.attributesCache[attr] = location;
                        this.attributesCache.attributeKeys.push(attr);
                    }
                }
            }
        }
    }
}), "osg", "Program");

osg.Program.create = function(vShader, fShader) {
    console.log("osg.Program.create is deprecated use new osg.Program(vertex, fragment) instead");
    var program = new osg.Program(vShader, fShader);
    return program;
};
osg.Projection = function () {
    osg.Node.call(this);
    this.projection = osg.Matrix.makeIdentity([]);
};
osg.Projection.prototype = osg.objectInehrit(osg.Node.prototype, {
    getProjectionMatrix: function() { return this.projection; },
    setProjectionMatrix: function(m) { this.projection = m; }
});
osg.Projection.prototype.objectType = osg.objectType.generate("Projection");

/** @class Quaternion Operations */
osg.Quat = {
    copy: function(s, d) {
        d[0] = s[0];
        d[1] = s[1];
        d[2] = s[2];
        d[3] = s[3];
        return d;
    },
    makeIdentity: function(element) { return osg.Quat.init(element); },
    zeroRotation: function(element) { return osg.Quat.init(element); },

    init: function(element) {
        element[0] = 0;
        element[1] = 0;
        element[2] = 0;
        element[3] = 1;
        return element;
    },

    sub: function(a, b, result) {
        result[0] = a[0] - b[0];
        result[1] = a[1] - b[1];
        result[2] = a[2] - b[2];
        result[3] = a[3] - b[3];
        return result;
    },

    add: function(a, b, result) {
        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
        result[2] = a[2] + b[2];
        result[3] = a[3] + b[3];
        return result;
    },

    dot: function(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
    },

    length2: function(a) {
        return a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3];
    },

    neg: function(a, result) {
        result[0] = -a[0];
        result[1] = -a[1];
        result[2] = -a[2];
        result[3] = -a[3];
        return result;
    },

    makeRotate: function(angle, x, y, z, result ) {
        var epsilon = 0.0000001;
        var length = Math.sqrt(x*x+ y*y+ z*z);
        if (length < epsilon) {
            return this.init();
        }

        var inversenorm  = 1.0/length;
        var coshalfangle = Math.cos( 0.5*angle );
        var sinhalfangle = Math.sin( 0.5*angle );

        if (result === undefined) {
            result = [];
        }
        result[0] = x * sinhalfangle * inversenorm;
        result[1] = y * sinhalfangle * inversenorm;
        result[2] = z * sinhalfangle * inversenorm;
        result[3] = coshalfangle;
        return result;
    },

    lerp: function(t, a, b, r) {
        r[0] = a[0] + (b[0]-a[0])*t;
        r[1] = a[1] + (b[1]-a[1])*t;
        r[2] = a[2] + (b[2]-a[2])*t;
        r[3] = a[3] + (b[3]-a[3])*t;
        return r;
    },

    slerp: function(t, from, to, result) {
        var epsilon = 0.00001;

        var quatTo = to;
        var cosomega = this.dot(from,quatTo);
        if ( cosomega <0.0 )
        {
            cosomega = -cosomega;
            this.neg(to, quatTo);
        }

        var omega;
        var sinomega;
        var scale_from;
        var scale_to;
        if( (1.0 - cosomega) > epsilon )
        {
            omega= Math.acos(cosomega) ;  // 0 <= omega <= Pi (see man acos)
            sinomega = Math.sin(omega) ;  // this sinomega should always be +ve so
            // could try sinomega=sqrt(1-cosomega*cosomega) to avoid a sin()?
            scale_from = Math.sin((1.0-t)*omega)/sinomega ;
            scale_to = Math.sin(t*omega)/sinomega ;
        }
        else
        {
            /* --------------------------------------------------
             The ends of the vectors are very close
             we can use simple linear interpolation - no need
             to worry about the "spherical" interpolation
             -------------------------------------------------- */
            scale_from = 1.0 - t ;
            scale_to = t ;
        }

        result[0] = from[0]*scale_from + quatTo[0]*scale_to;
        result[1] = from[1]*scale_from + quatTo[1]*scale_to;
        result[2] = from[2]*scale_from + quatTo[2]*scale_to;
        result[3] = from[3]*scale_from + quatTo[3]*scale_to;
        return result;
    },

    // transformVec3: function (q, vec, result) {
    //     // nVidia SDK implementation
    //     var uv = new Array(3);
    //     var uuv = new Array(3);
    //     osg.Vec3.cross(q, vec, uv);
    //     osg.Vec3.cross(q, uv, result);
    //     osg.Vec3.mult(uv, 2.0 * q[3], uv);
    //     osg.Vec3.mult(result, 2.0, result);
    //     osg.Vec3.add(result, uv, result);
    //     osg.Vec3.add(result, vec, result);
    //     return result;
    // },

    normalize: function(q, qr) {
        var div = 1.0/this.length2(q);
        qr[0] = q[0]*div;
        qr[1] = q[1]*div;
        qr[2] = q[2]*div;
        qr[3] = q[3]*div;
        return qr;
    },

    // we suppose to have unit quaternion
    conj: function(a, result) {
        result[0] = -a[0];
        result[1] = -a[1];
        result[2] = -a[2];
        result[3] = a[3];
        return result;
    },

    inverse: function(a, result) {
        var div = 1.0/ this.length2(a);
        this.conj(a, result);
        result[0] *= div;
        result[1] *= div;
        result[2] *= div;
        result[3] *= div;
        return result;
    },

    // we suppose to have unit quaternion
    // multiply 2 quaternions
    mult: function(a, b, result) {
        result[0] =  a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0];
        result[1] = -a[0] * b[2] + a[1] * b[3] + a[2] * b[0] + a[3] * b[1];
        result[2] =  a[0] * b[1] - a[1] * b[0] + a[2] * b[3] + a[3] * b[2];
        result[3] = -a[0] * b[0] - a[1] * b[1] - a[2] * b[2] + a[3] * b[3];
        return result;
    },
    div: function(a, b, result) {
        var d = 1.0/b;
        result[0] = a[0] * d;
        result[1] = a[1] * d;
        result[2] = a[2] * d;
        result[3] = a[3] * d;
        return result;
    },
    exp: function(a, res) {
	var r  = Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
	var et = Math.exp(a[3]);
        var s = 0;
        if (r > 0.00001) {
            s = et * Math.sin(r)/r;
        }
        if (res === undefined) {
            res = [];
        }
        res[0] = s*a[0];
        res[1] = s*a[1];
        res[2] = s*a[2];
        res[3] = et*Math.cos(r);
        return res;
    },

    ln: function(a, res) {
        var n = a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
	var r  = Math.sqrt(n);
	var t  = 0;
        if (r>0.00001) {
            t= Math.atan2(r,a[3])/r;
        }
        if (res === undefined) {
            res = [];
        }
        n += a[3]*a[3];
        res[0] = t*a[0];
        res[1] = t*a[1];
        res[2] = t*a[2];
        res[3] = 0.5*Math.log(n);
        return res;
    },


    //http://theory.org/software/qfa/writeup/node12.html
    //http://www.ece.uwaterloo.ca/~dwharder/C++/CQOST/src/
    //http://willperone.net/Code/quaternion.php

    // a is computeTangent(q1-1,q1,q2)
    // b is computeTangent(q2-1,q2,q2+1)
    squad: function(t, q1, a, b, q2, r) {
        var r1 = this.slerp(t, q1, q2);
        var r2 = this.slerp(t, a, b);
        return this.slerp(2.0 * t * (1.0 - t), r1, r2, r);
    },

    // qcur is current
    // q0 is qcur-1
    // q2 is qcur+1
    // compute tangent in of q1
    computeTangent: function(q0, qcur, q2, r) {

        // first step
        var invq = this.inv(qcur);
        var qa,qb;

        this.mult(q2, invq, qa);
        this.ln(qa, qa);

        this.mult(q0, invq , qb);
        this.ln(qb, qb);

        this.add(qa, qb, qa);
        this.div(qa, -4.0, qa);
        this.exp(qa, qb);
        return this.mult(qb, q1, r);
    }

};
osg.RenderBin = function () {
    this._leafs = [];
    this.positionedAttribute = [];
    this._renderStage = undefined;
    this._bins = {};
    this.stateGraphList = [];
    this._parent = undefined;
    this._binNum = 0;

    this._sorted = false;
    this._sortMode = osg.RenderBin.SORT_BY_STATE;

};
osg.RenderBin.SORT_BY_STATE = 0;
osg.RenderBin.SORT_BACK_TO_FRONT = 1;
osg.RenderBin.BinPrototypes = {
    RenderBin: function() {
        return new osg.RenderBin();
    },
    DepthSortedBin: function() {
        var rb = new osg.RenderBin();
        rb._sortMode = osg.RenderBin.SORT_BACK_TO_FRONT;
        return rb;
    }
};

osg.RenderBin.prototype = {
    _createRenderBin: function(binName) {
        if (binName === undefined || osg.RenderBin.BinPrototypes[binName] === undefined) {
            return osg.RenderBin.BinPrototypes.RenderBin();
        }
        return osg.RenderBin.BinPrototypes[binName]();
    },
    getStateGraphList: function() { return this.stateGraphList; },
    copyLeavesFromStateGraphListToRenderLeafList: function() {

        this._leafs.splice(0, this._leafs.length);
        var detectedNaN = false;

        for (var i = 0, l = this.stateGraphList.length; i < l; i++) {
            var leafs = this.stateGraphList[i].leafs;
            for (var j = 0, k = leafs.length; j < k; j++) {
                var leaf = leafs[j];
                if (isNaN(leaf.depth)) {
                    detectedNaN = true;
                } else {
                    this._leafs.push(leaf);
                }
            }
        }

        if (detectedNaN) {
            osg.debug("warning: RenderBin::copyLeavesFromStateGraphListToRenderLeafList() detected NaN depth values, database may be corrupted.");
        }        
        // empty the render graph list to prevent it being drawn along side the render leaf list (see drawImplementation.)
        this.stateGraphList.splice(0, this.stateGraphList.length);
    },
    
    sortBackToFront: function() {
        this.copyLeavesFromStateGraphListToRenderLeafList();
        var cmp = function(a, b) {
            return b.depth - a.depth;
        };
        this._leafs.sort(cmp);
    },

    sortImplementation: function() {
        var SortMode = osg.RenderBin;
        switch(this._sortMode) {
        case SortMode.SORT_BACK_TO_FRONT:
            this.sortBackToFront();
            break;
        case SortMode.SORT_BY_STATE:
            // do nothing
            break;
        }
    },

    sort: function() {
        if (this._sorted) {
            return;
        }

        var bins = this._bins;
        var keys = Object.keys(bins);
        for (var i = 0, l = keys.length; i < l; i++) {
            bins[keys[i]].sort();
        }
        this.sortImplementation();

        _sorted = true;
    },

    setParent: function(parent) { this._parent = parent; },
    getParent: function() { return this._parent; },
    getBinNumber: function() { return this._binNum; },
    findOrInsert: function(binNum, binName) {
        var bin = this._bins[binNum];
        if (bin === undefined) {
            bin = this._createRenderBin(binName);
            bin._parent = this;
            bin._binNum = binNum;
            bin._renderStage = this._renderStage;
            this._bins[binNum] = bin;
        }
        return bin;
    },
    getStage: function() { return this._renderStage; },
    addStateGraph: function(sg) { this.stateGraphList.push(sg); },
    reset: function() {
        this.stateGraphList.length = 0;
        this._bins = {};
        this.positionedAttribute.length = 0;
        this._leafs.length = 0;
        this._sorted = false;
    },
    applyPositionedAttribute: function(state, positionedAttibutes) {
        // the idea is to set uniform 'globally' in uniform map.
        for (var index = 0, l = positionedAttibutes.length; index < l; index++) {
            var element = positionedAttibutes[index];
            // add or set uniforms in state
            var stateAttribute = element[1];
            var matrix = element[0];
            state.setGlobalDefaultValue(stateAttribute);
            stateAttribute.apply(state);
            stateAttribute.applyPositionedUniform(matrix, state);
            state.haveAppliedAttribute(stateAttribute);
        }
    },

    drawImplementation: function(state, previousRenderLeaf) {
        var previous = previousRenderLeaf;
        var binsKeys = Object.keys(this._bins);
        var bins = this._bins;
        var binsArray = [];
        for (var i = 0, l = binsKeys.length; i < l; i++) {
            var k = binsKeys[i];
            binsArray.push(bins[k]);
        }
        var cmp = function(a, b) {
            return a._binNum - b._binNum;
        };
        binsArray.sort(cmp);

        var current = 0;
        var end = binsArray.length;

        var bin;
        // draw pre bins
        for (; current < end; current++) {
            bin = binsArray[current];
            if (bin.getBinNumber() > 0) {
                break;
            }
            previous = bin.drawImplementation(state, previous);
        }
        
        // draw leafs
        previous = this.drawLeafs(state, previous);

        // draw post bins
        for (; current < end; current++) {
            bin = binsArray[current];
            previous = bin.drawImplementation(state, previous);
        }
        return previous;
    },

    drawLeafs: function(state, previousRenderLeaf) {

        var stateList = this.stateGraphList;
        var leafs = this._leafs;
        var normalUniform;
        var modelViewUniform;
        var projectionUniform;
        var program;
        var stateset;
        var previousLeaf = previousRenderLeaf;
        var normal = [];
        var normalTranspose = [];

        var Matrix = osg.Matrix;

        if (previousLeaf) {
            osg.StateGraph.prototype.moveToRootStateGraph(state, previousRenderLeaf.parent);
        }

        var leaf, push;
        var prev_rg, prev_rg_parent, rg;

        // draw fine grained ordering.
        for (var d = 0, dl = leafs.length; d < dl; d++) {
            leaf = leafs[d];
            push = false;
            if (previousLeaf !== undefined) {

                // apply state if required.
                prev_rg = previousLeaf.parent;
                prev_rg_parent = prev_rg.parent;
                rg = leaf.parent;
                if (prev_rg_parent !== rg.parent)
                {
                    rg.moveStateGraph(state, prev_rg_parent, rg.parent);

                    // send state changes and matrix changes to OpenGL.
                    state.pushStateSet(rg.stateset);
                    push = true;
                }
                else if (rg !== prev_rg)
                {
                    // send state changes and matrix changes to OpenGL.
                    state.pushStateSet(rg.stateset);
                    push = true;
                }

            } else {
                leaf.parent.moveStateGraph(state, undefined, leaf.parent.parent);
                state.pushStateSet(leaf.parent.stateset);
                push = true;
            }

            if (push === true) {
                //state.pushGeneratedProgram();
                state.apply();
                program = state.getLastProgramApplied();

                modelViewUniform = program.uniformsCache[state.modelViewMatrix.name];
                projectionUniform = program.uniformsCache[state.projectionMatrix.name];
                normalUniform = program.uniformsCache[state.normalMatrix.name];
            }


            if (modelViewUniform !== undefined) {
                state.modelViewMatrix.set(leaf.modelview);
                state.modelViewMatrix.apply(modelViewUniform);
            }
            if (projectionUniform !== undefined) {
                state.projectionMatrix.set(leaf.projection);
                state.projectionMatrix.apply(projectionUniform);
            }
            if (normalUniform !== undefined) {
                Matrix.copy(leaf.modelview, normal);
                //Matrix.setTrans(normal, 0, 0, 0);
                normal[12] = 0;
                normal[13] = 0;
                normal[14] = 0;

                Matrix.inverse(normal, normal);
                Matrix.transpose(normal, normal);
                state.normalMatrix.set(normal);
                state.normalMatrix.apply(normalUniform);
            }

            leaf.geometry.drawImplementation(state);

            if (push === true) {
                state.popGeneratedProgram();
                state.popStateSet();
            }

            previousLeaf = leaf;
        }

        
        // draw coarse grained ordering.
        for (var i = 0, l = stateList.length; i < l; i++) {
            var sg = stateList[i];
            for (var j = 0, ll = sg.leafs.length; j < ll; j++) {

                leaf = sg.leafs[j];
                push = false;
                if (previousLeaf !== undefined) {

                    // apply state if required.
                    prev_rg = previousLeaf.parent;
                    prev_rg_parent = prev_rg.parent;
                    rg = leaf.parent;
                    if (prev_rg_parent !== rg.parent)
                    {
                        rg.moveStateGraph(state, prev_rg_parent, rg.parent);

                        // send state changes and matrix changes to OpenGL.
                        state.pushStateSet(rg.stateset);
                        push = true;
                    }
                    else if (rg !== prev_rg)
                    {
                        // send state changes and matrix changes to OpenGL.
                        state.pushStateSet(rg.stateset);
                        push = true;
                    }

                } else {
                    leaf.parent.moveStateGraph(state, undefined, leaf.parent.parent);
                    state.pushStateSet(leaf.parent.stateset);
                    push = true;
                }

                if (push === true) {
                    //state.pushGeneratedProgram();
                    state.apply();
                    program = state.getLastProgramApplied();

                    modelViewUniform = program.uniformsCache[state.modelViewMatrix.name];
                    projectionUniform = program.uniformsCache[state.projectionMatrix.name];
                    normalUniform = program.uniformsCache[state.normalMatrix.name];
                }


                if (modelViewUniform !== undefined) {
                    state.modelViewMatrix.set(leaf.modelview);
                    state.modelViewMatrix.apply(modelViewUniform);
                }
                if (projectionUniform !== undefined) {
                    state.projectionMatrix.set(leaf.projection);
                    state.projectionMatrix.apply(projectionUniform);
                }
                if (normalUniform !== undefined) {
                    Matrix.copy(leaf.modelview, normal);
                    //Matrix.setTrans(normal, 0, 0, 0);
                    normal[12] = 0;
                    normal[13] = 0;
                    normal[14] = 0;

                    Matrix.inverse(normal, normal);
                    Matrix.transpose(normal, normal);
                    state.normalMatrix.set(normal);
                    state.normalMatrix.apply(normalUniform);
                }

                leaf.geometry.drawImplementation(state);

                if (push === true) {
                    state.popGeneratedProgram();
                    state.popStateSet();
                }

                previousLeaf = leaf;
            }
        }
        return previousLeaf;
    }
};
/**
 * From OpenSceneGraph http://www.openscenegraph.org
 * RenderStage base class. Used for encapsulate a complete stage in
 * rendering - setting up of viewport, the projection and model
 * matrices and rendering the RenderBin's enclosed with this RenderStage.
 * RenderStage also has a dependency list of other RenderStages, each
 * of which must be called before the rendering of this stage.  These
 * 'pre' rendering stages are used for advanced rendering techniques
 * like multistage pixel shading or impostors.
 */
osg.RenderStage = function () {
    osg.RenderBin.call(this);
    this.positionedAttribute = [];
    this.clearDepth = 1.0;
    this.clearColor = [0,0,0,1];
    this.clearMask = osg.Camera.COLOR_BUFFER_BIT | osg.Camera.DEPTH_BUFFER_BIT;
    this.camera = undefined;
    this.viewport = undefined;
    this.preRenderList = [];
    this.postRenderList = [];
    this._renderStage = this;
};
osg.RenderStage.prototype = osg.objectInehrit(osg.RenderBin.prototype, {
    reset: function() { 
        osg.RenderBin.prototype.reset.call(this);
        this.preRenderList.length = 0;
        this.postRenderList.length = 0;
    },
    setClearDepth: function(depth) { this.clearDepth = depth;},
    getClearDepth: function() { return this.clearDepth;},
    setClearColor: function(color) { this.clearColor = color;},
    getClearColor: function() { return this.clearColor;},
    setClearMask: function(mask) { this.clearMask = mask;},
    getClearMask: function() { return this.clearMask;},
    setViewport: function(vp) { this.viewport = vp; },
    getViewport: function() { return this.viewport; },
    setCamera: function(camera) { this.camera = camera; },
    addPreRenderStage: function(rs, order) {
        for (var i = 0, l = this.preRenderList.length; i < l; i++) {
            var render = this.preRenderList[i];
            if (order < render.order) {
                break;
            }
        }
        if (i < this.preRenderList.length) {
            this.preRenderList = this.preRenderList.splice(i,0, { 'order' : order, 'renderStage' : rs });
        } else {
            this.preRenderList.push({ 'order' : order, 'renderStage' : rs });
        }
    },
    addPostRenderStage: function(rs, order) {
        for (var i = 0, l = this.postRenderList.length; i < l; i++) {
            var render = this.postRenderList[i];
            if (order < render.order) {
                break;
            }
        }
        if (i < this.postRenderList.length) {
            this.postRenderList = this.postRenderList.splice(i,0, { 'order' : order, 'renderStage' : rs });
        } else {
            this.postRenderList.push({ 'order' : order, 'renderStage' : rs });
        }
    },

    drawPreRenderStages: function(state, previousRenderLeaf) {
        var previous = previousRenderLeaf;
        for (var i = 0, l = this.preRenderList.length; i < l; ++i) {
            var sg = this.preRenderList[i].renderStage;
            previous = sg.draw(state, previous);
        }
        return previous;
    },

    draw: function(state, previousRenderLeaf) {
        var previous = this.drawPreRenderStages(state, previousRenderLeaf);
        previous = this.drawImplementation(state, previous);

        previous = this.drawPostRenderStages(state, previous);
        return previous;
    },

    sort: function() {
        for (var i = 0, l = this.preRenderList.length; i < l; ++i) {
            this.preRenderList[i].renderStage.sort();
        }

        osg.RenderBin.prototype.sort.call(this);

        for (var j = 0, k = this.postRenderList.length; i < l; ++i) {
            this.postRenderList[i].renderStage.sort();
        }
    },

    drawPostRenderStages: function(state, previousRenderLeaf) {
        var previous = previousRenderLeaf;
        for (var i = 0, l = this.postRenderList.length; i < l; ++i) {
            var sg = this.postRenderList[i].renderStage;
            previous = sg.draw(state, previous);
        }
        return previous;
    },

    applyCamera: function(state) {
        var gl = state.getGraphicContext();
        if (this.camera === undefined) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return;
        }
        var viewport = this.camera.getViewport();
        var fbo = this.camera.frameBufferObject;

        if (!fbo) {
            fbo = new osg.FrameBufferObject();
            this.camera.frameBufferObject = fbo;
        }

        if (fbo.isDirty()) {
            if (this.camera.attachments !== undefined) {
                for ( var key in this.camera.attachments) {
                    var a = this.camera.attachments[key];
                    var attach;
                    if (a.texture === undefined) { //renderbuffer
                        attach = { attachment: key, 
                                   format: a.format, 
                                   width: viewport.width(),
                                   height: viewport.height()
                                 };
                    } else if (a.texture !== undefined) {
                        attach = { 
                            attachment: key, 
                            texture: a.texture, 
                            level: a.level 
                        };
                        if (a.format) {
                            attach.format = a.format;
                        }
                    }
                    fbo.setAttachment(attach);
                }
            }
        }
        fbo.apply(state);
    },

    drawImplementation: function(state, previousRenderLeaf) {
        var error;
        var gl = state.getGraphicContext();

        this.applyCamera(state);

        if (this.viewport === undefined) {
            osg.log("RenderStage does not have a valid viewport");
        }

        state.applyAttribute(this.viewport);

        if (this.clearMask & gl.COLOR_BUFFER_BIT) {
            gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
        }
        if (this.clearMask & gl.DEPTH_BUFFER_BIT) {
            gl.depthMask(true);
            gl.clearDepth(this.clearDepth);
        }
        gl.clear(this.clearMask);

        if (this.positionedAttribute) {
            this.applyPositionedAttribute(state, this.positionedAttribute);
        }

        var previous = osg.RenderBin.prototype.drawImplementation.call(this, state, previousRenderLeaf);

        return previous;
    }
});
osg.ShaderGenerator = function() {
    this.cache = [];
};
osg.ShaderGenerator.prototype = {

    getActiveTypeMember: function(state) {
        // we should check attribute is active or not
        var types = [];
        for (var j = 0, k = state.attributeMap.attributeKeys.length; j < k; j++) {
            var keya = state.attributeMap.attributeKeys[j];
            var attributeStack = state.attributeMap[keya];
            if (attributeStack.length === 0 && attributeStack.globalDefault.applyPositionedUniform === undefined) {
                continue;
            }
            if (attributeStack.globalDefault.getOrCreateUniforms !== undefined || attributeStack.globalDefault.writeToShader !== undefined) {
                types.push(keya);
            }
        }

        for (var i = 0, l = state.textureAttributeMapList.length; i < l; i++) {
            var attributesForUnit = state.textureAttributeMapList[i];
            if (attributesForUnit === undefined) {
                continue;
            }
            for (var h = 0, m = attributesForUnit.attributeKeys.length; h < m; h++) {
                var key = attributesForUnit.attributeKeys[h];
                var textureAttributeStack = attributesForUnit[key];
                if (textureAttributeStack.length === 0) {
                    continue;
                }
                if (textureAttributeStack.globalDefault.getOrCreateUniforms !== undefined || textureAttributeStack.globalDefault.writeToShader !== undefined) {
                    types.push(key+i);
                }
            }
        }
        return types;
    },

    getActiveAttributeMapKeys: function(state) {
        var keys = [];
        for (var j = 0, k = state.attributeMap.attributeKeys.length; j < k; j++) {
            var keya = state.attributeMap.attributeKeys[j];
            var attributeStack = state.attributeMap[keya];
            if (attributeStack.length === 0 && attributeStack.globalDefault.applyPositionedUniform === undefined) {
                continue;
            }
            if (attributeStack.globalDefault.getOrCreateUniforms !== undefined || attributeStack.globalDefault.writeToShader !== undefined) {
                keys.push(keya);
            }
        }
        return keys;
    },

    getActiveTextureAttributeMapKeys: function(state) {
        var textureAttributeKeys = [];
        for (var i = 0, l = state.textureAttributeMapList.length; i < l; i++) {
            var attributesForUnit = state.textureAttributeMapList[i];
            if (attributesForUnit === undefined) {
                continue;
            }
            textureAttributeKeys[i] = [];
            for (var j = 0, m = attributesForUnit.attributeKeys.length; j < m; j++) {
                var key = attributesForUnit.attributeKeys[j];
                var textureAttributeStack = attributesForUnit[key];
                if (textureAttributeStack.length === 0) {
                    continue;
                }
                if (textureAttributeStack.globalDefault.getOrCreateUniforms !== undefined || textureAttributeStack.globalDefault.writeToShader !== undefined) {
                    textureAttributeKeys[i].push(key);
                }
            }
        }
        return textureAttributeKeys;
    },

    // getActiveUniforms
    // return the list of uniforms enabled from the State
    // The idea behind this is to generate a shader depending on attributes/uniforms enabled by the user
    getActiveUniforms: function(state, attributeKeys, textureAttributeKeys) {
        var uniforms = {};

        for (var i = 0, l = attributeKeys.length; i < l; i++) {
            var key = attributeKeys[i];

            if (state.attributeMap[key].globalDefault.getOrCreateUniforms === undefined) {
                continue;
            }
            var attributeUniforms = state.attributeMap[key].globalDefault.getOrCreateUniforms();
            for (var j = 0, m = attributeUniforms.uniformKeys.length; j < m; j++) {
                var name = attributeUniforms.uniformKeys[j];
                var uniform = attributeUniforms[name];
                uniforms[uniform.name] = uniform;
            }
        }

        for (var a = 0, n = textureAttributeKeys.length; a < n; a++) {
            var unitAttributekeys = textureAttributeKeys[a];
            if (unitAttributekeys === undefined) {
                continue;
            }
            for (var b = 0, o = unitAttributekeys.length; b < o; b++) {
                var attrName = unitAttributekeys[b];
                //if (state.textureAttributeMapList[a][attrName].globalDefault === undefined) {
                    //debugger;
                //}
                var textureAttribute = state.textureAttributeMapList[a][attrName].globalDefault;
                if (textureAttribute.getOrCreateUniforms === undefined) {
                    continue;
                }
                var texUniforms = textureAttribute.getOrCreateUniforms(a);
                for (var t = 0, tl = texUniforms.uniformKeys.length; t < tl; t++) {
                    var tname = texUniforms.uniformKeys[t];
                    var tuniform = texUniforms[tname];
                    uniforms[tuniform.name] = tuniform;
                }
            }
        }

        var keys = [];
        for (var ukey in uniforms) {
            keys.push(ukey);
        }
        uniforms.uniformKeys = keys;
        return uniforms;
    },

    getOrCreateProgram: function(state) {

        // first get trace of active attribute and texture attributes to check
        // if we already have generated a program for this configuration
        var flattenKeys = this.getActiveTypeMember(state);
        for (var i = 0, l = this.cache.length; i < l; ++i) {
            if (this.compareAttributeMap(flattenKeys, this.cache[i].flattenKeys) === 0) {
                return this.cache[i];
            }
        }

        // extract valid attributes keys with more details
        var attributeKeys = this.getActiveAttributeMapKeys(state);
        var textureAttributeKeys = this.getActiveTextureAttributeMapKeys(state);


        var vertexshader = this.getOrCreateVertexShader(state, attributeKeys, textureAttributeKeys);
        var fragmentshader = this.getOrCreateFragmentShader(state, attributeKeys, textureAttributeKeys);
        var program = new osg.Program(
            new osg.Shader(gl.VERTEX_SHADER, vertexshader),
            new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

        program.flattenKeys = flattenKeys;
        program.activeAttributeKeys = attributeKeys;
        program.activeTextureAttributeKeys = textureAttributeKeys;
        program.activeUniforms = this.getActiveUniforms(state, attributeKeys, textureAttributeKeys);
        program.generated = true;

        osg.log(program.vertex.text);
        osg.log(program.fragment.text);

        this.cache.push(program);
        return program;
    },

    compareAttributeMap: function(attributeKeys0, attributeKeys1) {
        var key;
        for (var i = 0, l = attributeKeys0.length; i < l; i++) {
            key = attributeKeys0[i];
            if (attributeKeys1.indexOf(key) === -1 ) {
                return 1;
            }
        }
        if (attributeKeys1.length !== attributeKeys0.length) {
            return -1;
        }
        return 0;
    },

    fillTextureShader: function (attributeMapList, validTextureAttributeKeys, mode) {
        var shader = "";
        var commonTypeShader = {};

        for (var i = 0, l = validTextureAttributeKeys.length; i < l; i++) {
            var attributeKeys = validTextureAttributeKeys[i];
            if (attributeKeys === undefined) {
                continue;
            }
            var attributes = attributeMapList[i];
            for (var j = 0, m = attributeKeys.length; j < m; j++) {
                var key = attributeKeys[j];

                var element = attributes[key].globalDefault;

                if (element.generateShaderCommon !== undefined && commonTypeShader[key] === undefined) {
                    shader += element.generateShaderCommon(i, mode);
                    commonTypeShader[key] = true;
                }

                if (element.generateShader) {
                    shader += element.generateShader(i, mode);
                }
            }
        }
        return shader;
    },

    fillShader: function (attributeMap, validAttributeKeys, mode) {
        var shader = "";
        var commonTypeShader = {};

        for (var j = 0, m = validAttributeKeys.length; j < m; j++) {
            var key = validAttributeKeys[j];
            var element = attributeMap[key].globalDefault;
            var type = element.getType();
            if (element.generateShaderCommon !== undefined && commonTypeShader[type] === undefined) {
                shader += element.generateShaderCommon(mode);
                commonTypeShader[type] = true;
            }

            if (element.generateShader) {
                shader += element.generateShader(mode);
            }
        }
        return shader;
    },

    getOrCreateVertexShader: function (state, validAttributeKeys, validTextureAttributeKeys) {
        var i;
        var modes = osg.ShaderGeneratorType;
        var shader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec4 Color;",
            "attribute vec3 Normal;",
            "uniform int ArrayColorEnabled;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform mat4 NormalMatrix;",
            "varying vec4 VertexColor;",
            ""
        ].join('\n');

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.VertexInit);

        var func = [
            "",
            "vec4 ftransform() {",
            "  return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}"].join('\n');

        shader += func;

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.VertexFunction);

        var body = [
            "",
            "void main(void) {",
            "  gl_Position = ftransform();",
            "  if (ArrayColorEnabled == 1)",
            "    VertexColor = Color;",
            "  else",
            "    VertexColor = vec4(1.0,1.0,1.0,1.0);",
            ""
        ].join('\n');

        shader += body;

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.VertexMain);

        shader += [
            "}",
            ""
        ].join('\n');

        return shader;
    },

    _writeShaderFromMode: function(state, validAttributeKeys, validTextureAttributeKeys, mode) {
        var str = "";
        str += this.fillTextureShader(state.textureAttributeMapList, validTextureAttributeKeys, mode);
        str += this.fillShader(state.attributeMap, validAttributeKeys, mode);
        return str;
    },

    getOrCreateFragmentShader: function (state, validAttributeKeys, validTextureAttributeKeys) {
        var i;
        var shader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "varying vec4 VertexColor;",
            "uniform int ArrayColorEnabled;",
            "vec4 fragColor;",
            ""
        ].join("\n");

        var modes = osg.ShaderGeneratorType;
        
        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.FragmentInit);

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.FragmentFunction);

        shader += [
            "void main(void) {",
            "  fragColor = VertexColor;",
            ""
        ].join('\n');

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.FragmentMain);

        shader += this._writeShaderFromMode(state, validAttributeKeys, validTextureAttributeKeys, modes.FragmentEnd);

        shader += [
            "",
            "  gl_FragColor = fragColor;",
            "}"
        ].join('\n');

        return shader;
    }
};
/**
 * Create a Textured Box on the given center with given size
 * @name osg.createTexturedBox
 */
osg.createTexturedBoxGeometry = function(centerx, centery, centerz,
                                         sizex, sizey, sizez) {

    var g = new osg.Geometry();
    var dx,dy,dz;
    dx = sizex/2.0;
    dy = sizey/2.0;
    dz = sizez/2.0;

    var vertexes = [];
    var uv = [];
    var normal = [];

    // -ve y plane
    vertexes[0] = centerx - dx;
    vertexes[1] = centery - dy;
    vertexes[2] = centerz + dz;
    normal[0] = 0;
    normal[1] = -1;
    normal[2] = 0;
    uv[0] = 0;
    uv[1] = 1;

    vertexes[3] = centerx - dx;
    vertexes[4] = centery - dy;
    vertexes[5] = centerz - dz;
    normal[3] = 0;
    normal[4] = -1;
    normal[5] = 0;
    uv[2] = 0;
    uv[3] = 0;

    vertexes[6] = centerx + dx;
    vertexes[7] = centery - dy;
    vertexes[8] = centerz - dz;
    normal[6] = 0;
    normal[7] = -1;
    normal[8] = 0;
    uv[4] = 1;
    uv[5] = 0;

    vertexes[9] =  centerx + dx;
    vertexes[10] = centery - dy;
    vertexes[11] = centerz + dz;
    normal[9] = 0;
    normal[10] = -1;
    normal[11] = 0;
    uv[6] = 1;
    uv[7] = 1;


    // +ve y plane
    vertexes[12] = centerx + dx;
    vertexes[13] = centery + dy;
    vertexes[14] = centerz + dz;
    normal[12] = 0;
    normal[13] = 1;
    normal[14] = 0;
    uv[8] = 0;
    uv[9] = 1;

    vertexes[15] = centerx + dx;
    vertexes[16] = centery + dy;
    vertexes[17] = centerz - dz;
    normal[15] = 0;
    normal[16] = 1;
    normal[17] = 0;
    uv[10] = 0;
    uv[11] = 0;

    vertexes[18] = centerx - dx;
    vertexes[19] = centery + dy;
    vertexes[20] = centerz - dz;
    normal[18] = 0;
    normal[19] = 1;
    normal[20] = 0;
    uv[12] = 1;
    uv[13] = 0;

    vertexes[21] = centerx - dx;
    vertexes[22] = centery + dy;
    vertexes[23] = centerz + dz;
    normal[21] = 0;
    normal[22] = 1;
    normal[23] = 0;
    uv[14] = 1;
    uv[15] = 1;
    

    // +ve x plane
    vertexes[24] = centerx + dx;
    vertexes[25] = centery - dy;
    vertexes[26] = centerz + dz;
    normal[24] = 1;
    normal[25] = 0;
    normal[26] = 0;
    uv[16] = 0;
    uv[17] = 1;

    vertexes[27] = centerx + dx;
    vertexes[28] = centery - dy;
    vertexes[29] = centerz - dz;
    normal[27] = 1;
    normal[28] = 0;
    normal[29] = 0;
    uv[18] = 0;
    uv[19] = 0;

    vertexes[30] = centerx + dx;
    vertexes[31] = centery + dy;
    vertexes[32] = centerz - dz;
    normal[30] = 1;
    normal[31] = 0;
    normal[32] = 0;
    uv[20] = 1;
    uv[21] = 0;

    vertexes[33] = centerx + dx;
    vertexes[34] = centery + dy;
    vertexes[35] = centerz + dz;
    normal[33] = 1;
    normal[34] = 0;
    normal[35] = 0;
    uv[22] = 1;
    uv[23] = 1;

    // -ve x plane
    vertexes[36] = centerx - dx;
    vertexes[37] = centery + dy;
    vertexes[38] = centerz + dz;
    normal[36] = -1;
    normal[37] = 0;
    normal[38] = 0;
    uv[24] = 0;
    uv[25] = 1;

    vertexes[39] = centerx - dx;
    vertexes[40] = centery + dy;
    vertexes[41] = centerz - dz;
    normal[39] = -1;
    normal[40] = 0;
    normal[41] = 0;
    uv[26] = 0;
    uv[27] = 0;

    vertexes[42] = centerx - dx;
    vertexes[43] = centery - dy;
    vertexes[44] = centerz - dz;
    normal[42] = -1;
    normal[43] = 0;
    normal[44] = 0;
    uv[28] = 1;
    uv[29] = 0;

    vertexes[45] = centerx - dx;
    vertexes[46] = centery - dy;
    vertexes[47] = centerz + dz;
    normal[45] = -1;
    normal[46] = 0;
    normal[47] = 0;
    uv[30] = 1;
    uv[31] = 1;

    // top
    // +ve z plane
    vertexes[48] = centerx - dx;
    vertexes[49] = centery + dy;
    vertexes[50] = centerz + dz;
    normal[48] = 0;
    normal[49] = 0;
    normal[50] = 1;
    uv[32] = 0;
    uv[33] = 1;

    vertexes[51] = centerx - dx;
    vertexes[52] = centery - dy;
    vertexes[53] = centerz + dz;
    normal[51] = 0;
    normal[52] = 0;
    normal[53] = 1;
    uv[34] = 0;
    uv[35] = 0;

    vertexes[54] = centerx + dx;
    vertexes[55] = centery - dy;
    vertexes[56] = centerz + dz;
    normal[54] = 0;
    normal[55] = 0;
    normal[56] = 1;
    uv[36] = 1;
    uv[37] = 0;

    vertexes[57] = centerx + dx;
    vertexes[58] = centery + dy;
    vertexes[59] = centerz + dz;
    normal[57] = 0;
    normal[58] = 0;
    normal[59] = 1;
    uv[38] = 1;
    uv[39] = 1;

    // bottom
    // -ve z plane
    vertexes[60] = centerx + dx;
    vertexes[61] = centery + dy;
    vertexes[62] = centerz - dz;
    normal[60] = 0;
    normal[61] = 0;
    normal[62] = -1;
    uv[40] = 0;
    uv[41] = 1;

    vertexes[63] = centerx + dx;
    vertexes[64] = centery - dy;
    vertexes[65] = centerz - dz;
    normal[63] = 0;
    normal[64] = 0;
    normal[65] = -1;
    uv[42] = 0;
    uv[43] = 0;

    vertexes[66] = centerx - dx;
    vertexes[67] = centery - dy;
    vertexes[68] = centerz - dz;
    normal[66] = 0;
    normal[67] = 0;
    normal[68] = -1;
    uv[44] = 1;
    uv[45] = 0;

    vertexes[69] = centerx - dx;
    vertexes[70] = centery + dy;
    vertexes[71] = centerz - dz;
    normal[69] = 0;
    normal[70] = 0;
    normal[71] = -1;
    uv[46] = 1;
    uv[47] = 1;

    var indexes = [];
    indexes[0] = 0;
    indexes[1] = 1;
    indexes[2] = 2;
    indexes[3] = 0;
    indexes[4] = 2;
    indexes[5] = 3;

    indexes[6] = 4;
    indexes[7] = 5;
    indexes[8] = 6;
    indexes[9] = 4;
    indexes[10] = 6;
    indexes[11] = 7;

    indexes[12] = 8;
    indexes[13] = 9;
    indexes[14] = 10;
    indexes[15] = 8;
    indexes[16] = 10;
    indexes[17] = 11;

    indexes[18] = 12;
    indexes[19] = 13;
    indexes[20] = 14;
    indexes[21] = 12;
    indexes[22] = 14;
    indexes[23] = 15;

    indexes[24] = 16;
    indexes[25] = 17;
    indexes[26] = 18;
    indexes[27] = 16;
    indexes[28] = 18;
    indexes[29] = 19;

    indexes[30] = 20;
    indexes[31] = 21;
    indexes[32] = 22;
    indexes[33] = 20;
    indexes[34] = 22;
    indexes[35] = 23;

    g.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, vertexes, 3 );
    g.getAttributes().Normal = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, normal, 3 );
    g.getAttributes().TexCoord0 = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, uv, 2 );
    
    var primitive = new osg.DrawElements(osg.PrimitiveSet.TRIANGLES, new osg.BufferArray(osg.BufferArray.ELEMENT_ARRAY_BUFFER, indexes, 1 ));
    g.getPrimitives().push(primitive);
    return g;
};


osg.createTexturedQuadGeometry = function(cornerx, cornery, cornerz,
                                          wx, wy, wz,
                                          hx, hy, hz,
                                          l,b,r,t) {

    if (r === undefined && t === undefined) {
        r = l;
        t = b;
        l = 0;
        b = 0;
    }

    var g = new osg.Geometry();

    var vertexes = [];
    vertexes[0] = cornerx + hx;
    vertexes[1] = cornery + hy;
    vertexes[2] = cornerz + hz;

    vertexes[3] = cornerx;
    vertexes[4] = cornery;
    vertexes[5] = cornerz;

    vertexes[6] = cornerx + wx;
    vertexes[7] = cornery + wy;
    vertexes[8] = cornerz + wz;

    vertexes[9] =  cornerx + wx + hx;
    vertexes[10] = cornery + wy + hy;
    vertexes[11] = cornerz + wz + hz;

    if (r === undefined) {
        r = 1.0;
    }
    if (t === undefined) {
        t = 1.0;
    }

    var uvs = [];
    uvs[0] = l;
    uvs[1] = t;

    uvs[2] = l;
    uvs[3] = b;

    uvs[4] = r;
    uvs[5] = b;

    uvs[6] = r;
    uvs[7] = t;

    var n = osg.Vec3.cross([wx,wy,wz], [hx, hy, hz], []);
    var normal = [];
    normal[0] = n[0];
    normal[1] = n[1];
    normal[2] = n[2];

    normal[3] = n[0];
    normal[4] = n[1];
    normal[5] = n[2];

    normal[6] = n[0];
    normal[7] = n[1];
    normal[8] = n[2];

    normal[9] = n[0];
    normal[10] = n[1];
    normal[11] = n[2];


    var indexes = [];
    indexes[0] = 0;
    indexes[1] = 1;
    indexes[2] = 2;
    indexes[3] = 0;
    indexes[4] = 2;
    indexes[5] = 3;

    g.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, vertexes, 3 );
    g.getAttributes().Normal = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, normal, 3 );
    g.getAttributes().TexCoord0 = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, uvs, 2 );
    
    var primitive = new osg.DrawElements(osg.PrimitiveSet.TRIANGLES, new osg.BufferArray(osg.BufferArray.ELEMENT_ARRAY_BUFFER, indexes, 1 ));
    g.getPrimitives().push(primitive);
    return g;
};

osg.createTexturedBox = function(centerx, centery, centerz,
                                 sizex, sizey, sizez) {
    osg.log("osg.createTexturedBox is deprecated use instead osg.createTexturedBoxGeometry");
    return osg.createTexturedBoxGeometry(centerx, centery, centerz,
                                         sizex, sizey, sizez);
};

osg.createTexturedQuad = function(cornerx, cornery, cornerz,
                                  wx, wy, wz,
                                  hx, hy, hz,
                                  l,b,r,t) {
    osg.log("osg.createTexturedQuad is deprecated use instead osg.createTexturedQuadGeometry");
    return osg.createTexturedQuadGeometry(cornerx, cornery, cornerz,
                                          wx, wy, wz,
                                          hx, hy, hz,
                                          l,b,r,t);
};

osg.createAxisGeometry = function(size) {
    if (size === undefined) {
        size = 5.0;
    }
    if (osg.createAxisGeometry.getShader === undefined) {
        osg.createAxisGeometry.getShader = function() {
            if (osg.createAxisGeometry.getShader.program === undefined) {
                var vertexshader = [
                    "#ifdef GL_ES",
                    "precision highp float;",
                    "#endif",
                    "attribute vec3 Vertex;",
                    "attribute vec4 Color;",
                    "uniform mat4 ModelViewMatrix;",
                    "uniform mat4 ProjectionMatrix;",
                    "",
                    "varying vec4 FragColor;",
                    "",
                    "vec4 ftransform() {",
                    "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
                    "}",
                    "",
                    "void main(void) {",
                    "gl_Position = ftransform();",
                    "FragColor = Color;",
                    "}"
                ].join('\n');

                var fragmentshader = [
                    "#ifdef GL_ES",
                    "precision highp float;",
                    "#endif",
                    "varying vec4 FragColor;",

                    "void main(void) {",
                    "gl_FragColor = FragColor;",
                    "}"
                ].join('\n');

                var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                              new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
                osg.createAxisGeometry.getShader.program = program;
            }
            return osg.createAxisGeometry.getShader.program;
        };
    }

    var g = new osg.Geometry();

    var vertexes = [];
    vertexes.push(0,0,0);
    vertexes.push(size,0,0);

    vertexes.push(0,0,0);
    vertexes.push(0,size,0);

    vertexes.push(0,0,0);
    vertexes.push(0,0,size);

    var colors = [];
    colors.push(1, 0, 0, 1.0);
    colors.push(1, 0, 0, 1.0);

    colors.push(0, 1, 0, 1.0);
    colors.push(0, 1, 0, 1.0);

    colors.push(0, 0, 1, 1.0);
    colors.push(0, 0, 1, 1.0);

    g.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, vertexes, 3 );
    g.getAttributes().Color = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, colors, 4 );

    var primitive = new osg.DrawArrays(osg.PrimitiveSet.LINES, 0, 6);
    g.getPrimitives().push(primitive);
    g.getOrCreateStateSet().setAttributeAndMode(osg.createAxisGeometry.getShader());

    return g;
};
osg.Stack = function() {
};
osg.Stack.create = function()
{
    var a = [];
    a.globalDefault = undefined;
    a.lastApplied = undefined;
    a.back = function () {
        return this[this.length -1];
    };
    return a;
};
osg.StateGraph = function () {
    this.depth = 0;
    this.children = {};
    this.children.keys = [];
    this.leafs = [];
    this.stateset = undefined;
    this.parent = undefined;
};

osg.StateGraph.prototype = {
    clean: function() {
        this.leafs.splice(0, this.leafs.length);
        this.stateset = undefined;
        this.parent = undefined;
        //this.depth = 0;
        var keys = this.children.keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            this.children[key].clean();
        }
        this.children = {};
        keys.splice(0, keys.length);
        this.children.keys = keys;
    },
    getStateSet: function() { return this.stateset; },
    findOrInsert: function (stateset)
    {
        var sg;
        if (!this.children[stateset.id]) {
            sg = new osg.StateGraph();
            sg.parent = this;
            sg.depth = this.depth + 1;
            sg.stateset = stateset;
            this.children[stateset.id] = sg;
            this.children.keys.push(stateset.id);
        } else {
            sg = this.children[stateset.id];
        }
        return sg;
    },
    moveToRootStateGraph: function(state, sg_current)
    {
        // need to pop back all statesets and matrices.
        while (sg_current)
        {
            if (sg_current.stateSet) {
                state.popStateSet();
            }
            sg_current = sg_current._parent;
        }
    },
    moveStateGraph: function(state, sg_current, sg_new)
    {
        var stack;
        var i;
        if (sg_new === sg_current || sg_new === undefined) {
            return;
        }

        if (sg_current === undefined) {
            stack = [];
            // push stateset from sg_new to root, and apply
            // stateset from root to sg_new
            do {
                if (sg_new.stateset !== undefined) {
                    stack.push(sg_new.stateset);
                }
                sg_new = sg_new.parent;
            } while (sg_new);

            stack.reverse();
            for (i = 0, l = stack.length; i < l; ++i) {
                state.pushStateSet(stack[i]);
            }
            return;
        } else if (sg_current.parent === sg_new.parent) {
            // first handle the typical case which is two state groups
            // are neighbours.

            // state has changed so need to pop old state.
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            // and push new state.
            if (sg_new.stateset !== undefined) {
                state.pushStateSet(sg_new.stateset);
            }
            return;
        }

        // need to pop back up to the same depth as the new state group.
        while (sg_current.depth > sg_new.depth)
        {
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            sg_current = sg_current.parent;
        }

        // use return path to trace back steps to sg_new.
        stack = [];

        // need to pop back up to the same depth as the curr state group.
        while (sg_new.depth > sg_current.depth)
        {
            if (sg_new.stateset !== undefined) {
                stack.push(sg_new.stateset);
            }
            sg_new = sg_new.parent;
        }

        // now pop back up both parent paths until they agree.

        // DRT - 10/22/02
        // should be this to conform with above case where two StateGraph
        // nodes have the same parent
        while (sg_current !== sg_new)
        {
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            sg_current = sg_current.parent;

            if (sg_new.stateset !== undefined) {
                stack.push(sg_new.stateset);
            }
            sg_new = sg_new.parent;
        }

        stack.reverse();
        stackLength = stack.length;
        for( i = 0; i < stackLength; ++i) {
            state.pushStateSet(stack[i]);
        }
    }
};
osg.State = function () {
    this._graphicContext = undefined;

    this.currentVBO = null;
    this.vertexAttribList = [];
    this.programs = osg.Stack.create();
    this.stateSets = osg.Stack.create();
    this.uniforms = {};
    this.uniforms.uniformKeys = [];
    
    this.textureAttributeMapList = [];

    this.attributeMap = {};
    this.attributeMap.attributeKeys = [];

    this.modeMap = {};

    this.shaderGenerator = new osg.ShaderGenerator();

    this.modelViewMatrix = osg.Uniform.createMatrix4(osg.Matrix.makeIdentity([]), "ModelViewMatrix");
    this.projectionMatrix = osg.Uniform.createMatrix4(osg.Matrix.makeIdentity([]), "ProjectionMatrix");
    this.normalMatrix = osg.Uniform.createMatrix4(osg.Matrix.makeIdentity([]), "NormalMatrix");

    this.uniformArrayState = {};
    this.uniformArrayState.uniformKeys = [];
    this.uniformArrayState.Color = osg.Uniform.createInt1(0, "ArrayColorEnabled");
    this.uniformArrayState.uniformKeys.push("Color");

    this.vertexAttribMap = {};
    this.vertexAttribMap._disable = [];
    this.vertexAttribMap._keys = [];
};

osg.State.prototype = {

    setGraphicContext: function(graphicContext) { this._graphicContext = graphicContext; },
    getGraphicContext: function() { return this._graphicContext;},

    pushStateSet: function(stateset) {
        this.stateSets.push(stateset);

        if (stateset.attributeMap) {
            this.pushAttributeMap(this.attributeMap, stateset.attributeMap);
        }
        if (stateset.textureAttributeMapList) {
            var list = stateset.textureAttributeMapList;
            for (var textureUnit = 0, l = list.length; textureUnit < l; textureUnit++)
            {
                if (list[textureUnit] === undefined) {
                    continue;
                }
                if (!this.textureAttributeMapList[textureUnit]) {
                    this.textureAttributeMapList[textureUnit] = {};
                    this.textureAttributeMapList[textureUnit].attributeKeys = [];
                }
                this.pushAttributeMap(this.textureAttributeMapList[textureUnit], list[textureUnit]);
            }
        }

        if (stateset.uniforms) {
            this.pushUniformsList(this.uniforms, stateset.uniforms);
        }
    },

    applyStateSet: function(stateset) {
        this.pushStateSet(stateset);
        this.apply();
        this.popStateSet();
    },

    popAllStateSets: function() {
        while (this.stateSets.length) {
            this.popStateSet();
        }
    },
    popStateSet: function() {
        var stateset = this.stateSets.pop();
        if (stateset.program) {
            this.programs.pop();
        }
        if (stateset.attributeMap) {
            this.popAttributeMap(this.attributeMap, stateset.attributeMap);
        }
        if (stateset.textureAttributeMapList) {
            var list = stateset.textureAttributeMapList;
            for (var textureUnit = 0, l = list.length; textureUnit < l; textureUnit++)
            {
                if (list[textureUnit] === undefined) {
                    continue;
                }
                this.popAttributeMap(this.textureAttributeMapList[textureUnit], list[textureUnit]);
            }
        }

        if (stateset.uniforms) {
            this.popUniformsList(this.uniforms, stateset.uniforms);
        }
    },

    haveAppliedAttribute: function(attribute) {
        var key = attribute.getTypeMember();
        var attributeStack = this.attributeMap[key];
        attributeStack.lastApplied = attribute;
        attributeStack.asChanged = true;
    },

    applyAttribute: function(attribute) {
        var key = attribute.getTypeMember();
        var attributeStack = this.attributeMap[key];
        if (attributeStack === undefined) {
            attributeStack = osg.Stack.create();
            this.attributeMap[key] = attributeStack;
            this.attributeMap[key].globalDefault = attribute.cloneType();
            this.attributeMap.attributeKeys.push(key);
        }

        if (attributeStack.lastApplied !== attribute) {
//        if (attributeStack.lastApplied !== attribute || attribute.isDirty()) {
            if (attribute.apply) {
                attribute.apply(this);
            }
            attributeStack.lastApplied = attribute;
            attributeStack.asChanged = true;
        }
    },
    applyTextureAttribute: function(unit, attribute) {
        var gl = this.getGraphicContext();
        gl.activeTexture(gl.TEXTURE0 + unit);
        var key = attribute.getTypeMember();

        if (!this.textureAttributeMapList[unit]) {
            this.textureAttributeMapList[unit] = {};
            this.textureAttributeMapList[unit].attributeKeys = [];
        }

        var attributeStack = this.textureAttributeMapList[unit][key];
        if (attributeStack === undefined) {
            attributeStack = osg.Stack.create();
            this.textureAttributeMapList[unit][key] = attributeStack;
            attributeStack.globalDefault = attribute.cloneType();
            this.textureAttributeMapList[unit].attributeKeys.push(key);
        }

        if (attributeStack.lastApplied !== attribute) {
        //if (attributeStack.lastApplied !== attribute || attribute.isDirty()) {
            if (attribute.apply) {
                attribute.apply(this);
            }
            attributeStack.lastApplied = attribute;
            attributeStack.asChanged = true;
        }
    },

    getLastProgramApplied: function() {
        return this.programs.lastApplied;
    },

    pushGeneratedProgram: function() {
        var program;
        if (this.attributeMap.Program !== undefined && this.attributeMap.Program.length !== 0) {
            program = this.attributeMap.Program.back().object;
            value = this.attributeMap.Program.back().value;
            if (program !== undefined && value !== osg.StateAttribute.OFF) {
                this.programs.push(this.getObjectPair(program, value));
                return program;
            }
        }

        var attributes = {
            'textureAttributeMapList': this.textureAttributeMapList,
            'attributeMap': this.attributeMap
        };

        var generator = this.stateSets.back().getShaderGenerator();
        if (generator === undefined) {
            generator = this.shaderGenerator;
        }
        program = generator.getOrCreateProgram(attributes);
        this.programs.push(this.getObjectPair(program, osg.StateAttribute.ON));
        return program;
    },

    popGeneratedProgram: function() {
        this.programs.pop();
    },

    applyWithoutProgram: function() {
        this.applyAttributeMap(this.attributeMap);
        this.applyTextureAttributeMapList(this.textureAttributeMapList);
    },

    apply: function() {
        var gl = this._graphicContext;



        this.applyAttributeMap(this.attributeMap);
        this.applyTextureAttributeMapList(this.textureAttributeMapList);

        this.pushGeneratedProgram();
        var program = this.programs.back().object;
        if (this.programs.lastApplied !== program) {
            program.apply(this);
            this.programs.lastApplied = program;
        }

	var programUniforms;
	var activeUniforms;
        var i;
        var key;
        var self = this;
        if (program.generated === true) {
            // note that about TextureAttribute that need uniform on unit we would need to improve
            // the current uniformList ...

            programUniforms = program.uniformsCache;
            activeUniforms = program.activeUniforms;
            if (false) {
                var regenrateKeys = false;
                for (i = 0 , l = activeUniforms.uniformKeys.length; i < l; i++) {
                    var name = activeUniforms.uniformKeys[i];
                    var location = programUniforms[name];
                    if (location !== undefined) {
                        activeUniforms[name].apply(location);
                    } else {
                        regenrateKeys = true;
                        delete activeUniforms[name];
                    }
                }
                if (regenrateKeys) {
                    var keys = [];
                    for (key in activeUniforms) {
                        if (key !== "uniformKeys") {
                            keys.push(key);
                        }
                    }
                    activeUniforms.uniformKeys = keys;
                }
            } else {
                var uniformMap = this.uniforms;
                (function() {
                    
                    var programUniforms = program.uniformsCache;
                    var activeUniforms = program.activeUniforms;
                    var foreignUniforms = program.foreignUniforms;

                    // when we apply the shader for the first time, we want to compute the active uniforms for this shader and the list of uniforms not extracted from attributes called foreignUniforms

                    // typically the following code will be executed once on the first execution of generated program
                    if (!foreignUniforms) {

                        (function() {

                            foreignUniforms = [];
                            for (var i = 0 , l = programUniforms.uniformKeys.length; i < l; i++) {
                                var name = programUniforms.uniformKeys[i];
                                var location = programUniforms[name];
                                if (location !== undefined && activeUniforms[name] === undefined) {
                                    // filter 'standard' uniform matrix that will be applied for all shader
                                    if (name !== self.modelViewMatrix.name &&
                                        name !== self.projectionMatrix.name &&
                                        name !== self.normalMatrix.name) {
                                        foreignUniforms.push(name);
                                    }
                                }
                            }
                            program.foreignUniforms = foreignUniforms;

                        })();


                        // remove uniforms listed by attributes (getActiveUniforms) but not required by the program
                        (function() {
                            var regenrateKeys = false;
                            for (var i = 0 , l = activeUniforms.uniformKeys.length; i < l; i++) {
                                var name = activeUniforms.uniformKeys[i];
                                var location = programUniforms[name];
                                if (location === undefined || location === null) {
                                    delete activeUniforms[name];
                                }
                            }
                            // regenerate uniforms keys
                            var keys = Object.keys(activeUniforms);
                            for (var j = 0, m = keys.length; j < m; j++) {
                                if ( keys[j] === "uniformKeys") {
                                    keys.splice(j, 1);
                                    break;
                                }
                            }
                            activeUniforms.uniformKeys = keys;
                        })();
                    }

                    
                    // apply active uniforms
                    // caching uniforms from attribtues make it impossible to overwrite uniform with a custom uniform instance not used in the attributes
                    (function() {
                        for (var i = 0 , l = activeUniforms.uniformKeys.length; i < l; i++) {
                            var name = activeUniforms.uniformKeys[i];
                            var location = programUniforms[name];
                            activeUniforms[name].apply(location);
                        }
                    })();


                    // apply now foreign uniforms, it's uniforms needed by the program but not contains in attributes used to generate this program
                    (function() {
                        for (var i = 0 , l = foreignUniforms.length; i < l; i++) {
                            var name = foreignUniforms[i];
                            var uniformStack = uniformMap[name];
                            var location = programUniforms[name];
                            var uniform;
                            if (uniformStack !== undefined) {
                                if (uniformStack.length === 0) {
                                    uniform = uniformStack.globalDefault;
                                } else {
                                    uniform = uniformStack.back().object;
                                }
                                uniform.apply(location);
                            }
                        }
                    })();

                })();
            }
        } else {
            
            //this.applyUniformList(this.uniforms, {});

            // custom program so we will iterate on uniform from the program and apply them
            // but in order to be able to use Attribute in the state graph we will check if
            // our program want them. It must be defined by the user
            var programObject = program.program;
            var location1;
            var uniformStack;
            var uniform;

            programUniforms = program.uniformsCache;
            var uniformMap = this.uniforms;

            // first time we see attributes key, so we will keep a list of uniforms from attributes
            activeUniforms = [];
            var trackAttributes = program.trackAttributes;
            var trackUniforms = program.trackUniforms;
            var attribute;
            var uniforms;
            var a;
            // loop on wanted attributes and texture attribute to track state graph uniforms from those attributes
            if (trackAttributes !== undefined && trackUniforms === undefined) {
                var attributeKeys = program.trackAttributes.attributeKeys;
                if (attributeKeys !== undefined) {
                    for ( i = 0, l = attributeKeys.length; i < l; i++) {
                        key = attributeKeys[i];
                        attributeStack = this.attributeMap[key];
                        if (attributeStack === undefined) {
                            continue;
                        }
                        // we just need the uniform list and not the attribute itself
                        attribute = attributeStack.globalDefault;
                        if (attribute.getOrCreateUniforms === undefined) {
                            continue;
                        }
                        uniforms = attribute.getOrCreateUniforms();
                        for (a = 0, b = uniforms.uniformKeys.length; a < b; a++) {
                            activeUniforms.push(uniforms[uniforms.uniformKeys[a] ]);
                        }
                    }
                }

                var textureAttributeKeysList = program.trackAttributes.textureAttributeKeys;
                if (textureAttributeKeysList !== undefined) {
                    for (i = 0, l = textureAttributeKeysList.length; i < l; i++) {
                        var tak = textureAttributeKeysList[i];
                        if (tak === undefined) {
                            continue;
                        }
                        for (var j = 0, m = tak.length; j < m; j++) {
                            key = tak[j];
                            var attributeList = this.textureAttributeMapList[i];
                            if (attributeList === undefined) {
                                continue;
                            }
                            attributeStack = attributeList[key];
                            if (attributeStack === undefined) {
                                continue;
                            }
                            attribute = attributeStack.globalDefault;
                            if (attribute.getOrCreateUniforms === undefined) {
                                continue;
                            }
                            uniforms = attribute.getOrCreateUniforms(i);
                            for (a = 0, b = uniforms.uniformKeys.length; a < b; a++) {
                                activeUniforms.push(uniforms[uniforms.uniformKeys[a] ]);
                            }
                        }
                    }
                }
                // now we have a list on uniforms we want to track but we will filter them to use only what is needed by our program
                // not that if you create a uniforms whith the same name of a tracked attribute, and it will override it
                var uniformsFinal = {};
                for (i = 0, l = activeUniforms.length; i < l; i++) {
                    var u = activeUniforms[i];
                    var loc = gl.getUniformLocation(programObject, u.name);
                    if (loc !== undefined && loc !== null) {
                        uniformsFinal[u.name] = activeUniforms[i];
                    }
                }
                program.trackUniforms = uniformsFinal;
            }

            for (i = 0, l = programUniforms.uniformKeys.length; i < l; i++) {
                var uniformKey = programUniforms.uniformKeys[i];
                location1 = programUniforms[uniformKey];

                uniformStack = uniformMap[uniformKey];
                if (uniformStack === undefined) {
                    if (program.trackUniforms !== undefined) {
                        uniform = program.trackUniforms[uniformKey];
                        if (uniform !== undefined) {
                            uniform.apply(location1);
                        }
                    }
                } else {
                    if (uniformStack.length === 0) {
                        uniform = uniformStack.globalDefault;
                    } else {
                        uniform = uniformStack.back().object;
                    }
                    uniform.apply(location1);
                }
            }
        }
    },

    applyUniformList: function(uniformMap, uniformList) {

        var program = this.getLastProgramApplied();
        var programObject = program.program;
        var location;
        var uniformStack;
        var uniform;
        var uniformKeys = {};
        var key;

        var programUniforms = program.uniformsCache;

        for (var i = 0, l = programUniforms.uniformKeys.length; i < l; i++) {
            var uniformKey = programUniforms.uniformKeys[i];
            location = programUniforms[uniformKey];

            // get the one in the list
            uniform = uniformList[uniformKey];

            // not found ? check on the stack
            if (uniform === undefined) {
                uniformStack = uniformMap[uniformKey];
                if (uniformStack === undefined) {
                    continue;
                }
                if (uniformStack.length === 0) {
                    uniform = uniformStack.globalDefault;
                } else {
                    uniform = uniformStack.back().object;
                }
            }
            uniform.apply(location);
        }
    },

    applyAttributeMap: function(attributeMap) {
        var attributeStack;
        
        for (var i = 0, l = attributeMap.attributeKeys.length; i < l; i++) {
            var key = attributeMap.attributeKeys[i];

            attributeStack = attributeMap[key];
            if (attributeStack === undefined) {
                continue;
            }
            var attribute;
            if (attributeStack.length === 0) {
                attribute = attributeStack.globalDefault;
            } else {
                attribute = attributeStack.back().object;
            }

            if (attributeStack.asChanged) {
//            if (attributeStack.lastApplied !== attribute || attribute.isDirty()) {
                if (attributeStack.lastApplied !== attribute) {
                    if (attribute.apply) {
                        attribute.apply(this);
                    }
                    attributeStack.lastApplied = attribute;
                }
                attributeStack.asChanged = false;
            }
        }
    },

    getObjectPair: function(uniform, value) {
        return { object: uniform, value: value};
    },
    pushUniformsList: function(uniformMap, uniformList) {
        var name;
        var uniform;
        for ( var i = 0, l = uniformList.uniformKeys.length; i < l; i++) {
            var key = uniformList.uniformKeys[i];
            uniformPair = uniformList[key];
            uniform = uniformPair.getUniform();
            name = uniform.name;
            if (uniformMap[name] === undefined) {
                uniformMap[name] = osg.Stack.create();
                uniformMap[name].globalDefault = uniform;
                uniformMap.uniformKeys.push(name);
            }
            var value = uniformPair.getValue();
            var stack = uniformMap[name];
            if (stack.length === 0) {
                stack.push(this.getObjectPair(uniform, value));
            } else if ((stack[stack.length-1].value & osg.StateAttribute.OVERRIDE) && !(value & osg.StateAttribute.PROTECTED) ) {
                stack.push(stack[stack.length-1]);
            } else {
                stack.push(this.getObjectPair(uniform, value));
            }
        }
    },
    popUniformsList: function(uniformMap, uniformList) {
        var uniform;
        for (var i = 0, l = uniformList.uniformKeys.length; i < l; i++) {
            var key = uniformList.uniformKeys[i];
            uniformMap[key].pop();
        }
    },

    applyTextureAttributeMapList: function(textureAttributesMapList) {
        var gl = this._graphicContext;
        var textureAttributeMap;

        for (var textureUnit = 0, l = textureAttributesMapList.length; textureUnit < l; textureUnit++) {
            textureAttributeMap = textureAttributesMapList[textureUnit];
            if (textureAttributeMap === undefined) {
                continue;
            }

            for (var i = 0, lt = textureAttributeMap.attributeKeys.length; i < lt; i++) {
                var key = textureAttributeMap.attributeKeys[i];

                var attributeStack = textureAttributeMap[key];
                if (attributeStack === undefined) {
                    continue;
                }

                var attribute;
                if (attributeStack.length === 0) {
                    attribute = attributeStack.globalDefault;
                } else {
                    attribute = attributeStack.back().object;
                }
                if (attributeStack.asChanged) {
//                if (attributeStack.lastApplied !== attribute || attribute.isDirty()) {
                    gl.activeTexture(gl.TEXTURE0 + textureUnit);
                    attribute.apply(this, textureUnit);
                    attributeStack.lastApplied = attribute;
                    attributeStack.asChanged = false;
                }
            }
        }
    },
    setGlobalDefaultValue: function(attribute) {
        var key = attribute.getTypeMember();
        if (this.attributeMap[key]) {
            this.attributeMap[key].globalDefault = attribute;
        } else {
            this.attributeMap[key] = osg.Stack.create();
            this.attributeMap[key].globalDefault = attribute;

            this.attributeMap.attributeKeys.push(key);
        }
    },

    pushAttributeMap: function(attributeMap,  attributeList) {
        var attributeStack;
        for (var i = 0, l = attributeList.attributeKeys.length; i < l; i++ ) {
            var type = attributeList.attributeKeys[i];
            var attributePair = attributeList[type];
            var attribute = attributePair.getAttribute();
            if (attributeMap[type] === undefined) {
                attributeMap[type] = osg.Stack.create();
                attributeMap[type].globalDefault = attribute.cloneType();

                attributeMap.attributeKeys.push(type);
            }

            var value = attributePair.getValue();
            attributeStack = attributeMap[type];
            if (attributeStack.length === 0) {
                attributeStack.push(this.getObjectPair(attribute, value));
            } else if ( (attributeStack[attributeStack.length-1].value & osg.StateAttribute.OVERRIDE) && !(value & osg.StateAttribute.PROTECTED)) {
                attributeStack.push(attributeStack[attributeStack.length-1]);
            } else {
                attributeStack.push(this.getObjectPair(attribute, value));
            }

            attributeStack.asChanged = true;
        }
    },
    popAttributeMap: function(attributeMap,  attributeList) {
        var attributeStack;
        for (var i = 0, l = attributeList.attributeKeys.length; i < l; i++) {
            type = attributeList.attributeKeys[i];
            attributeStack = attributeMap[type];
            attributeStack.pop();
            attributeStack.asChanged = true;
        }
    },

    setIndexArray: function(array) {
        var gl = this._graphicContext;
        if (this.currentIndexVBO !== array) {
            array.bind(gl);
            this.currentIndexVBO = array;
        }
        if (array.isDirty()) {
            array.compile(gl);
        }
    },

    lazyDisablingOfVertexAttributes: function() {
        var keys = this.vertexAttribMap._keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            var attr = keys[i];
            if (this.vertexAttribMap[attr]) {
                this.vertexAttribMap._disable[attr] = true;
            }
        }
    },

    applyDisablingOfVertexAttributes: function() {
        var keys = this.vertexAttribMap._keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            if (this.vertexAttribMap._disable[keys[i] ] === true) {
                var attr = keys[i];
                this._graphicContext.disableVertexAttribArray(attr);
                this.vertexAttribMap._disable[attr] = false;
                this.vertexAttribMap[attr] = false;
            }
        }

        // it takes 4.26% of global cpu
        // there would be a way to cache it and track state if the program has not changed ...
        var colorAttrib;
        var program = this.programs.lastApplied;
        if (program !== undefined && program.generated === true) {
            var updateColorUniform = false;
            if (this.previousAppliedProgram !== this.programs.lastApplied) {
                updateColorUniform = true;
                this.previousAppliedProgram = this.programs.lastApplied;
            } else {
                colorAttrib = program.attributesCache.Color;
                if ( this.vertexAttribMap[colorAttrib] !== this.previousColorAttrib) {
                    updateColorUniform = true;
                }
            }

            if (updateColorUniform) {
                colorAttrib = program.attributesCache.Color;
                if (colorAttrib !== undefined) {
                    if (this.vertexAttribMap[colorAttrib]) {
                        this.uniformArrayState.Color.set([1]);
                    } else {
                        this.uniformArrayState.Color.set([0]);
                    }
                    this.previousColorAttrib = this.vertexAttribMap[colorAttrib];
                    this.uniformArrayState.Color.apply(program.uniformsCache.ArrayColorEnabled);
                }
            }
        }
    },
    setVertexAttribArray: function(attrib, array, normalize) {
        var vertexAttribMap = this.vertexAttribMap;
        vertexAttribMap._disable[ attrib ] = false;
        var gl = this._graphicContext;
        var binded = false;
        if (array.isDirty()) {
            array.bind(gl);
            array.compile(gl);
            binded = true;
        }

        if (vertexAttribMap[attrib] !== array) {

            if (!binded) {
                array.bind(gl);
            }

            if (! vertexAttribMap[attrib]) {
                gl.enableVertexAttribArray(attrib);
                
                if ( vertexAttribMap[attrib] === undefined) {
                    vertexAttribMap._keys.push(attrib);
                }
            }

            vertexAttribMap[attrib] = array;
            gl.vertexAttribPointer(attrib, array._itemSize, gl.FLOAT, normalize, 0, 0);
        }
    }

};
/** 
 * StateSet encapsulate StateAttribute
 * @class StateSet
 */
osg.StateSet = function () {
    osg.Object.call(this);
    this.id = osg.StateSet.instance++;
    this.attributeMap = {};
    this.attributeMap.attributeKeys = [];

    this.textureAttributeMapList = [];

    this._binName = undefined;
    this._binNumber = 0;

    this._shaderGenerator = undefined;
};
osg.StateSet.instance = 0;

osg.StateSet.AttributePair = function(attr, value) {
    this._object = attr;
    this._value = value;
};
osg.StateSet.AttributePair.prototype = {
    getAttribute: function() { return this._object; },
    getUniform: function() { return this._object; },
    getValue: function() { return this._value; }
};

/** @lends osg.StateSet.prototype */
osg.StateSet.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Object.prototype, {
    getAttributePair: function(attribute, value) {
        return new osg.StateSet.AttributePair(attribute, value);
    },
    addUniform: function (uniform, mode) {
        if (mode === undefined) {
            mode = osg.StateAttribute.ON;
        }
        if (!this.uniforms) {
            this.uniforms = {};
            this.uniforms.uniformKeys = [];
        }
        var name = uniform.name;
        this.uniforms[name] = this.getAttributePair(uniform, mode);
        if (this.uniforms.uniformKeys.indexOf(name) === -1) {
            this.uniforms.uniformKeys.push(name);
        }
    },
    getUniform: function (uniform) {
        if (this.uniforms && this.uniforms[uniform]) {
            return this.uniforms[uniform].getAttribute();
        }
        return undefined;
    },
    getUniformList: function () { return this.uniforms; },

    setTextureAttributeAndMode: function (unit, attribute, mode) {
        if (mode === undefined) {
            mode = osg.StateAttribute.ON;
        }
        this._setTextureAttribute(unit, this.getAttributePair(attribute, mode) );
    },
    getNumTextureAttributeLists: function() {
        return this.textureAttributeMapList.length;
    },
    getTextureAttribute: function(unit, attribute) {
        if (this.textureAttributeMapList[unit] === undefined || this.textureAttributeMapList[unit][attribute] === undefined) {
            return undefined;
        }
        return this.textureAttributeMapList[unit][attribute].getAttribute();
    },

    removeTextureAttribute: function(unit, attributeName) {
        if (this.textureAttributeMapList[unit] === undefined || this.textureAttributeMapList[unit][attributeName] === undefined) {
            return;
        }

        delete this.textureAttributeMapList[unit][attributeName];
        var idx = this.textureAttributeMapList[unit].attributeKeys.indexOf(attributeName);
        this.textureAttributeMapList[unit].attributeKeys.splice(idx,1);
    },

    getAttribute: function(attributeType) { 
        if (this.attributeMap[attributeType] === undefined) {
            return undefined;
        }
        return this.attributeMap[attributeType].getAttribute();
    },
    setAttributeAndMode: function(attribute, mode) { 
        if (mode === undefined) {
            mode = osg.StateAttribute.ON;
        }
        this._setAttribute(this.getAttributePair(attribute, mode)); 
    },
    setAttribute: function(attribute, mode) { 
        if (mode === undefined) {
            mode = osg.StateAttribute.ON;
        }
        this._setAttribute(this.getAttributePair(attribute, mode)); 
    },

    removeAttribute: function(attributeName) {
        if (this.attributeMap[attributeName] !== undefined) {
            delete this.attributeMap[attributeName];
            var idx = this.attributeMap.attributeKeys.indexOf(attributeName);
            this.attributeMap.attributeKeys.splice(idx,1);
        }
    },

    setRenderingHint: function(hint) {
        if (hint === 'OPAQUE_BIN') {
            this.setRenderBinDetails(0,"RenderBin");
        } else if (hint === 'TRANSPARENT_BIN') {
            this.setRenderBinDetails(10,"DepthSortedBin");
        } else {
            this.setRenderBinDetails(0,"");
        }
    },

    setRenderBinDetails: function(num, binName) {
        this._binNumber = num;
        this._binName = binName;
    },
    getAttributeMap: function() { return this.attributeMap; },
    getBinNumber: function() { return this._binNumber; },
    getBinName: function() { return this._binName; },
    setBinNumber: function(binNum) { this._binNumber = binNum; },
    setBinName: function(binName) { this._binName = binName; },
    getAttributeList: function() {
        var attributes = this.attributeMap;
        var keys = attributes.attributeKeys;
        var l = keys.length;
        var list = new Array(l);
        for (var i = 0; i < l; i++) {
            list[i] = attributes[ keys[i] ] ;
        }
        return list;
    },
    setShaderGenerator: function(generator) {
        this._shaderGenerator = generator;
    },
    getShaderGenerator: function() {
        return this._shaderGenerator;
    },
    _getUniformMap: function () {
        return this.uniforms;
    },

    // for internal use, you should not call it directly
    _setTextureAttribute: function (unit, attributePair) {
        if (this.textureAttributeMapList[unit] === undefined) {
            this.textureAttributeMapList[unit] = {};
            this.textureAttributeMapList[unit].attributeKeys = [];
        }
        var name = attributePair.getAttribute().getTypeMember();
        this.textureAttributeMapList[unit][name] = attributePair;
        if (this.textureAttributeMapList[unit].attributeKeys.indexOf(name) === -1) {
            this.textureAttributeMapList[unit].attributeKeys.push(name);
        }
    },
    // for internal use, you should not call it directly
    _setAttribute: function (attributePair) {
        var name = attributePair.getAttribute().getTypeMember();
        this.attributeMap[name] = attributePair;
        if (this.attributeMap.attributeKeys.indexOf(name) === -1) {
            this.attributeMap.attributeKeys.push(name);
        }
    }

}), "osg", "StateSet");
osg.StateSet.prototype.setTextureAttributeAndModes = osg.StateSet.prototype.setTextureAttributeAndMode;
osg.StateSet.prototype.setAttributeAndModes = osg.StateSet.prototype.setAttributeAndMode;
/** -*- compile-command: "jslint-cli Texture.js" -*- */

/** 
 * Texture encapsulate webgl texture object
 * @class Texture
 * @inherits osg.StateAttribute
 */
osg.Texture = function() {
    osg.StateAttribute.call(this);
    this.setDefaultParameters();
};
osg.Texture.DEPTH_COMPONENT = 0x1902;
osg.Texture.ALPHA = 0x1906;
osg.Texture.RGB = 0x1907;
osg.Texture.RGBA = 0x1908;
osg.Texture.LUMINANCE = 0x1909;
osg.Texture.LUMINANCE_ALPHA = 0x190A;

// filter mode
osg.Texture.LINEAR = 0x2601;
osg.Texture.NEAREST = 0x2600;
osg.Texture.NEAREST_MIPMAP_NEAREST = 0x2700;
osg.Texture.LINEAR_MIPMAP_NEAREST = 0x2701;
osg.Texture.NEAREST_MIPMAP_LINEAR = 0x2702;
osg.Texture.LINEAR_MIPMAP_LINEAR = 0x2703;

// wrap mode
osg.Texture.CLAMP_TO_EDGE = 0x812F;
osg.Texture.REPEAT = 0x2901;
osg.Texture.MIRRORED_REPEAT = 0x8370;

// target
osg.Texture.TEXTURE_2D = 0x0DE1;
osg.Texture.TEXTURE_CUBE_MAP = 0x8513;
osg.Texture.TEXTURE_BINDING_CUBE_MAP       = 0x8514;
osg.Texture.TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
osg.Texture.TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
osg.Texture.TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
osg.Texture.TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
osg.Texture.TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
osg.Texture.TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
osg.Texture.MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;

osg.Texture.UNSIGNED_BYTE = 0x1401;
osg.Texture.FLOAT = 0x1406;


/** @lends osg.Texture.prototype */
osg.Texture.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "Texture",
    cloneType: function() { var t = new osg.Texture(); t.default_type = true; return t;},
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType; },
    getOrCreateUniforms: function(unit) {
        if (osg.Texture.uniforms === undefined) {
            osg.Texture.uniforms = [];
        }
        if (osg.Texture.uniforms[unit] === undefined) {
            var name = this.getType() + unit;
            var uniforms = {};
            uniforms.texture = osg.Uniform.createInt1(unit, name);
            uniforms.uniformKeys = Object.keys(uniforms);
            osg.Texture.uniforms[unit] = uniforms;
        }
        // uniform for an texture attribute should directly in osg.Texture.uniforms[unit] and not in osg.Texture.uniforms[unit][Texture0]
        return osg.Texture.uniforms[unit];
    },
    setDefaultParameters: function() {
        this._magFilter = osg.Texture.LINEAR;
        this._minFilter = osg.Texture.LINEAR;
        this._wrapS = osg.Texture.CLAMP_TO_EDGE;
        this._wrapT = osg.Texture.CLAMP_TO_EDGE;
        this._textureWidth = 0;
        this._textureHeight = 0;
        this._unrefImageDataAfterApply = false;
        this.setInternalFormat(osg.Texture.RGBA);
        this._textureTarget = osg.Texture.TEXTURE_2D;
        this._type = osg.Texture.UNSIGNED_BYTE;
    },
    getTextureTarget: function() { return this._textureTarget;},
    getTextureObject: function() { return this._textureObject;},
    setTextureSize: function(w,h) {
        this._textureWidth = w;
        this._textureHeight = h;
    },
    init: function(gl) {
        if (!this._textureObject) {
            this._textureObject = gl.createTexture();
            this.dirty();
        }
    },
    getWidth: function() { return this._textureWidth; },
    getHeight: function() { return this._textureHeight; },
    releaseGLObjects: function(gl) {
        if (this._textureObject !== undefined && this._textureObject !== null) {
            gl.deleteTexture(this._textureObject);
            this._textureObject = null;
            this._image = undefined;
        }
    },
    setWrapS: function(value) {
        if (typeof(value) === "string") {
            this._wrapS = osg.Texture[value];
        } else {
            this._wrapS = value; 
        }
    },
    setWrapT: function(value) { 
        if (typeof(value) === "string") {
            this._wrapT = osg.Texture[value];
        } else {
            this._wrapT = value; 
        }
    },

    getWrapT: function() { return this._wrapT; },
    getWrapS: function() { return this._wrapS; },
    getMinFilter: function(value) { return this._minFilter; },
    getMagFilter: function(value) { return this._magFilter; },

    setMinFilter: function(value) {
        if (typeof(value) === "string") {
            this._minFilter = osg.Texture[value];
        } else {
            this._minFilter = value; 
        }
    },
    setMagFilter: function(value) { 
        if (typeof(value) === "string") {
            this._magFilter = osg.Texture[value];
        } else {
            this._magFilter = value; 
        }
    },

    setImage: function(img, imageFormat) {
        this._image = img;
        this.setImageFormat(imageFormat);
        this.dirty();
    },
    getImage: function() { return this._image; },
    setImageFormat: function(imageFormat) {
        if (imageFormat) {
            if (typeof(imageFormat) === "string") {
                imageFormat = osg.Texture[imageFormat];
            }
            this._imageFormat = imageFormat;
        } else {
            this._imageFormat = osg.Texture.RGBA;
        }
        this.setInternalFormat(this._imageFormat);
    },
    setType: function(value) {
        if (typeof(value) === "string") {
            this._type = osg.Texture[value];
        } else {
            this._type = value; 
        }
    },
    setUnrefImageDataAfterApply: function(bool) {
        this._unrefImageDataAfterApply = bool;
    },
    setInternalFormat: function(internalFormat) { this._internalFormat = internalFormat; },
    getInternalFormat: function() { return this._internalFormat; },
    setFromCanvas: function(canvas, format) {
        this.setImage(canvas, format);
    },
    setFromTypedArray: function(rawData, format) {
        this.setImage(rawData, format);
    },

    isImageReady: function(image) {
        if (image) {
            if (image instanceof Image) {
                if (image.complete) {
                    if (image.naturalWidth !== undefined &&  image.naturalWidth === 0) {
                        return false;
                    }
                    return true;
                }
            } else if (image instanceof HTMLCanvasElement) {
                return true;
            } else if (image instanceof Uint8Array) {
                return true;
            }
        }
        return false;
    },

    applyFilterParameter: function(gl, target) {
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, this._magFilter);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, this._minFilter);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, this._wrapS);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, this._wrapT);
    },

    generateMipmap: function(gl, target) {
        if (this._minFilter === gl.NEAREST_MIPMAP_NEAREST ||
            this._minFilter === gl.LINEAR_MIPMAP_NEAREST ||
            this._minFilter === gl.NEAREST_MIPMAP_LINEAR ||
            this._minFilter === gl.LINEAR_MIPMAP_LINEAR) {
            gl.generateMipmap(target);
        }
    },

    apply: function(state) {
        var gl = state.getGraphicContext();
        if (this._textureObject !== undefined && !this.isDirty()) {
            gl.bindTexture(this._textureTarget, this._textureObject);
        } else if (this.default_type) {
            gl.bindTexture(this._textureTarget, null);
        } else {
            var image = this._image;
            if (image !== undefined) {
                if (this.isImageReady(image)) {
                    if (!this._textureObject) {
                        this.init(gl);
                    }

                    this.setDirty(false);
                    gl.bindTexture(this._textureTarget, this._textureObject);

                    if (image instanceof Image) {
                        this.setTextureSize(image.naturalWidth, image.naturalHeight);
                        gl.texImage2D(this._textureTarget, 0, this._internalFormat, this._imageFormat, this._type, this._image);

                    } else if (image instanceof HTMLCanvasElement) {
                        this.setTextureSize(image.width, image.height);
                        gl.texImage2D(this._textureTarget, 0, this._internalFormat, this._imageFormat, this._type, this._image);

                    } else if (image instanceof Uint8Array) {
                        gl.texImage2D(this._textureTarget, 0, this._internalFormat, this._textureWidth, this._textureHeight, 0, this._internalFormat, this._type, this._image);
                    }

                    this.applyFilterParameter(gl, this._textureTarget);
                    this.generateMipmap(gl, this._textureTarget);

                    if (this._unrefImageDataAfterApply) {
                        this._image = undefined;
                    }
                } else {
                    gl.bindTexture(this._textureTarget, null);
                }

            } else if (this._textureHeight !== 0 && this._textureWidth !== 0 ) {
                if (!this._textureObject) {
                    this.init(gl);
                }
                gl.bindTexture(this._textureTarget, this._textureObject);
                gl.texImage2D(this._textureTarget, 0, this._internalFormat, this._textureWidth, this._textureHeight, 0, this._internalFormat, this._type, null);
                this.applyFilterParameter(gl, this._textureTarget);
                this.generateMipmap(gl, this._textureTarget);
                this.setDirty(false);
            }
        }
    },


    /**
      set the injection code that will be used in the shader generation
      for FragmentMain part we would write something like that
      @example
      var fragmentGenerator = function(unit) {
          var str = "texColor" + unit + " = texture2D( Texture" + unit + ", FragTexCoord" + unit + ".xy );\n";
          str += "fragColor = fragColor * texColor" + unit + ";\n";
      };
      setShaderGeneratorFunction(fragmentGenerator, osg.ShaderGeneratorType.FragmentMain);

    */
    setShaderGeneratorFunction: function(
        /**Function*/ injectionFunction, 
        /**osg.ShaderGeneratorType*/ mode) {
        this[mode] = injectionFunction;
    },

    generateShader: function(unit, type)
    {
        if (this[type]) {
            return this[type].call(this,unit);
        }
        return "";
    }
}), "osg", "Texture");

osg.Texture.prototype[osg.ShaderGeneratorType.VertexInit] = function(unit) {
    var str = "attribute vec2 TexCoord"+unit+";\n";
    str += "varying vec2 FragTexCoord"+unit+";\n";
    return str;
};
osg.Texture.prototype[osg.ShaderGeneratorType.VertexMain] = function(unit) {
        return "FragTexCoord"+unit+" = TexCoord" + unit + ";\n";
};
osg.Texture.prototype[osg.ShaderGeneratorType.FragmentInit] = function(unit) {
    var str = "varying vec2 FragTexCoord" + unit +";\n";
    str += "uniform sampler2D Texture" + unit +";\n";
    str += "vec4 texColor" + unit + ";\n";
    return str;
};
osg.Texture.prototype[osg.ShaderGeneratorType.FragmentMain] = function(unit) {
    var str = "texColor" + unit + " = texture2D( Texture" + unit + ", FragTexCoord" + unit + ".xy );\n";
    str += "fragColor = fragColor * texColor" + unit + ";\n";
    return str;
};


osg.Texture.createFromURL = function(imageSource, format) {
    var texture = new osg.Texture();
    osgDB.Promise.when(osgDB.readImage(imageSource)).then(
        function(img) {
            texture.setImage(img, format);
        }
    );
    return texture;
};
osg.Texture.createFromImg = function(img, format) {
    var a = new osg.Texture();
    a.setImage(img, format);
    return a;
};
osg.Texture.createFromImage = osg.Texture.createFromImg;
osg.Texture.createFromCanvas = function(ctx, format) {
    var a = new osg.Texture();
    a.setFromCanvas(ctx, format);
    return a;
};

osg.Texture.create = function(url) {
    osg.log("osg.Texture.create is deprecated, use osg.Texture.createFromURL instead");
    return osg.Texture.createFromURL(url);
};
/** 
 * TextureCubeMap
 * @class TextureCubeMap
 * @inherits osg.Texture
 */
osg.TextureCubeMap = function() {
    osg.Texture.call(this);
    this._images = {};
};

/** @lends osg.TextureCubeMap.prototype */
osg.TextureCubeMap.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.Texture.prototype, {
    setDefaultParameters: function() {
        osg.Texture.prototype.setDefaultParameters.call(this);
        this._textureTarget = osg.Texture.TEXTURE_CUBE_MAP;
    },
    cloneType: function() { var t = new osg.TextureCubeMap(); t.default_type = true; return t;},
    setImage: function(face, img, imageFormat) {
        if ( typeof(face) === "string" ) {
            face = osg.Texture[face];
        }

        if (this._images[face] === undefined) {
            this._images[face] = {};
        }

        if ( typeof(imageFormat) === "string") {
            imageFormat = osg.Texture[imageFormat];
        }
        if (imageFormat === undefined) {
            imageFormat = osg.Texture.RGBA;
        }

        this._images[face].image = img;
        this._images[face].format = imageFormat;
        this._images[face].dirty = true;
        this.dirty();
    },
    getImage: function(face) { return this._images[face].image; },

    applyTexImage2D_load: function(gl, target, level, internalFormat, format, type, image) {
        if (!image) {
            return false;
        }

        if (!osg.Texture.prototype.isImageReady(image)) {
            return false;
        }

        if (image instanceof Image) {
            this.setTextureSize(image.naturalWidth, image.naturalHeight);
        } else if (image instanceof HTMLCanvasElement) {
            this.setTextureSize(image.width, image.height);
        }

        gl.texImage2D(target, 0, internalFormat, format, type, image);
        return true;
    },

    _applyImageTarget: function(gl, internalFormat, target) {
        var imgObject = this._images[target];
        if (!imgObject) {
            return 0;
        }

        if (!imgObject.dirty) {
            return 1;
        }

        if (this.applyTexImage2D_load(gl,
                                      target,
                                      0,
                                      internalFormat,
                                      imgObject.format,
                                      gl.UNSIGNED_BYTE,
                                      imgObject.image) ) {
            imgObject.dirty = false;
            if (this._unrefImageDataAfterApply) {
                delete this._images[target];
            }
            return 1;
        }
        return 0;
    },

    apply: function(state) {
        var gl = state.getGraphicContext();
        if (this._textureObject !== undefined && !this.isDirty()) {
            gl.bindTexture(this._textureTarget, this._textureObject);

        } else if (this.default_type) {
            gl.bindTexture(this._textureTarget, null);
        } else {
            var images = this._images;
            if (!this._textureObject) {
                this.init(gl);
            }
            gl.bindTexture(this._textureTarget, this._textureObject);

            var internalFormat = this._internalFormat;

            var valid = 0;
            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_POSITIVE_X);
            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_NEGATIVE_X);

            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);

            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
            valid += this._applyImageTarget(gl, internalFormat, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
            if (valid === 6) {
                this.setDirty(false);
                this.applyFilterParameter(gl, this._textureTarget);
                this.generateMipmap(gl, this._textureTarget);
            }
        } // render to cubemap not yet implemented
    }
}),"osg","TextureCubeMap");
osg.UpdateVisitor = function () { 
    osg.NodeVisitor.call(this);
    var framestamp = new osg.FrameStamp();
    this.getFrameStamp = function() { return framestamp; };
    this.setFrameStamp = function(s) { framestamp = s; };
};
osg.UpdateVisitor.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {
    apply: function(node) {
        var ncs = node.getUpdateCallbackList();
        for (var i = 0, l = ncs.length; i < l; i++) {
            if (!ncs[i].update(node, this)) {
                return;
            }
        }
        this.traverse(node);
    }
});
osg.Viewport = function (x,y, w, h) {
    osg.StateAttribute.call(this);

    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (w === undefined) { w = 800; }
    if (h === undefined) { h = 600; }

    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
    this._dirty = true;
};

osg.Viewport.prototype = osg.objectLibraryClass( osg.objectInehrit(osg.StateAttribute.prototype, {
    attributeType: "Viewport",
    cloneType: function() {return new osg.Viewport(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    apply: function(state) {
        var gl = state.getGraphicContext();
        gl.viewport(this._x, this._y, this._width, this._height); 
        this._dirty = false;
    },
    setViewport: function(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.dirty();
    },
    x: function() { return this._x; },
    y: function() { return this._y; },
    width: function() { return this._width; },
    height: function() { return this._height; },
    computeWindowMatrix: function() {
        // res = Matrix offset * Matrix scale * Matrix translate
        var translate = osg.Matrix.makeTranslate(1.0, 1.0, 1.0);
        var scale = osg.Matrix.makeScale(0.5*this._width, 0.5*this._height, 0.5);
        var offset = osg.Matrix.makeTranslate(this._x,this._y,0.0);
        //return osg.Matrix.mult(osg.Matrix.mult(translate, scale, translate), offset, offset);
        return osg.Matrix.preMult(offset, osg.Matrix.preMult(scale, translate));
    }
}), "osg", "Viewport");
osg.CullStack = function() {
    this._modelviewMatrixStack = [];
    this._projectionMatrixStack = [];
    this._viewportStack = [];
    this._bbCornerFar = 0;
    this._bbCornerNear = 0;
};

osg.CullStack.prototype = {
    getCurrentProjectionMatrix: function() {
        return this._projectionMatrixStack[this._projectionMatrixStack.length-1];
    },
    getCurrentModelviewMatrix: function() {
        return this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
    },
    getViewport: function () {
        if (this._viewportStack.length === 0) {
            return undefined;
        }
        return this._viewportStack[this._viewportStack.length-1];
    },
    getLookVectorLocal: function() {
        var m = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
        return [ -m[2], -m[6], -m[10] ];
    },
    pushViewport: function (vp) {
        this._viewportStack.push(vp);
    },
    popViewport: function () {
        this._viewportStack.pop();
    },
    pushModelviewMatrix: function (matrix) {
        this._modelviewMatrixStack.push(matrix);

        var lookVector = this.getLookVectorLocal();
        this._bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);        
        this._bbCornerNear = (~this._bbCornerFar)&7;
    },
    popModelviewMatrix: function () {

        this._modelviewMatrixStack.pop();
        var lookVector;
        if (this._modelviewMatrixStack.length !== 0) {
            lookVector = this.getLookVectorLocal();
        } else {
            lookVector = [0,0,-1];
        }
        this._bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);
        this._bbCornerNear = (~this._bbCornerFar)&7;

    },
    pushProjectionMatrix: function (matrix) {
        this._projectionMatrixStack.push(matrix);
    },
    popProjectionMatrix: function () {
        this._projectionMatrixStack.pop();
    }
};
/** 
 * CullVisitor traverse the tree and collect Matrix/State for the rendering traverse 
 * @class CullVisitor
 */
osg.CullVisitor = function () {
    osg.NodeVisitor.call(this);
    osg.CullSettings.call(this);
    osg.CullStack.call(this);

    this._rootStateGraph = undefined;
    this._currentStateGraph = undefined;
    this._currentRenderBin = undefined;
    this._currentRenderStage = undefined;
    this._rootRenderStage = undefined;

    this._computedNear = Number.POSITIVE_INFINITY;
    this._computedFar = Number.NEGATIVE_INFINITY;

    var lookVector =[0.0,0.0,-1.0];
    this._bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);
    this._bbCornerNear = (~this._bbCornerFar)&7;


    // keep a matrix in memory to avoid to create matrix
    this._reserveMatrixStack = [[]];
    this._reserveMatrixStack.current = 0;

    this._reserveLeafStack = [{}];
    this._reserveLeafStack.current = 0;

    this._renderBinStack = [];
};

/** @lends osg.CullVisitor.prototype */
osg.CullVisitor.prototype = osg.objectInehrit(osg.CullStack.prototype ,osg.objectInehrit(osg.CullSettings.prototype, osg.objectInehrit(osg.NodeVisitor.prototype, {
    distance: function(coord, matrix) {
        return -( coord[0]*matrix[2]+ coord[1]*matrix[6] + coord[2]*matrix[10] + matrix[14]);
    },

    handleCullCallbacksAndTraverse: function(node) {
        var ccb = node.getCullCallback();
        if (ccb) {
            if (!ccb.cull(node, this)) {
                return;
            }
        }
        this.traverse(node);
    },

    updateCalculatedNearFar: function( matrix, drawable) {

        var bb = drawable.getBoundingBox();
        var d_near, d_far;

        // efficient computation of near and far, only taking into account the nearest and furthest
        // corners of the bounding box.
        d_near = this.distance(bb.corner(this._bbCornerNear),matrix);
        d_far = this.distance(bb.corner(this._bbCornerFar),matrix);
        
        if (d_near>d_far) {
            var tmp = d_near;
            d_near = d_far;
            d_far = tmp;
        }

        if (d_far<0.0) {
            // whole object behind the eye point so discard
            return false;
        }

        if (d_near<this._computedNear) {
            this._computedNear = d_near;
        }

        if (d_far>this._computedFar) {
            this._computedFar = d_far;
        }

        return true;
    },

    clampProjectionMatrix: function(projection, znear, zfar, nearFarRatio, resultNearFar) {
        var epsilon = 1e-6;
        if (zfar<znear-epsilon) {
            osg.log("clampProjectionMatrix not applied, invalid depth range, znear = " + znear + "  zfar = " + zfar);
            return false;
        }
        
        var desired_znear, desired_zfar;
        if (zfar<znear+epsilon) {
            // znear and zfar are too close together and could cause divide by zero problems
            // late on in the clamping code, so move the znear and zfar apart.
            var average = (znear+zfar)*0.5;
            znear = average-epsilon;
            zfar = average+epsilon;
            // OSG_INFO << "_clampProjectionMatrix widening znear and zfar to "<<znear<<" "<<zfar<<std::endl;
        }

        if (Math.abs(osg.Matrix.get(projection,0,3))<epsilon  && 
            Math.abs(osg.Matrix.get(projection,1,3))<epsilon  && 
            Math.abs(osg.Matrix.get(projection,2,3))<epsilon ) {
            // OSG_INFO << "Orthographic matrix before clamping"<<projection<<std::endl;

            var delta_span = (zfar-znear)*0.02;
            if (delta_span<1.0) {
                delta_span = 1.0;
            }
            desired_znear = znear - delta_span;
            desired_zfar = zfar + delta_span;

            // assign the clamped values back to the computed values.
            znear = desired_znear;
            zfar = desired_zfar;

            osg.Matrix.set(projection,2,2, -2.0/(desired_zfar-desired_znear));
            osg.Matrix.set(projection,3,2, -(desired_zfar+desired_znear)/(desired_zfar-desired_znear));

            // OSG_INFO << "Orthographic matrix after clamping "<<projection<<std::endl;
        } else {

            // OSG_INFO << "Persepective matrix before clamping"<<projection<<std::endl;
            //std::cout << "_computed_znear"<<_computed_znear<<std::endl;
            //std::cout << "_computed_zfar"<<_computed_zfar<<std::endl;

            var zfarPushRatio = 1.02;
            var znearPullRatio = 0.98;

            //znearPullRatio = 0.99; 

            desired_znear = znear * znearPullRatio;
            desired_zfar = zfar * zfarPushRatio;

            // near plane clamping.
            var min_near_plane = zfar*nearFarRatio;
            if (desired_znear<min_near_plane) {
                desired_znear=min_near_plane;
            }

            // assign the clamped values back to the computed values.
            znear = desired_znear;
            zfar = desired_zfar;
            
            var m22 = osg.Matrix.get(projection,2,2);
            var m32 = osg.Matrix.get(projection,3,2);
            var m23 = osg.Matrix.get(projection,2,3);
            var m33 = osg.Matrix.get(projection,3,3);
            var trans_near_plane = (-desired_znear*m22 + m32)/(-desired_znear*m23+m33);
            var trans_far_plane = (-desired_zfar*m22+m32)/(-desired_zfar*m23+m33);

            var ratio = Math.abs(2.0/(trans_near_plane-trans_far_plane));
            var center = -(trans_near_plane+trans_far_plane)/2.0;

            var matrix = [1.0,0.0,0.0,0.0,
                          0.0,1.0,0.0,0.0,
                          0.0,0.0,ratio,0.0,
                          0.0,0.0,center*ratio,1.0];
            osg.Matrix.postMult(matrix, projection);
            // OSG_INFO << "Persepective matrix after clamping"<<projection<<std::endl;
        }
        if (resultNearFar !== undefined) {
            resultNearFar[0] = znear;
            resultNearFar[1] = zfar;
        }
        return true;
    },

    setStateGraph: function(sg) {
        this._rootStateGraph = sg;
        this._currentStateGraph = sg;
    },
    setRenderStage: function(rg) {
        this._rootRenderStage = rg;
        this._currentRenderBin = rg;
    },
    reset: function () {
        //this._modelviewMatrixStack.length = 0;
        this._modelviewMatrixStack.splice(0, this._modelviewMatrixStack.length);
        //this._projectionMatrixStack.length = 0;
        this._projectionMatrixStack.splice(0, this._projectionMatrixStack.length);
        this._reserveMatrixStack.current = 0;
        this._reserveLeafStack.current = 0;

        this._computedNear = Number.POSITIVE_INFINITY;
        this._computedFar = Number.NEGATIVE_INFINITY;
    },
    getCurrentRenderBin: function() { return this._currentRenderBin; },
    setCurrentRenderBin: function(rb) { this._currentRenderBin = rb; },
    addPositionedAttribute: function (attribute) {
        var matrix = this._modelviewMatrixStack[this._modelviewMatrixStack.length - 1];
        this._currentRenderBin.getStage().positionedAttribute.push([matrix, attribute]);
    },

    pushStateSet: function (stateset) {
        this._currentStateGraph = this._currentStateGraph.findOrInsert(stateset);
        if (stateset.getBinName() !== undefined) {
            var renderBinStack = this._renderBinStack;
            var currentRenderBin = this._currentRenderBin;
            renderBinStack.push(currentRenderBin);
            this._currentRenderBin = currentRenderBin.getStage().findOrInsert(stateset.getBinNumber(),stateset.getBinName());
        }
    },

    /** Pop the top state set and hence associated state group.
     * Move the current state group to the parent of the popped
     * state group.
     */
    popStateSet: function () {
        var currentStateGraph = this._currentStateGraph;
        var stateset = currentStateGraph.getStateSet();
        this._currentStateGraph = currentStateGraph.parent;
        if (stateset.getBinName() !== undefined) {
            var renderBinStack = this._renderBinStack;
            if (renderBinStack.length === 0) {
                this._currentRenderBin = this._currentRenderBin.getStage();
            } else {
                this._currentRenderBin = renderBinStack.pop();
            }
        }
    },

    popProjectionMatrix: function () {
        if (this._computeNearFar === true && this._computedFar >= this._computedNear) {
            var m = this._projectionMatrixStack[this._projectionMatrixStack.length-1];
            this.clampProjectionMatrix(m, this._computedNear, this._computedFar, this._nearFarRatio);
        }
        osg.CullStack.prototype.popProjectionMatrix.call(this);
    },

    apply: function( node ) {
        this[node.objectType].call(this, node);
    },

    _getReservedMatrix: function() {
        var m = this._reserveMatrixStack[this._reserveMatrixStack.current++];
        if (this._reserveMatrixStack.current === this._reserveMatrixStack.length) {
            this._reserveMatrixStack.push(osg.Matrix.makeIdentity([]));
        }
        return m;
    },
    _getReservedLeaf: function() {
        var l = this._reserveLeafStack[this._reserveLeafStack.current++];
        if (this._reserveLeafStack.current === this._reserveLeafStack.length) {
            this._reserveLeafStack.push({});
        }
        return l;
    }
})));

osg.CullVisitor.prototype[osg.Camera.prototype.objectType] = function( camera ) {

    var stateset = camera.getStateSet();
    if (stateset) {
        this.pushStateSet(stateset);
    }

    if (camera.light) {
        this.addPositionedAttribute(camera.light);
    }

    var originalModelView = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];

    var modelview = this._getReservedMatrix();
    var projection = this._getReservedMatrix();

    if (camera.getReferenceFrame() === osg.Transform.RELATIVE_RF) {
        var lastProjectionMatrix = this._projectionMatrixStack[this._projectionMatrixStack.length-1];
        osg.Matrix.mult(lastProjectionMatrix, camera.getProjectionMatrix(), projection);
        var lastViewMatrix = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
        osg.Matrix.mult(lastViewMatrix, camera.getViewMatrix(), modelview);
    } else {
        // absolute
        osg.Matrix.copy(camera.getViewMatrix(), modelview);
        osg.Matrix.copy(camera.getProjectionMatrix(), projection);
    }
    this.pushProjectionMatrix(projection);
    this.pushModelviewMatrix(modelview);

    if (camera.getViewport()) {
        this.pushViewport(camera.getViewport());
    }

    // save current state of the camera
    var previous_znear = this._computedNear;
    var previous_zfar = this._computedFar;
    var previous_cullsettings = new osg.CullSettings();
    previous_cullsettings.setCullSettings(this);

    this._computedNear = Number.POSITIVE_INFINITY;
    this._computedFar = Number.NEGATIVE_INFINITY;
    this.setCullSettings(camera);

    // nested camera
    if (camera.getRenderOrder() === osg.Camera.NESTED_RENDER) {
        
        this.handleCullCallbacksAndTraverse(camera);
        
    } else {
        // not tested

        var previous_stage = this.getCurrentRenderBin().getStage();

        // use render to texture stage
        var rtts = new osg.RenderStage();
        rtts.setCamera(camera);
        rtts.setClearDepth(camera.getClearDepth());
        rtts.setClearColor(camera.getClearColor());

        rtts.setClearMask(camera.getClearMask());
        
        var vp;
        if (camera.getViewport() === undefined) {
            vp = previous_stage.getViewport();
        } else {
            vp = camera.getViewport();
        }
        rtts.setViewport(vp);
        
        // skip positional state for now
        // ...

        var previousRenderBin = this.getCurrentRenderBin();

        this.setCurrentRenderBin(rtts);

        this.handleCullCallbacksAndTraverse(camera);

        this.setCurrentRenderBin(previousRenderBin);

        if (camera.getRenderOrder() === osg.Camera.PRE_RENDER) {
            this.getCurrentRenderBin().getStage().addPreRenderStage(rtts,camera.renderOrderNum);
        } else {
            this.getCurrentRenderBin().getStage().addPostRenderStage(rtts,camera.renderOrderNum);
        }
    }

    this.popModelviewMatrix();
    this.popProjectionMatrix();

    if (camera.getViewport()) {
        this.popViewport();
    }

    // restore previous state of the camera
    this.setCullSettings(previous_cullsettings);
    this._computedNear = previous_znear;
    this._computedFar = previous_zfar;

    if (stateset) {
        this.popStateSet();
    }

};


osg.CullVisitor.prototype[osg.MatrixTransform.prototype.objectType] = function (node) {
    var matrix = this._getReservedMatrix();

    if (node.getReferenceFrame() === osg.Transform.RELATIVE_RF) {
        var lastMatrixStack = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
        osg.Matrix.mult(lastMatrixStack, node.getMatrix(), matrix);
    } else {
        // absolute
        osg.Matrix.copy(node.getMatrix(), matrix);
    }
    this.pushModelviewMatrix(matrix);


    var stateset = node.getStateSet();
    if (stateset) {
        this.pushStateSet(stateset);
    }

    if (node.light) {
        this.addPositionedAttribute(node.light);
    }

    this.handleCullCallbacksAndTraverse(node);

    if (stateset) {
        this.popStateSet();
    }
    
    this.popModelviewMatrix();

};

osg.CullVisitor.prototype[osg.Projection.prototype.objectType] = function (node) {
    lastMatrixStack = this._projectionMatrixStack[this._projectionMatrixStack.length-1];
    var matrix = this._getReservedMatrix();
    osg.Matrix.mult(lastMatrixStack, node.getProjectionMatrix(), matrix);
    this.pushProjectionMatrix(matrix);

    var stateset = node.getStateSet();

    if (stateset) {
        this.pushStateSet(stateset);
    }

    this.handleCullCallbacksAndTraverse(node);

    if (stateset) {
        this.popStateSet();
    }

    this.popProjectionMatrix();
};

osg.CullVisitor.prototype[osg.Node.prototype.objectType] = function (node) {

    var stateset = node.getStateSet();
    if (stateset) {
        this.pushStateSet(stateset);
    }
    if (node.light) {
        this.addPositionedAttribute(node.light);
    }

    this.handleCullCallbacksAndTraverse(node);

    if (stateset) {
        this.popStateSet();
    }
};
osg.CullVisitor.prototype[osg.LightSource.prototype.objectType] = function (node) {

    var stateset = node.getStateSet();
    if (stateset) {
        this.pushStateSet(stateset);
    }

    var light = node.getLight();
    if (light) {
        this.addPositionedAttribute(light);
    }

    this.handleCullCallbacksAndTraverse(node);

    if (stateset) {
        this.popStateSet();
    }
};

osg.CullVisitor.prototype[osg.Geometry.prototype.objectType] = function (node) {
    var modelview = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
    var bb = node.getBoundingBox();
    if (this._computeNearFar && bb.valid()) {
        if (!this.updateCalculatedNearFar(modelview,node)) {
            return;
        }
    }

    var stateset = node.getStateSet();
    if (stateset) {
        this.pushStateSet(stateset);
    }

    this.handleCullCallbacksAndTraverse(node);

    var leafs = this._currentStateGraph.leafs;
    if (leafs.length === 0) {
        this._currentRenderBin.addStateGraph(this._currentStateGraph);
    }

    var leaf = this._getReservedLeaf();
    var depth = 0;    
    if (bb.valid()) {
        depth = this.distance(bb.center(), modelview);
    }
    if (isNaN(depth)) {
        osg.warn("warning geometry has a NaN depth, " + modelview + " center " + bb.center());
    } else {
        //leaf.id = this._reserveLeafStack.current;
        leaf.parent = this._currentStateGraph;
        leaf.projection = this._projectionMatrixStack[this._projectionMatrixStack.length-1];
        leaf.geometry = node;
        leaf.modelview = modelview;
        leaf.depth = depth;
        leafs.push(leaf);
    }

    if (stateset) {
        this.popStateSet();
    }
};
/** -*- compile-command: "jslint-cli osgAnimation.js" -*-
 *
 *  Copyright (C) 2010 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


var osgAnimation = {};

osgAnimation.EaseOutQuad = function(t) { return - (t* (t-2.0)); };
osgAnimation.EaseInQuad = function(t) { return (t*t); };
osgAnimation.EaseOutCubic = function(t) { t = t-1.0; return (t*t*t + 1); };
osgAnimation.EaseInCubic = function(t) { return (t*t*t); };
osgAnimation.EaseOutQuart = function(t) { t = t - 1; return - (t*t*t*t -1); };
osgAnimation.EaseInQuart = function(t) { return (t*t*t*t); };
osgAnimation.EaseOutElastic = function(t) { return Math.pow(2.0, -10.0 * t) * Math.sin((t - 0.3 / 4.0) * (2.0 * Math.PI) / 0.3) + 1.0; };
//osgAnimation.EaseInElastic = function(t) { return ; };

osgAnimation.easeOutQuad = osgAnimation.EaseOutQuad;
osgAnimation.easeInQuad = osgAnimation.EaseInQuad;
osgAnimation.easeOutCubic = osgAnimation.EaseOutCubic;
osgAnimation.easeInCubic = osgAnimation.EaseInCubic;
osgAnimation.easeOutQuart = osgAnimation.EaseOutQuart;
osgAnimation.easeInQuart = osgAnimation.EaseInQuart;
osgAnimation.easeOutElastic = osgAnimation.EaseOutElastic;

/** -*- compile-command: "jslint-cli Animation.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  Animation
 *  @class Animation
 */
osgAnimation.Animation = function() {
    osg.Object.call(this);
    this._channels = [];
};

/** @lends osgAnimation.Animation.prototype */
osgAnimation.Animation.prototype = osg.objectInehrit(osg.Object.prototype, {
    getChannels: function() { return this._channels; },
    getDuration: function() {
        var tmin = 1e5;
        var tmax = -1e5;
        for (var i = 0, l = this._channels.length; i < l; i++) {
            var channel = this._channels[i];
            tmin = Math.min(tmin, channel.getStartTime());
            tmax = Math.max(tmax, channel.getEndTime());
        }
        return tmax-tmin;
    }

});
/** -*- compile-command: "jslint-cli AnimationManager.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  BasicAnimationManager
 *  @class BasicAnimationManager
 */
osgAnimation.BasicAnimationManager = function() {
    osg.Object.call(this);
    this._animations = {};

    this._actives = {};
    this._actives._keys = [];

    this._lastUpdate = undefined;
    this._targets = [];
};

/** @lends osgAnimation.BasicAnimationManager.prototype */
osgAnimation.BasicAnimationManager.prototype = osg.objectInehrit(osg.Object.prototype, {
    _updateAnimation: function(animationParameter, t, priority) {
        var duration = animationParameter.duration;
        var weight = animationParameter.weight;
        var animation = animationParameter.anim;
        var start = animationParameter.start;
        var loop = animationParameter.loop;

        if (loop > 0) {
            var playedTimes = t-start;
            if (playedTimes >= loop*duration) {
                return true;
            }
        }

        t = (t-start) % duration;
        var callback = animationParameter.callback;
        if (callback) {
            callback(t);
        }

        var channels = animation.getChannels();
        for ( var i = 0, l = channels.length; i < l; i++) {
            var channel = channels[i];
            channel.update(t, weight, priority);
        }
        return false;
    },
    update: function(node, nv) {
        var t = nv.getFrameStamp().getSimulationTime();
        this.updateManager(t);
        return true;
    },
    updateManager: function(t) {
        
        var targets = this._targets;
        for (var i = 0, l = targets.length; i < l; i++) {
            targets[i].reset();
        }
        if (this._actives._keys.length > 0) {
            var pri = this._actives._keys.length - 1;
            while (pri >= 0) {
                var layer = this._actives[pri];
                var keys = this._actives[pri]._keys;
                var removes = [];
                for (var ai = 0, al = keys.length; ai < al; ai++) {
                    var key = keys[ai];
                    var anim = layer[key];
                    if (anim.start === undefined) {
                        anim.start = t;
                    }
                    var remove = this._updateAnimation(anim, t, pri);
                    if (remove) {
                        removes.push(ai);
                    }
                }

                // remove finished animation
                for (var j = removes.length-1; j >= 0; j--) {
                    var k = keys[j];
                    keys.splice(j,1);
                    delete layer[k];
                }

                pri--;
            }
        }
    },

    stopAll: function() {},
    isPlaying: function(name) {
        if (this._actives._keys.length > 0) {
            var pri = this._actives._keys.length - 1;
            while (pri >=0 ) {
                if (this._actives[pri][name]) {
                    return true;
                }
                pri--;
            }
        }
        return false;
    },
    stopAnimation: function(name) {
        if (this._actives._keys.length > 0) {
            var pri = this._actives._keys.length - 1;
            var filterFunction = function(element, index, array) { return element !== "_keys";};
            while (pri >=0 ) {
                if (this._actives[pri][name]) {
                    delete this._actives[pri][name];
                    this._actives[pri]._keys = Object.keys(this._actives[pri]).filter(filterFunction);
                    return;
                }
                pri--;
            }
        }
    },
    playAnimationObject: function(obj) {
        if (obj.name === undefined) {
            return;
        }

        var anim = this._animations[obj.name];
        if (anim === undefined) {
            osg.log("no animation " + obj.name + " found");
            return;
        }

        if (this.isPlaying(obj.name)) {
            return;
        }

        if (obj.priority === undefined) {
            obj.priority = 0;
        }

        if (obj.weight === undefined) {
            obj.weight = 1.0;
        }

        if (obj.timeFactor === undefined) {
            obj.timeFactor = 1.0;
        }

        if (obj.loop === undefined) {
            obj.loop = 0;
        }
        
        if (this._actives[obj.priority] === undefined) {
            this._actives[obj.priority] = {};
            this._actives[obj.priority]._keys = [];
            this._actives._keys.push(obj.priority); // = Object.keys(this._actives);
        }

        obj.start = undefined;
        obj.duration = anim.getDuration();
        obj.anim = anim;
        this._actives[obj.priority][obj.name] = obj;
        this._actives[obj.priority]._keys.push(obj.name);
    },

    playAnimation: function(name, priority, weight) {
        var animName = name;
        if (typeof name === "object") {
            if (name.getName === undefined) {
                return this.playAnimationObject(name);
            } else {
                animName = name.getName();
            }
        }
        var obj = { 'name': animName,
                    'priority': priority,
                    'weight': weight };

        return this.playAnimationObject(obj);
    },

    registerAnimation: function(anim) {
        this._animations[anim.getName()] = anim;
        this.buildTargetList();
    },
    getAnimationMap: function() { return this._animations; },
    buildTargetList: function() {
        this._targets.length = 0;
        var keys = Object.keys(this._animations);
        for (var i = 0, l = keys.length; i < l; i++) {
            var a = this._animations[ keys[i] ];
            var channels = a.getChannels();
            for (var c = 0, lc = channels.length; c < lc; c++) {
                var channel = channels[c];
                this._targets.push(channel.getTarget());
            }
        }
    }

});
/** -*- compile-command: "jslint-cli Channel.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  Channel is responsible to interpolate keys
 *  @class Channel
 */
osgAnimation.Channel = function(sampler, target) {
    osg.Object.call(this);
    this._sampler = sampler;
    this._target = target;
    this._targetName = undefined;
    this._data = { 'value': undefined, 'key' : 0 };
};

/** @lends osgAnimation.Channel.prototype */
osgAnimation.Channel.prototype = osg.objectInehrit(osg.Object.prototype, {
    getKeyframes: function() { return this._sampler.getKeyframes(); },
    setKeyframes: function(keys) { this._sampler.setKeyframes(keys); },
    getStartTime: function() { return this._sampler.getStartTime(); },
    getEndTime: function() { return this._sampler.getEndTime(); },
    getSampler: function() { return this._sampler; },
    setSampler: function(sampler) { this._sampler = sampler; },
    getTarget: function() { return this._target; },
    setTarget: function(target) { this._target = target; },
    setTargetName: function(name) { this._targetName = name; },
    getTargetName: function() { return this._targetName; },
    update: function(t, weight, priority) {
        weight = weight || 1.0;
        priority = priority || 0.0;

        // skip if weight == 0
        if (weight < 1e-4)
            return;
        var data = this._data;
        this._sampler.getValueAt(t, data);
        this._target.update.call(this._target, weight, data.value, priority);
    },
    reset: function() { this._target.reset(); }
});


osgAnimation.Vec3LerpChannel = function(keys, target)
{
    var sampler = new osgAnimation.Sampler();
    if (!keys) {
        keys = [];
    }
    if (!target) {
        target = new osgAnimation.Vec3Target();
    }
    osgAnimation.Channel.call(this, sampler, target);
    sampler.setInterpolator(osgAnimation.Vec3LerpInterpolator);
    this.setKeyframes(keys);
    this._data.value = osg.Vec3.copy(target.getValue(), []);
};
osgAnimation.Vec3LerpChannel.prototype = osgAnimation.Channel.prototype;



osgAnimation.FloatLerpChannel = function(keys, target)
{
    var sampler = new osgAnimation.Sampler();
    if (!keys) {
        keys = [];
    }
    if (!target) {
        target = new osgAnimation.FloatTarget();
    }
    osgAnimation.Channel.call(this, sampler, target);
    sampler.setInterpolator(osgAnimation.FloatLerpInterpolator);
    this.setKeyframes(keys);
    this._data.value = target.getValue();
};
osgAnimation.FloatLerpChannel.prototype = osgAnimation.Channel.prototype;


osgAnimation.QuatLerpChannel = function(keys, target)
{
    var sampler = new osgAnimation.Sampler();
    if (!keys) {
        keys = [];
    }
    if (!target) {
        target = new osgAnimation.QuatTarget();
    }
    osgAnimation.Channel.call(this, sampler, target);
    sampler.setInterpolator(osgAnimation.QuatLerpInterpolator);
    this.setKeyframes(keys);
    this._data.value = osg.Quat.copy(target.getValue(), []);
};
osgAnimation.QuatLerpChannel.prototype = osgAnimation.Channel.prototype;


osgAnimation.QuatSlerpChannel = function(keys, target)
{
    osgAnimation.QuatLerpChannel.call(this, keys, target);
    this.getSampler().setInterpolator(osgAnimation.QuatSlerpInterpolator);
};
osgAnimation.QuatSlerpChannel.prototype = osgAnimation.Channel.prototype;
/** -*- compile-command: "jslint-cli Interpolator.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  Interpolator provide interpolation function to sampler
 */
osgAnimation.Vec3LerpInterpolator = function(keys, t, result)
{
    var keyStart;
    var startTime;
    var keyEnd = keys[keys.length-1];
    var endTime = keyEnd.t;
    if (t >= endTime) {
        result.key = 0;
        result.value[0] = keyEnd[0];
        result.value[1] = keyEnd[1];
        result.value[2] = keyEnd[2];
        return;
    } else {
        keyStart = keys[0];
        startTime = keyStart.t;
        
        if (t <= startTime) {
            result.key = 0;
            result.value[0] = keyStart[0];
            result.value[1] = keyStart[1];
            result.value[2] = keyStart[2];
            return;
        }
    }

    var i1 = result.key;
    while(keys[i1+1].t < t) {
        i1++;
    }
    var i2 = i1+1;

    var t1=keys[i1].t;
    var x1=keys[i1][0];
    var y1=keys[i1][1];
    var z1=keys[i1][2];
    
    var t2=keys[i2].t;
    var x2=keys[i2][0];
    var y2=keys[i2][1];
    var z2=keys[i2][2];
    
    var r = (t-t1)/(t2-t1);

    result.value[0] = x1+(x2-x1)*r;
    result.value[1] = y1+(y2-y1)*r;
    result.value[2] = z1+(z2-z1)*r;
    result.key = i1;
};


osgAnimation.QuatLerpInterpolator = function(keys, t, result)
{
    var keyStart;
    var startTime;
    var keyEnd = keys[keys.length-1];
    var endTime = keyEnd.t;
    if (t >= endTime) {
        result.key = 0;
        result.value[0] = keyEnd[0];
        result.value[1] = keyEnd[1];
        result.value[2] = keyEnd[2];
        result.value[3] = keyEnd[3];
        return;
    } else {
        keyStart = keys[0];
        startTime = keyStart.t;
        
        if (t <= startTime) {
            result.key = 0;
            result.value[0] = keyStart[0];
            result.value[1] = keyStart[1];
            result.value[2] = keyStart[2];
            result.value[3] = keyStart[3];
            return;
        }
    }

    var i1 = result.key;
    while(keys[i1+1].t < t) {
        i1++;
    }
    var i2 = i1+1;

    var t1=keys[i1].t;
    var x1=keys[i1][0];
    var y1=keys[i1][1];
    var z1=keys[i1][2];
    var w1=keys[i1][3];
    
    var t2=keys[i2].t;
    var x2=keys[i2][0];
    var y2=keys[i2][1];
    var z2=keys[i2][2];
    var w2=keys[i2][3];
    
    var r = (t-t1)/(t2-t1);

    result.value[0] = x1+(x2-x1)*r;
    result.value[1] = y1+(y2-y1)*r;
    result.value[2] = z1+(z2-z1)*r;
    result.value[3] = w1+(w2-w1)*r;
    result.key = i1;
};

osgAnimation.QuatSlerpInterpolator = function(keys, t, result)
{
    var keyStart;
    var startTime;
    var keyEnd = keys[keys.length-1];
    var endTime = keyEnd.t;
    if (t >= endTime) {
        result.key = 0;
        result.value[0] = keyEnd[0];
        result.value[1] = keyEnd[1];
        result.value[2] = keyEnd[2];
        result.value[3] = keyEnd[3];
        return;
    } else {
        keyStart = keys[0];
        startTime = keyStart.t;
        
        if (t <= startTime) {
            result.key = 0;
            result.value[0] = keyStart[0];
            result.value[1] = keyStart[1];
            result.value[2] = keyStart[2];
            result.value[3] = keyStart[3];
            return;
        }
    }

    var i1 = result.key;
    while(keys[i1+1].t < t) {
        i1++;
    }
    var i2 = i1+1;

    var t1=keys[i1].t;
    var t2=keys[i2].t;
    var r = (t-t1)/(t2-t1);

    osg.Quat.slerp(r, keys[i1], keys[i2], result.value);
    result.key = i1;
};


/** 
 *  Interpolator provide interpolation function to sampler
 */
osgAnimation.FloatLerpInterpolator = function(keys, t, result)
{
    var keyStart;
    var startTime;
    var keyEnd = keys[keys.length-1];
    var endTime = keyEnd.t;
    if (t >= endTime) {
        result.key = 0;
        result.value = keyEnd[0];
        return;
    } else {
        keyStart = keys[0];
        startTime = keyStart.t;
        
        if (t <= startTime) {
            result.key = 0;
            result.value = keyStart[0];
            return;
        }
    }

    var i1 = result.key;
    while(keys[i1+1].t < t) {
        i1++;
    }
    var i2 = i1+1;

    var t1=keys[i1].t;
    var x1=keys[i1][0];
    
    var t2=keys[i2].t;
    var x2=keys[i2][0];
    
    var r = (t-t1)/(t2-t1);
    result.value = x1+(x2-x1)*r;
    result.key = i1;
};


/** 
 *  Interpolator provide interpolation function to sampler
 */
osgAnimation.FloatStepInterpolator = function(keys, t, result)
{
    var keyStart;
    var startTime;
    var keyEnd = keys[keys.length-1];
    var endTime = keyEnd.t;
    if (t >= endTime) {
        result.key = 0;
        result.value = keyEnd[0];
        return;
    } else {
        keyStart = keys[0];
        startTime = keyStart.t;
        
        if (t <= startTime) {
            result.key = 0;
            result.value = keyStart[0];
            return;
        }
    }

    var i1 = result.key;
    while(keys[i1+1].t < t) {
        i1++;
    }
    var i2 = i1+1;

    var t1=keys[i1].t;
    var x1=keys[i1][0];
    result.value = x1;
    result.key = i1;
};
/** -*- compile-command: "jslint-cli Keyframe.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


osgAnimation.createVec3Keyframe = function(t, array) {
    var k = array.slice(0);
    k.t = t;
    return k;
};

osgAnimation.createQuatKeyframe = function(t, array) {
    var k = array.slice(0);
    k.t = t;
    return k;
};

osgAnimation.createFloatKeyframe = function(t, value) {
    var k = [value];
    k.t = t;
    return k;
};
/** -*- compile-command: "jslint-cli LinkVisitor.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  LinkVisitor search for animationUpdateCallback and link animation data
 *  @class LinkVisitor
 */
osgAnimation.LinkVisitor = function() {
    osg.NodeVisitor.call(this);
    this._animations = undefined;
    this._nbLinkTarget = 0;
};

/** @lends osgAnimation.LinkVisitor.prototype */
osgAnimation.LinkVisitor.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {
    setAnimationMap: function(anims) { 
        this._animations = anims;
        this._animationKeys = Object.keys(anims);
    },

    apply: function(node) {
        var cbs = node.getUpdateCallbackList();
        for (var i = 0, l = cbs.length; i < l; i++) {
            var cb = cbs[i];
            if ( cb instanceof osgAnimation.AnimationUpdateCallback ) {
                this.link(cb);
            }
        }
        this.traverse(node);
    },

    link: function(animCallback) {
        var result = 0;
        var anims = this._animations;
        var animKeys = this._animationKeys;
        for (var i = 0, l = animKeys.length; i < l; i++) {
            var key = animKeys[i];
            var anim = anims[key];
            result += animCallback.linkAnimation(anim);
        }
        this._nbLinkedTarget += result;
        osg.log("linked " + result + " for \"" + animCallback.getName() + '"');
    }

});/** -*- compile-command: "jslint-cli Sampler.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  Sampler is responsible to interpolate keys
 *  @class Sampler
 */
osgAnimation.Sampler = function(keys, interpolator) {
    if (!keys) {
        keys = [];
    }
    this._keys = keys;
    this._interpolator = interpolator;
};

/** @lends osgAnimation.Sampler.prototype */
osgAnimation.Sampler.prototype = {

    getKeyframes: function() { return this._keys;},
    setKeyframes: function(keys) { this._keys = keys; },
    setInterpolator: function(interpolator) { this._interpolator = interpolator; },
    getInterpolator: function() { return this._interpolator; },
    getStartTime: function() {
        if (this._keys.length === 0) {
            return undefined;
        }
        return this._keys[0].t;
    },
    getEndTime: function() {
        if (this._keys.length === 0) {
            return undefined;
        }
        return this._keys[this._keys.length-1].t;
    },

    // result contains the keyIndex where to start, this key
    // will be updated when calling the Interpolator
    // result.value will contain the interpolation result
    // { 'value': undefined, 'keyIndex': 0 };
    getValueAt: function(t, result) {
        // reset the key if invalid
        if (this._keys[result.key].t > t) {
            result.key = 0;
        }
        this._interpolator(this._keys, t, result);
    }
};
/** -*- compile-command: "jslint-cli StackedTransformElement.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  StackedTranslate
 *  @class StackedTranslate
 */
osgAnimation.StackedTranslate = function (name, translate) {
    osg.Object.call(this);
    if (!translate) {
        translate = [ 0,0,0 ];
    }
    this._translate = translate;
    this._target = undefined;
    this.setName(name);
};

/** @lends osgAnimation.StackedTranslate.prototype */
osgAnimation.StackedTranslate.prototype = osg.objectInehrit(osg.Object.prototype, {
    setTranslate: function(translate) { osg.Vec3.copy(translate, this._translate); },
    setTarget: function(target) { this._target = target; },
    getTarget: function() { return this._target; },
    update: function() {
        if (this._target !== undefined) {
            osg.Vec3.copy(this._target.getValue(), this._translate);
        }
    },
    getOrCreateTarget: function() {
        if (!this._target) {
            this._target = new osgAnimation.Vec3Target(this._translate);
        }
        return this._target;
    },
    applyToMatrix: function(m) {
        osg.Matrix.preMultTranslate(m, this._translate);
    }
});


/** 
 *  StackedRotateAxis
 *  @class StackedRotateAxis
 */
osgAnimation.StackedRotateAxis = function (name, axis, angle) {
    osg.Object.call(this);
    if (!axis) {
        axis = [ 1,0,0 ];
    }
    if (!angle) {
        angle = 0;
    }
    this._axis = axis;
    this._angle = angle;
    this._target = undefined;
    this.setName(name);

    this._matrixTmp = [];
    osg.Matrix.makeIdentity(this._matrixTmp);
    this._quatTmp = [];
    osg.Quat.makeIdentity(this._quatTmp);
};

/** @lends osgAnimation.StackedRotateAxis.prototype */
osgAnimation.StackedRotateAxis.prototype = osg.objectInehrit(osg.Object.prototype, {
    setAxis: function(axis) { osg.Vec3.copy(axis, this._axis); },
    setAngle: function(angle) { this._angle = angle; },
    setTarget: function(target) { this._target = target; },
    getTarget: function() { return this._target; },
    update: function() {
        if (this._target !== undefined) {
            this._angle = this._target.getValue();
        }
    },
    getOrCreateTarget: function() {
        if (!this._target) {
            this._target = new osgAnimation.FloatTarget(this._angle);
        }
        return this._target;
    },
    applyToMatrix: function(m) {
        var axis = this._axis;
        var qtmp = this._quatTmp;
        var mtmp = this._matrixTmp;

        osg.Quat.makeRotate(this._angle, axis[0], axis[1], axis[2], qtmp);
        osg.Matrix.setRotateFromQuat(mtmp, qtmp);
        osg.Matrix.preMult(m, mtmp);
    }

});





/** 
 *  StackedQuaternion
 *  @class StackedQuaternion
 */
osgAnimation.StackedQuaternion = function (name, quat) {
    osg.Object.call(this);
    if (!quat) {
        quat = [ 0,0,0,1 ];
    }
    this._quaternion = quat;
    this._target = undefined;
    this._matrixTmp = [];
    osg.Matrix.makeIdentity(this._matrixTmp);
    this.setName(name);
};

/** @lends osgAnimation.StackedQuaternion.prototype */
osgAnimation.StackedQuaternion.prototype = osg.objectInehrit(osg.Object.prototype, {
    setQuaternion: function(q) { osg.Quat.copy(q, this._quaternion); },
    setTarget: function(target) { this._target = target; },
    getTarget: function() { return this._target; },
    update: function() {
        if (this._target !== undefined) {
            osg.Quat.copy(this._target.getValue(), this._quaternion);
        }
    },
    getOrCreateTarget: function() {
        if (!this._target) {
            this._target = new osgAnimation.QuatTarget(this._quaternion);
        }
        return this._target;
    },
    applyToMatrix: function(m) {
        var mtmp = this._matrixTmp;
        osg.Matrix.setRotateFromQuat(mtmp, this._quaternion);
        osg.Matrix.preMult(m, mtmp);
    }
});
/** -*- compile-command: "jslint-cli Target.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  Target keep internal data of element to animate, and some function to merge them
 *  @class Target
 */
osgAnimation.Target = function() {
    this._weight = 0;
    this._priorityWeight = 0;
    this._count = 0;
    this._lastPriority = 0;
    this._target = undefined;
};

osgAnimation.Target.prototype = {
    reset: function() { this._weight = 0; this._priorityWeight = 0; },
    getValue: function() { return this._target; }
};

osgAnimation.Vec3Target = function() {
    osgAnimation.Target.call(this);
    this._target = [0 ,0, 0];
};
osgAnimation.Vec3Target.prototype = osg.objectInehrit(osgAnimation.Target.prototype, {
    update: function(weight, val, priority) {
        if (this._weight || this._priorityWeight) {

            if (this._lastPriority != priority) {
                // change in priority
                // add to weight with the same previous priority cumulated weight
                this._weight += this._priorityWeight * (1.0 - this._weight);
                this._priorityWeight = 0;
                this._lastPriority = priority;
            }

            this._priorityWeight += weight;
            t = (1.0 - this._weight) * weight / this._priorityWeight;
            osg.Vec3.lerp(t, this._target, val, this._target);
        } else {

            this._priorityWeight = weight;
            this._lastPriority = priority;
            osg.Vec3.copy(val, this._target);
        }
    }
});



osgAnimation.FloatTarget = function(value) {
    osgAnimation.Target.call(this);
    this._target = [value];
};

osgAnimation.FloatTarget.prototype = osg.objectInehrit(osgAnimation.Target.prototype, {
    update: function(weight, val, priority) {
        if (this._weight || this._priorityWeight) {

            if (this._lastPriority != priority) {
                // change in priority
                // add to weight with the same previous priority cumulated weight
                this._weight += this._priorityWeight * (1.0 - this._weight);
                this._priorityWeight = 0;
                this._lastPriority = priority;
            }

            this._priorityWeight += weight;
            t = (1.0 - this._weight) * weight / this._priorityWeight;
            this._target += (val - this._target)*t;
        } else {

            this._priorityWeight = weight;
            this._lastPriority = priority;
            this._target = val;
        }
    }
});




osgAnimation.QuatTarget = function() {
    osgAnimation.Target.call(this);
    this._target = [];
    osg.Quat.makeIdentity(this._target);
};
osgAnimation.QuatTarget.prototype = osg.objectInehrit(osgAnimation.Target.prototype, {
    update: function(weight, val, priority) {
        if (this._weight || this._priorityWeight) {

            if (this._lastPriority != priority) {
                // change in priority
                // add to weight with the same previous priority cumulated weight
                this._weight += this._priorityWeight * (1.0 - this._weight);
                this._priorityWeight = 0;
                this._lastPriority = priority;
            }

            this._priorityWeight += weight;
            t = (1.0 - this._weight) * weight / this._priorityWeight;
            osg.Quat.lerp(t, this._target, val, this._target);
            osg.Quat.normalize(this._target, this._target);

        } else {

            this._priorityWeight = weight;
            this._lastPriority = priority;
            osg.Quat.copy(val, this._target);
        }
    }
});
/** -*- compile-command: "jslint-cli UpdateCallback.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  AnimationUpdateCallback
 *  @class AnimationUpdateCallback
 */
osgAnimation.AnimationUpdateCallback = function () {};

/** @lends osgAnimation.AnimationUpdateCallback.prototype */
osgAnimation.AnimationUpdateCallback.prototype = osg.objectInehrit(osg.Object.prototype, {
    
    linkChannel: function() {},
    linkAnimation: function(anim) {
        var name = this.getName();
        if (name.length === 0) {
            osg.log("no name on an update callback, discard");
            return 0;
        }
        var nbLinks = 0;
        var channels = anim.getChannels();
        for (var i = 0, l = channels.length; i < l; i++) {
            var channel = channels[i];
            if (channel.getTargetName() === name) {
                this.linkChannel(channel);
                nbLinks++;
            }
        }
        return nbLinks;
    }
});/** -*- compile-command: "jslint-cli UpdateMatrixTransform.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */


/** 
 *  UpdateMatrixTransform
 *  @class UpdateMatrixTransform
 */
osgAnimation.UpdateMatrixTransform = function () {
    osgAnimation.AnimationUpdateCallback.call(this);
    this._stackedTransforms = [];
};

/** @lends osgAnimation.AnimationUpdateCallback.prototype */
osgAnimation.UpdateMatrixTransform.prototype = osg.objectInehrit(osgAnimation.AnimationUpdateCallback.prototype, {
    getStackedTransforms: function() { return this._stackedTransforms; },
    update: function(node, nv) {

        // not optimized, we could avoid operation the animation did not change
        // the content of the transform element
        var matrix = node.getMatrix();
        osg.Matrix.makeIdentity(matrix);
        var transforms = this._stackedTransforms;
        for (var i = 0, l = transforms.length; i < l; i++) {
            var transform = transforms[i];
            transform.update();
            transform.applyToMatrix(matrix);
        }
        return true;
    },
    linkChannel: function(channel) {
        var channelName = channel.getName();
        var transforms = this._stackedTransforms;
        for (var i = 0, l = transforms.length; i < l; i++) {
            var transform = transforms[i];
            var elementName = transform.getName();
            if (channelName.length > 0 && elementName === channelName) {
                var target = transform.getOrCreateTarget();
                if (target) {
                    channel.setTarget(target);
                    return true;
                }
            }
        }
        osg.log("can't link channel " + channelName + ", does not contain a symbolic name that can be linked to TransformElements");
    }

});/** -*- compile-command: "jslint-cli osgUtil.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

var osgUtil = {};
/** -*- compile-command: "jslint-cli TriangleIntersect.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

osgUtil.TriangleHit = function (index, normal, r1, v1, r2, v2, r3, v3) {
    this.index = index;
    this.normal = normal;
    this.r1 = r1;
    this.v1 = v1;
    this.r2 = r2;
    this.v2 = v2;
    this.r3 = r3;
    this.v3 = v3;
};

osgUtil.TriangleIntersect = function()
{
    this.hits = [];
    this.nodePath = [];
};

osgUtil.TriangleIntersect.prototype = {
    setNodePath: function(np) { this.nodePath = np; },
    set: function(start, end) {
        this.start = start;
        this.end = end;
        this.dir = osg.Vec3.sub(end, start, []);
        this.length = osg.Vec3.length(this.dir);
        var l = 1.0/this.length;
        osg.Vec3.mult(this.dir, l, this.dir);
    },

    applyDrawElementsTriangles: function(count, vertexes, indexes) {
        var v0 = [];
        var v1 = [];
        var v2 = [];
        
        var idx0, idx1, idx2;
        for ( var idx = 0; idx < count; idx+= 3) {
            idx0 = indexes[idx]*3;
            v0[0] = vertexes[idx0];
            v0[1] = vertexes[idx0+1];
            v0[2] = vertexes[idx0+2];

            idx1 = indexes[idx+1]*3;
            v1[0] = vertexes[idx1];
            v1[1] = vertexes[idx1 +1];
            v1[2] = vertexes[idx1 +2];

            idx2 = indexes[idx+2]*3;
            v2[0] = vertexes[idx2];
            v2[1] = vertexes[idx2 +1];
            v2[2] = vertexes[idx2 +2];
            this.intersect(v0, v1, v2);
        }
    },

    applyDrawElementsTriangleStrip: function(count, vertexes, indexes) {
        var v0 = [];
        var v1 = [];
        var v2 = [];

        var idx0, idx1, idx2;
        for ( var i = 2, idx = 0; i < count; i++, idx++) {
            if (i % 2) {
                idx0 = indexes[idx]*3;
                idx1 = indexes[idx+2]*3;
                idx2 = indexes[idx+1]*3;
            } else {
                idx0 = indexes[idx]*3;
                idx1 = indexes[idx+1]*3;
                idx2 = indexes[idx+2]*3;
            }
            v0[0] = vertexes[idx0];
            v0[1] = vertexes[idx0+1];
            v0[2] = vertexes[idx0+2];

            v1[0] = vertexes[idx1];
            v1[1] = vertexes[idx1 +1];
            v1[2] = vertexes[idx1 +2];

            v2[0] = vertexes[idx2];
            v2[1] = vertexes[idx2 +1];
            v2[2] = vertexes[idx2 +2];
            this.intersect(v0, v1, v2);
        }
    },

    applyDrawElementsTriangleFan: function(count, vertexes, indexes ) {
        var v0 = [];
        var v1 = [];
        var v2 = [];

        var idx0 = indexes[0]*3;
        v0[0] = vertexes[idx0];
        v0[1] = vertexes[idx0+1];
        v0[2] = vertexes[idx0+2];

        var idx1, idx2;
        for ( var i = 2, idx = 1; i < count; i++, idx++) {
            idx1 = indexes[idx]*3;
            idx2 = indexes[idx+1]*3;

            v1[0] = vertexes[idx1];
            v1[1] = vertexes[idx1 +1];
            v1[2] = vertexes[idx1 +2];

            v2[0] = vertexes[idx2];
            v2[1] = vertexes[idx2 +1];
            v2[2] = vertexes[idx2 +2];
            this.intersect(v0, v1, v2);
        }
    },

    applyDrawArraysTriangles: function(first, count, vertexes) {
        var v0 = [];
        var v1 = [];
        var v2 = [];

        for (var idx = first; idx < count; idx+= 9) {
            v0[0] = vertexes[idx];
            v0[1] = vertexes[idx+1];
            v0[2] = vertexes[idx+2];

            v1[0] = vertexes[idx+3];
            v1[1] = vertexes[idx+4];
            v1[2] = vertexes[idx+5];

            v2[0] = vertexes[idx+6];
            v2[1] = vertexes[idx+7];
            v2[2] = vertexes[idx+8];
            this.intersect(v0, v1, v2);
        }
    },

    applyDrawArraysTriangleStrip: function(first, count, vertexes) {
        var v0 = [];
        var v1 = [];
        var v2 = [];

        var idx0, idx1, idx2;
        for (var i = 2, idx = first; i < count; i++, idx++) {
            if (i % 2) {
                idx0 = idx*3;
                idx1 = (idx+2)*3;
                idx2 = (idx+1)*3;
            } else {
                idx0 = idx*3;
                idx1 = (idx+1)*3;
                idx2 = (idx+2)*3;
            }
            v0[0] = vertexes[idx0];
            v0[1] = vertexes[idx0+1];
            v0[2] = vertexes[idx0+2];

            v1[0] = vertexes[idx1];
            v1[1] = vertexes[idx1+1];
            v1[2] = vertexes[idx1+2];

            v2[0] = vertexes[idx2];
            v2[1] = vertexes[idx2+1];
            v2[2] = vertexes[idx2+2];
            this.intersect(v0, v1, v2);
        }
    },

    applyDrawArraysTriangleFan: function(first, count, vertexes) {
        var v0 = [];
        var v1 = [];
        var v2 = [];

        var idx0 = first*3;
        v0[0] = vertexes[idx0];
        v0[1] = vertexes[idx0+1];
        v0[2] = vertexes[idx0+2];

        var idx1, idx2;
        for ( var i = 2, idx = first+1; i < count; i++, idx++) {
            idx1 = idx*3;
            idx2 = (idx+1)*3;

            v1[0] = vertexes[idx1];
            v1[1] = vertexes[idx1 +1];
            v1[2] = vertexes[idx1 +2];

            v2[0] = vertexes[idx2];
            v2[1] = vertexes[idx2 +1];
            v2[2] = vertexes[idx2 +2];
            this.intersect(v0, v1, v2);
        }
    },

    apply: function(node) {
        if (!node.getAttributes().Vertex) {
            return;
        }
        var primitive;
        var lastIndex;
        var vertexes = node.getAttributes().Vertex.getElements();
        this.index = 0;
        for (var i = 0, l = node.primitives.length; i < l; i++) {
            primitive = node.primitives[i];
            if (primitive.getIndices !== undefined) {
                var indexes = primitive.indices.getElements();
                switch(primitive.getMode()) {
                case gl.TRIANGLES:
                    this.applyDrawElementsTriangles(primitive.getCount(), vertexes, indexes);
                    break;
                case gl.TRIANGLE_STRIP:
                    this.applyDrawElementsTriangleStrip(primitive.getCount(), vertexes, indexes);
                    break;
                case gl.TRIANGLE_FAN:
                    this.applyDrawElementsTriangleFan(primitive.getCount(), vertexes, indexes);
                    break;
                }
            } else { // draw array
                switch(primitive.getMode()) {
                case gl.TRIANGLES:
                    this.applyDrawArraysTriangles(primitive.getFirst(), primitive.getCount(), vertexes);
                    break;
                case gl.TRIANGLE_STRIP:
                    this.applyDrawArraysTriangleStrip(primitive.getFirst(), primitive.getCount(), vertexes);
                    break;
                case gl.TRIANGLE_FAN:
                    this.applyDrawArraysTriangleFan(primitive.getFirst(), primitive.getCount(), vertexes);
                    break;
                }
            }
        }

    },

    intersect: function(v1, v2, v3) {
        this.index++;

        if (v1==v2 || v2==v3 || v1==v3) { return;}

        var v12 = osg.Vec3.sub(v2,v1, []);
        var n12 = osg.Vec3.cross(v12, this.dir, []);
        var ds12 = osg.Vec3.dot(osg.Vec3.sub(this.start,v1,[]),n12);
        var d312 = osg.Vec3.dot(osg.Vec3.sub(v3,v1,[]),n12);
        if (d312>=0.0)
        {
            if (ds12<0.0) { return;}
            if (ds12>d312) { return;}
        }
        else                     // d312 < 0
        {
            if (ds12>0.0) { return;}
            if (ds12<d312) { return;}
        }

        var v23 = osg.Vec3.sub(v3,v2, []);
        var n23 = osg.Vec3.cross(v23,this.dir, []);
        var ds23 = osg.Vec3.dot(osg.Vec3.sub(this.start,v2, []),n23);
        var d123 = osg.Vec3.dot(osg.Vec3.sub(v1,v2, []),n23);
        if (d123>=0.0)
        {
            if (ds23<0.0) {return;}
            if (ds23>d123) { return;}
        }
        else                     // d123 < 0
        {
            if (ds23>0.0) {return;}
            if (ds23<d123) {return; }
        }

        var v31 = osg.Vec3.sub(v1,v3, []);
        var n31 = osg.Vec3.cross(v31,this.dir, []);
        var ds31 = osg.Vec3.dot(osg.Vec3.sub(this.start,v3, []),n31);
        var d231 = osg.Vec3.dot(osg.Vec3.sub(v2,v3, []),n31);
        if (d231>=0.0)
        {
            if (ds31<0.0) {return;}
            if (ds31>d231) {return;}
        }
        else                     // d231 < 0
        {
            if (ds31>0.0) {return;}
            if (ds31<d231) {return;}
        }
        

        var r3;
        if (ds12 === 0.0) { r3 = 0.0;}
        else if (d312 !== 0.0) { r3 = ds12/d312; }
        else {return;} // the triangle and the line must be parallel intersection.
        
        var r1;
        if (ds23 === 0.0) { r1 = 0.0;}
        else if (d123 !== 0.0) {r1 = ds23/d123;}
        else {return;} // the triangle and the line must be parallel intersection.
        
        var r2;
        if (ds31 === 0.0) {r2=0.0;}
        else if (d231 !== 0.0) {r2 = ds31/d231; }
        else {return;} // the triangle and the line must be parallel intersection.

        var total_r = (r1+r2+r3);
        if (total_r !== 1.0)
        {
            if (total_r === 0.0) {return;} // the triangle and the line must be parallel intersection.
            var inv_total_r = 1.0/total_r;
            r1 *= inv_total_r;
            r2 *= inv_total_r;
            r3 *= inv_total_r;
        }
        
        var inside = [];
        osg.Vec3.add(osg.Vec3.mult(v1,r1, []),  
                     osg.Vec3.mult(v2,r2, []), 
                     inside);
        osg.Vec3.add(osg.Vec3.mult(v3,r3, []), 
                     inside, 
                     inside);
        if (!osg.Vec3.valid(inside)) {
            osg.log("Warning: TriangleIntersect ");
            osg.log("hit:     " + inside );
            osg.log("         " + v1);
            osg.log("         " + v2);
            osg.log("         " + v3);
            return;
        }

        var d = osg.Vec3.dot(osg.Vec3.sub(inside,
                                          this.start, 
                                          []), this.dir);

        if (d<0.0) {return;}
        if (d>this.length) {return;}

        var normal = osg.Vec3.cross(v12,v23, []);
        osg.Vec3.normalize(normal, normal);

        var r = d/this.length;

        var pnt = [];
        pnt[0] = this.start[0] * (1.0-r)+  this.end[0]*r;
        pnt[1] = this.start[1] * (1.0-r)+  this.end[1]*r;
        pnt[2] = this.start[2] * (1.0-r)+  this.end[2]*r;

        this.hits.push({ 'ratio': r,
                         'nodepath': this.nodePath.slice(0),
                         'triangleHit': new osgUtil.TriangleHit(this.index-1, normal, r1, v1, r2, v2, r3, v3),
                         'point': pnt
                         
                       });
        this.hit = true;
    }
};
/** -*- compile-command: "jslint-cli IntersectVisitor.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

osgUtil.IntersectVisitor = function() {
    osg.NodeVisitor.call(this);
    this.matrix = [];
    this.hits = [];
    this.nodePath = [];
};
osgUtil.IntersectVisitor.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {
    addLineSegment: function(start, end) {
        this.start = start;
        this.end = end;
    },
    intersectSegmentWithSphere: function(start, end, bsphere) {
        var sm = osg.Vec3.sub(start, bsphere.center);
        var c = osg.Vec3.length2(sm) - bsphere.radius * bsphere.radius;
        if (c < 0.0) {
            return true;
        }
        
        var se = osg.Vec3.sub(end, start);
        var a = osg.Vec3.length2(se);
        var b = osg.Vec3.dot(sm, se) * 2.0;
        var d = b*b - 4.0 * a * c;
        if (d < 0.0) {
            return false;
        }

        d = Math.sqrt(d);
        var div = 1.0/2.0 * a;
        var r1 = (-b-d)*div;
        var r2 = (-b+d)*div;

        if (r1 <= 0.0 && r2 <= 0.0) {
            return false;
        }

        if (r1 >= 1.0 && r2 >= 1.0) {
            return false;
        }
        return true;
    },
    pushModelMatrix: function(matrix) {
        if (this.matrix.length > 0 ) {
            var m = osg.Matrix.copy(this.matrix[this.matrix.length-1]);
            osg.Matrix.preMult(m, matrix);
            this.matrix.push(m);
        } else {
            this.matrix.push(matrix);
        }
    },
    getModelMatrix: function() {
        if (this.matrix.length ===0 ) {
            return osg.Matrix.makeIdentity([]);
        }
        return this.matrix[this.matrix.length-1];
    },
    popModelMatrix: function() { return this.matrix.pop(); },
    getWindowMatrix: function() { return this.windowMatrix;},
    getProjectionMatrix: function() { return this.projectionMatrix;},
    getViewMatrix: function() { return this.viewMatrix;},
    intersectSegmentWithGeometry: function(start, end, geometry) {
        ti = new osgUtil.TriangleIntersect();
        ti.setNodePath(this.nodePath);
        ti.set(start, end);
        ti.apply(geometry);
        var l = ti.hits.length;
        if (l > 0) {
            for (var i = 0; i < l; i++) {
                this.hits.push( ti.hits[i]);
            }
            return true;
        }
        return false;
    },
    pushCamera: function(camera) {
        // we should support hierarchy of camera
        // but right now we want just simple picking on main
        // camera
        this.projectionMatrix = camera.getProjectionMatrix();
        this.viewMatrix = camera.getViewMatrix();

        var vp = camera.getViewport();
        if (vp !== undefined) {
            this.windowMatrix = vp.computeWindowMatrix();
        }
    },
    applyCamera: function(camera) {
        // we should support hierarchy of camera
        // but right now we want just simple picking on main
        // camera
        this.pushCamera(camera);
        this.traverse(camera);
    },

    applyNode: function(node) {
        if (node.getMatrix) {
            this.pushModelMatrix(node.getMatrix());
        }

        if (node.primitives) {
            var matrix = [];
            osg.Matrix.copy(this.getWindowMatrix(), matrix);
            osg.Matrix.preMult(matrix, this.getProjectionMatrix());
            osg.Matrix.preMult(matrix, this.getViewMatrix());
            osg.Matrix.preMult(matrix, this.getModelMatrix());
            
            var inv = [];
            var valid = osg.Matrix.inverse(matrix, inv);
            // if matrix is invalid do nothing on this node
            if (!valid) {
                return;
            }

            var ns = osg.Matrix.transformVec3(inv, this.start, new Array(3));
            var ne = osg.Matrix.transformVec3(inv, this.end, new Array(3));
            this.intersectSegmentWithGeometry(ns, ne, node);
        }

        if (node.traverse) {
            this.traverse(node);
        }

        if (node.getMatrix) {
            this.popModelMatrix();
        }
    },

    apply: function(node) {
        if (this.enterNode(node) === false) {
            return;
        }

        if (node.getViewMatrix) { // Camera/View
            this.applyCamera(node);
        } else {
            this.applyNode(node);
        }
    },

    enterNode: function(node) {
        var bsphere = node.boundingSphere;
        if (bsphere !== undefined ) {
            if (!this.intersectSegmentWithSphere) {
                return false;
            }
        }
        return true;
    }
});
/** -*- compile-command: "jslint-cli ShaderParameterVisitor.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

(function() {

    var ArraySlider = function(params) {
        if (params !== undefined) {
            if (params.object !== undefined && params.field !== undefined) {
                this.createInternalSlider(param);
            }
            this._uniform = this.createInternalSliderUniform(param);
        }
    };

    ArraySlider.prototype = {
        setTargetHTML: function(target) {
            this.parent = target;
        },
        addToDom: function(content) {
            var mydiv = document.createElement('div');
            mydiv.innerHTML = content;
            this.parent.appendChild(mydiv);
        },

        getValue: function(name) {
            if (window.localStorage) {
                var value = window.localStorage.getItem(name);
                return value;
            }
            return null;
        },
        setValue: function(name, value) {
            if (window.localStorage) {
                window.localStorage.setItem(name, value);
            }
        },
        createHTMLSlider: function(param, value, nameIndex, cbnameIndex) {
            var input = '<div>NAME [ MIN - MAX ] <input type="range" min="MIN" max="MAX" value="VALUE" step="STEP" onchange="ONCHANGE" /><span id="UPDATE"></span></div>';
            var min = param.min;
            var max = param.max;
            var step = param.step;
            var name = nameIndex;
            var cbname = cbnameIndex;
            var onchange = cbname + '(this.value)';
            input = input.replace(/MIN/g, min);
            input = input.replace(/MAX/g, (max+step));
            input = input.replace('STEP', step);
            input = input.replace('VALUE', value);
            input = input.replace(/NAME/g, name);
            input = input.replace(/UPDATE/g, cbname);
            input = input.replace('ONCHANGE', onchange);
            return input;
        },

        createUniformFunction: function(param, name, index, uniform, cbnameIndex) {
            self = this;
            return (function() {
                var cname = name;
                var cindex = index;
                var cuniform = uniform;
                var id = cbnameIndex;
                var func = function(value) {
                    cuniform.get()[cindex] = value;
                    cuniform.dirty();
                    osg.debug(cname + ' value ' + value);
                    document.getElementById(cbnameIndex).innerHTML = Number(value).toFixed(4);
                    self.setValue(id, value);
                    if (param.onchange !== undefined) {
                        param.onchange(cuniform.get());
                    }
                    // store the value to localstorage
                };
                return func;
            })();
        },

        createFunction: function(param, name, index, object, field, cbnameIndex) {
            self = this;
            return (function() {
                var cname = name;
                var cindex = index;
                var cfield = field;
                var id = cbnameIndex;
                var obj = object;
                var func = function(value) {
                    if (typeof(value) === 'string') {
                        value = parseFloat(value);
                    }

                    if (typeof(object[cfield]) === 'number') {
                        obj[cfield] = value;
                    } else {
                        obj[cfield][index] = value;
                    }
                    osg.debug(cname + ' value ' + value);
                    document.getElementById(cbnameIndex).innerHTML = Number(value).toFixed(4);
                    self.setValue(id, value);
                    if (param.onchange !== undefined) {
                        param.onchange(obj[cfield]);
                    }

                    // store the value to localstorage
                };
                return func;
            })();
        },

        getCallbackName: function(name, prgId) {
            return 'change_'+prgId+"_"+name;
        },

        copyDefaultValue: function(param) {
            var uvalue = param.value;
            if (Array.isArray(param.value)) {
                uvalue = param.value.slice();
            } else {
                uvalue = [uvalue];
            }
            return uvalue;
        },

        createInternalSliderUniform: function(param) {
            var uvalue = param.value;
            var uniform = param.uniform;
            if (uniform === undefined) {
                var type = param.type;
                type = type.charAt(0).toUpperCase() + type.slice(1);
                uniform = osg.Uniform["create"+type](uvalue, param.name);
            }

            var cbname = this.getCallbackName(param.name, param.id);
            var dim = uvalue.length;
            for (var i = 0; i < dim; i++) {

                var istring = i.toString();
                var nameIndex = param.name + istring;
                var cbnameIndex = cbname+istring;

                // default value
                var value = uvalue[i];

                // read local storage value if it exist
                var readValue = this.getValue(cbnameIndex);
                if (readValue !== null) {
                    value = readValue;
                } else if (param.uniform && param.uniform.get()[i] !== undefined) {
                    // read value from original uniform
                    value = param.uniform.get()[i];
                }

                var dom = this.createHTMLSlider(param, value, nameIndex, cbnameIndex);
                this.addToDom(dom);
                window[cbnameIndex] = this.createUniformFunction(param, nameIndex, i, uniform, cbnameIndex);
                osg.log(nameIndex + " " + value);
                window[cbnameIndex](value);
            }
            this.uniform = uniform;
            return uniform;
        },

        createInternalSlider: function(param) {
            var uvalue = param.value;
            var name = param.name;
            var id = param.id;
            var dim = uvalue.length;
            var cbname = this.getCallbackName(name, id);
            var object = param.object;
            var field = param.field;
            for (var i = 0; i < dim; i++) {

                var istring = i.toString();
                var nameIndex = name + istring;
                var cbnameIndex = cbname+istring;

                // default value
                var value = uvalue[i];

                // read local storage value if it exist
                var readValue = this.getValue(cbnameIndex);
                if (readValue !== null) {
                    value = readValue;
                } else {
                    if (typeof object[field] === 'number') {
                        value = object[field];
                    } else {
                        value = object[field][i];
                    }
                }

                var dom = this.createHTMLSlider(param, value, nameIndex, cbnameIndex);
                this.addToDom(dom);
                window[cbnameIndex] = this.createFunction(param, nameIndex, i, object, field, cbnameIndex);
                osg.log(nameIndex + " " + value);
                window[cbnameIndex](value);
            }
        },

        createSlider: function(param) {
            if (param.html !== undefined) {
                this.setTargetHTML(param.html);
            }
            if (param.id === undefined) {
                param.id = param.name;
            }
            param.value = this.copyDefaultValue(param);
            if (param.type !== undefined) {
                return this.createInternalSliderUniform(param);
            } else {
                if (param.object === undefined) {
                    param.object = {'data': param.value };
                    param.field = 'data';
                }
                return this.createInternalSlider(param);
            }
        }
    };


osgUtil.ParameterVisitor = function() {
    osg.NodeVisitor.call(this);

    this.arraySlider = new ArraySlider();
    this.setTargetHTML(document.body);
};

osgUtil.ParameterVisitor.createSlider = function(param) {
    (new ArraySlider()).createSlider(param);
};

osgUtil.ParameterVisitor.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {

    setTargetHTML: function(html) {
        this.targetHTML = html;
        this.arraySlider.setTargetHTML(this.targetHTML);
    },

    getUniformList: function(str, map) {

      //var txt='uniform float Power; // { min: 0.1, max: 2.0, step: 0.1, value: [0,0,0]  }';

      var re1='(uniform)';	// Word 1
      var re2='.*?';	// Non-greedy match on filler
      var re3='((?:[a-z][a-z]+))';	// Word 2
      var re4='.*?';	// Non-greedy match on filler
      var re5='((?:[a-z][a-z]+))';	// Word 3
      var re6='.*?';	// Non-greedy match on filler
      var re7='.';	// Uninteresting: c
      var re8='.*?';	// Non-greedy match on filler
      var re9='.';	// Uninteresting: c
      var re10='.*?';	// Non-greedy match on filler
      var re11='(.)';	// Any Single Character 1
      var re12='(.)';	// Any Single Character 2
      var re13='.*?';	// Non-greedy match on filler
      var re14='(\\{.*?\\})';	// Curly Braces 1

      var p = new RegExp(re1+re2+re3+re4+re5+re6+re7+re8+re9+re10+re11+re12+re13+re14,["g"]);
        var r = str.match(p);
        var list = map;
        if (r !== null) {
            var re = new RegExp(re1+re2+re3+re4+re5+re6+re7+re8+re9+re10+re11+re12+re13+re14,["i"]);
            for (var i = 0, l = r.length; i < l; i++) {
                var result = r[i].match(re);
                //var result = p.exec(str);
                if (result !== null) {
                    var word1=result[1];
                    var type=result[2];
                    var name=result[3];
                    var c1=result[4];
                    var c2=result[5];
                    var json=result[6];
                    
                    var param = JSON.parse(json);
                    param.type = type;
                    param.name = name;
                    var value = param.value;
                    param.value = function() { return value; };
                    list[name] = param;
                }
            }
        }
        return list;
    },

    getUniformFromStateSet: function(stateSet, uniformMap) {
        var maps = stateSet.getUniformList();
        if (!maps) {
            return;
        }
        var keys = Object.keys(uniformMap);
        for (var i = 0, l = keys.length; i < l; i++) {
            var k = keys[i];
            // get the first one found in the tree
            if (maps[k] !== undefined && uniformMap[k].uniform === undefined) {
                uniformMap[k].uniform = maps[k].object;
            }
        }
    },
    
    findExistingUniform: function(node, uniformMap) {
        var BackVisitor = function() { osg.NodeVisitor.call(this, osg.NodeVisitor.TRAVERSE_PARENTS); };
        BackVisitor.prototype = osg.objectInehrit(osg.NodeVisitor.prototype, {
            setUniformMap: function(map) { this.uniformMap = map; },
            apply: function(node) {
                var stateSet = node.getStateSet();
                if (stateSet) {
                    osgUtil.ParameterVisitor.prototype.getUniformFromStateSet(stateSet, this.uniformMap);
                }
                this.traverse(node);
            }
        });
        var visitor = new BackVisitor();
        visitor.setUniformMap(uniformMap);
        node.accept(visitor);
    },

    applyProgram: function(node, stateset) {
        var program = stateset.getAttribute('Program');
        var programName = program.getName();
        var string = program.getVertexShader().getText();
        var uniformMap = {};
        this.getUniformList(program.getVertexShader().getText(), uniformMap);
        this.getUniformList(program.getFragmentShader().getText(), uniformMap);


        var keys = Object.keys(uniformMap);

        if (programName === undefined) {
            var hashCode = function(str) {
                var hash = 0;
                var chara = 0;
                if (str.length === 0) {
                    return hash;
                }
                for (i = 0; i < str.length; i++) {
                    chara = str.charCodeAt(i);
                    hash = ((hash<<5)-hash)+chara;
                    hash = hash & hash; // Convert to 32bit integer
                }
                if (hash < 0) {
                    hash = -hash;
                }
                return hash;
            };
            var str = keys.join('');
            programName = hashCode(str).toString();
        }

        this.findExistingUniform(node, uniformMap);

        var addedSlider = false;
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var entry = uniformMap[k];
            var type = entry.type;
            var name = entry.name;
            entry.id = programName;
            var uniform = this.arraySlider.createSlider(entry);
            if (false) {
                var uniform = this.arraySlider.createSlider(
                    { name: name,
                      type: type,
                      id: programName,
                      uniform: entry.uniform
                    }
                );
            }
            if (entry.uniform === undefined && uniform) {
                stateset.addUniform(uniform);
            }
            addedSlider = true;
        }

        // add a separator
        if (addedSlider) {
            var mydiv = document.createElement('div');
            mydiv.innerHTML = "<p> </p>";
            this.targetHTML.appendChild(mydiv);
        }

        osg.log(uniformMap);
    },


    applyStateSet: function(node, stateset) {
        if (stateset.getAttribute('Program') !== undefined) {
            this.applyProgram(node, stateset);
        }
    },

    apply: function(node) {
        var element = this.targetHTML;
        if (element === undefined || element === null) {
            return;
        }

        var st = node.getStateSet();
        if (st !== undefined) {
            this.applyStateSet(node, st);
        }

        this.traverse(node);
    }
});

})();/*
  Composer is an helper to create post fx. The idea is to push one or more textures into a pipe of shader filter.
  
  how to use it:

  // example how to blur a texture and render it to screen
  var myTexture; // imagine it's your texture you want to process
  var composer = new osgUtil.Composer();
  composer.addPass(new osgUtil.Composer.Filter.InputTexture(myTexture));
  composer.addPass(new osgUtil.Composer.Filter.HBlur(5));
  composer.addPass(new osgUtil.Composer.Filter.VBlur(5));
  composer.renderToScreen(1200, 900);
  composer.build(); // if you dont build manually it will be done in the scenegraph while upading
  rootnode.addChild(composer);

  // now you can imagine to some process and use the result as input texture for a geometry
  var myTexture; // imagine it's your texture you want to process
  var myResultTexture = new osg.Texture(); // imagine it's your texture you want to process
  myResultTexture.setTextureSize(1200,900);
  var composer = new osgUtil.Composer();
  composer.addPass(new osgUtil.Composer.Filter.InputTexture(myTexture));
  composer.addPass(new osgUtil.Composer.Filter.HBlur(5));
  composer.addPass(new osgUtil.Composer.Filter.VBlur(5), resultTexture);

  myGeometry.getStateSet().setTextureAttributeAndModes(0, resultTexture);
  rootnode.addChild(composer);
   
 */
(function() {

    osgUtil.Composer = function() {
        osg.Node.call(this);
        this._stack = [];
        this._renderToScreen = false;
        this._dirty = false;
        var UpdateCallback = function() {

        };
        UpdateCallback.prototype = {
            update: function(node, nv) {
                if (node.isDirty()) {
                    node.build();
                }
            }
        };
        this.setUpdateCallback(new UpdateCallback());
        this.getOrCreateStateSet().setAttributeAndModes(new osg.Depth('DISABLE'));
    };

    osgUtil.Composer.prototype = osg.objectInehrit(osg.Node.prototype, {
        dirty: function() { 
            for (var i = 0, l = this._stack.length; i < l; i++) {
                this._stack[i].filter.dirty();
            }
        },

        // addPass support different signature
        // addPass(filter) -> the filter will be done on a texture of the same size than the previous pass
        // addPass(filter, textureWidth, textureHeight) -> the filter will be done on a texture width and height
        // addPass(filter, texture) -> the filter will be done on the giver texture using its width and height
        addPass: function(filter, arg0, arg1) {
            if (arg0 instanceof osg.Texture) {
                this._stack.push({ filter: filter, texture: arg0} );
            } else if ( arg0 !== undefined && arg1 !== undefined) {
                this._stack.push({ filter: filter, 
                                   width: Math.floor(arg0),
                                   height: Math.floor(arg1)
                                 } );
            } else {
                this._stack.push({ filter: filter });
            }
        },
        renderToScreen: function(w,h) {
            this._renderToScreen = true;
            this._renderToScreenWidth = w;
            this._renderToScreenHeight = h;
        },

        isDirty: function() {
            for (var i = 0, l = this._stack.length; i < l; i++) {
                if (this._stack[i].filter.isDirty()) {
                    return true;
                }
            }
            return false;
        },

        build: function() {
            var root = this;
            this.removeChildren();
            var lastTextureResult;
            var self = this;
            this._stack.forEach(function(element, i, array) {
                if (element.filter.isDirty()) {
                    element.filter.build();
                }
                var stateSet = element.filter.getStateSet();
                var w,h;
                if (element.texture !== undefined) {
                    w = element.texture.getWidth();
                    h = element.texture.getHeight();
                } else if ( element.width !== undefined && element.height !== undefined) {
                    w = element.width;
                    h = element.height;
                } else {
                    // get width from Texture0
                    var inputTexture = stateSet.getTextureAttribute(0, 'Texture');
                    if (inputTexture === undefined) {
                        osg.warn("osgComposer can't find any information to setup texture output size");
                    }
                    w = inputTexture.getWidth();
                    h = inputTexture.getHeight();
                }
                
                // check if we want to render on screen
                var camera = new osg.Camera();
                //camera.setClearMask(osg.Camera.COLOR_BUFFER_BIT);
                camera.setClearMask(0);

                var texture;
                var quad;
                if (true &&
                    i === array.length-1 &&
                    self._renderToScreen === true) {
                    w = self._renderToScreenWidth;
                    h = self._renderToScreenHeight;
                    //camera.setRenderOrder(osg.Camera.POST_RENDER, 0);
                } else {
                    camera.setRenderOrder(osg.Camera.PRE_RENDER, 0);
                    texture = element.texture;
                    if (texture === undefined) {
                        texture = new osg.Texture();
                        texture.setTextureSize(w,h);
                    }
                    camera.attachTexture(osg.FrameBufferObject.COLOR_ATTACHMENT0, texture, 0);
                }

                var vp = new osg.Viewport(0,0,w,h);
                var projection = osg.Matrix.makeOrtho(-w/2,w/2,-h/2,h/2,-5,5, []);
                camera.setReferenceFrame(osg.Transform.ABSOLUTE_RF);
                camera.setViewport(vp);
                camera.setProjectionMatrix(projection);
                camera.setStateSet(element.filter.getStateSet());

                quad = osg.createTexturedQuadGeometry(-w/2, -h/2, 0,
                                                      w, 0, 0,
                                                      0, h, 0);

                if (element.filter.buildGeometry !== undefined)
                    quad = element.filter.buildGeometry(quad);

                quad.setName("composer layer");
                //camera.setComputeNearFar(false);

                lastTextureResult = texture;

                // assign the result texture to the next stateset
                if (i+1 < array.length) {
                    array[i+1].filter.getStateSet().setTextureAttributeAndModes(0, lastTextureResult);
                }

                camera.addChild(quad);
                element.filter.getStateSet().addUniform(osg.Uniform.createFloat2([w,h],'RenderSize'));
                camera.setName("Composer Pass" + i);
                root.addChild(camera);
            });
            this._resultTexture = lastTextureResult;
        }
    });

    osgUtil.Composer.Filter = function() {
        this._stateSet = new osg.StateSet();
        this._dirty = true;
    };

    osgUtil.Composer.Filter.prototype = {
        getStateSet: function() { return this._stateSet;},
        dirty: function() { this._dirty = true;},
        isDirty: function() { return this._dirty;}
    };


    osgUtil.Composer.Filter.defaultVertexShader = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",
        "attribute vec3 Vertex;",
        "attribute vec2 TexCoord0;",
        "varying vec2 FragTexCoord0;",
        "uniform mat4 ModelViewMatrix;",
        "uniform mat4 ProjectionMatrix;",
        "void main(void) {",
        "  gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);",
        "  FragTexCoord0 = TexCoord0;",
        "}",
        ""
    ].join('\n');

    osgUtil.Composer.Filter.defaultFragmentShaderHeader = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",
        "varying vec2 FragTexCoord0;",
        "uniform vec2 RenderSize;",
        "uniform sampler2D Texture0;",
        ""
    ].join('\n');

    osgUtil.Composer.Filter.shaderUtils = [
        "vec4 packFloatTo4x8(in float v) {",
        "vec4 enc = vec4(1.0, 255.0, 65025.0, 160581375.0) * v;",
        "enc = fract(enc);",
        "enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);",
        "return enc;",
        "}",

        " ",
        "vec4 pack2FloatTo4x8(in vec2 val) {",
        " const vec2 bitSh = vec2(256.0, 1.0);",
        " const vec2 bitMsk = vec2(0.0, 1.0/256.0);",
        " vec2 res1 = fract(val.x * bitSh);",
        " res1 -= res1.xx * bitMsk;",
        " vec2 res2 = fract(val.y * bitSh);",
        " res2 -= res2.xx * bitMsk;",
        " return vec4(res1.x,res1.y,res2.x,res2.y);",
        "}",
        " ",
        "float unpack4x8ToFloat( vec4 rgba ) {",
        " return dot( rgba, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );",
        "}",
        " ",
        "vec2 unpack4x8To2Float(in vec4 val) {",
        " const vec2 unshift = vec2(1.0/256.0, 1.0);",
        " return vec2(dot(val.xy, unshift), dot(val.zw, unshift));",
        "}",

        "vec2 encodeNormal (vec3 n)",
        "{",
        "    float f = sqrt(8.0*n.z+8.0);",
        "    return n.xy / f + 0.5;",
        "}",

        "vec3 decodeNormal (vec2 enc)",
        "{",
        "    vec2 fenc = enc*4.0-2.0;",
        "    float f = dot(fenc,fenc);",
        "    float g = sqrt(1.0-f/4.0);",
        "    vec3 n;",
        "    n.xy = fenc*g;",
        "    n.z = 1.0-f/2.0;",
        "    return n;",
        "}",
        ""].join('\n');

    osgUtil.Composer.Filter.Helper = {
        getOrCreatePascalCoefficients: function() {
            var cache = osgUtil.Composer.Filter.Helper.getOrCreatePascalCoefficients.cache;
            if (cache !== undefined) {
                return cache;
            }

            cache = (function(kernelSize) {
                var pascalTriangle = [ [1] ];
                for (var j = 0; j < (kernelSize-1); j++) {
                    var sum = Math.pow(2,j);
                    var currentRow = pascalTriangle[j];
                    var currentRowSize = currentRow.length;

                    var nextRowSize = currentRowSize+1;
                    var nextRow = new Array(currentRowSize);
                    nextRow[0] = 1.0;
                    nextRow[nextRowSize-1] = 1.0;

                    var idx = 1;
                    for (var p = 0; p < currentRowSize-1; p++) {
                        var val = (currentRow[p]+currentRow[p+1]);
                        nextRow[idx++] = val;
                    }
                    pascalTriangle.push(nextRow);
                }

                // compute real coef dividing by sum
                (function() {
                    for (var a = 0; a < pascalTriangle.length; a++) {
                        var row = pascalTriangle[a];
                        //var str = "";
                        
                        var sum = Math.pow(2,a);
                        for (var i = 0; i < row.length; i++) {
                            row[i] = row[i]/sum;
                            //str += row[i].toString() + " ";
                        }
                        //console.log(str);
                    }
                })();

                return pascalTriangle;
            })(20);
            osgUtil.Composer.Filter.Helper.getOrCreatePascalCoefficients.cache = cache;
            return cache;
        }
    };



    osgUtil.Composer.Filter.Custom = function(fragmentShader, uniforms) {
        osgUtil.Composer.Filter.call(this);
        this._fragmentShader = fragmentShader;
        this._uniforms = uniforms;
        this._vertexShader = osgUtil.Composer.Filter.defaultVertexShader;
    };
    
    osgUtil.Composer.Filter.Custom.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        build: function() {
            
            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, this._vertexShader),
                new osg.Shader(gl.FRAGMENT_SHADER, this._fragmentShader));

            var self = this;
            if (this._uniforms) {
                var unitIndex = 0;

                var r = this._fragmentShader.match(/uniform\s+\w+\s+\w+/g);
                if (r !== null) {
                    for (var i = 0, l = r.length; i < l; i++) {
                        var match = r[i].match(/uniform\s+(\w+)\s+(\w+)/);
                        var uniform_type = match[1];
                        var uniform_name = match[2];
                        var uniform;

                        if (this._uniforms[uniform_name] !== undefined) {
                            uniform_value = this._uniforms[uniform_name];
                            if (uniform_type.search("sampler") !== -1) {
                                this._stateSet.setTextureAttributeAndModes(unitIndex, uniform_value);
                                uniform = osg.Uniform.createInt1(unitIndex, uniform_name);
                                unitIndex++;
                                this._stateSet.addUniform(uniform);
                            } else {
                                if (osg.Uniform.isUniform(uniform_value) ) {
                                    uniform = uniform_value;
                                } else {
                                    uniform = osg.Uniform[uniform_type](this._uniforms[uniform_name],uniform_name);
                                }
                                this._stateSet.addUniform(uniform);
                            }
                        }
                    }
                }
            }
            this._stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });



    osgUtil.Composer.Filter.AverageHBlur = function(nbSamplesOpt) {
        osgUtil.Composer.Filter.call(this);
        if (nbSamplesOpt === undefined) {
            this.setBlurSize(5);
        } else {
            this.setBlurSize(nbSamplesOpt);
        }
        this._pixelSize = 1.0;
    };
    
    osgUtil.Composer.Filter.AverageHBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        setBlurSize: function(nbSamples) {
            if (nbSamples%2 !== 1) {
                nbSamples+=1;
            }
            this._nbSamples = nbSamples;
            this.dirty();
        },
        setPixelSize: function(value) {
            this._pixelSize = value;
            this.dirty();
        },
        getUVOffset: function(value) {
            return "vec2(float("+value+"), 0.0)/RenderSize[0];";
        },
        getShaderBlurKernel: function() {
            var nbSamples = this._nbSamples;
            var kernel = [];
            kernel.push(" pixel = texture2D(Texture0, FragTexCoord0 );");
            kernel.push(" if (pixel.w == 0.0) { gl_FragColor = pixel; return; }");
            kernel.push(" vec2 offset;");
            for (var i = 1; i < Math.ceil(nbSamples/2); i++) {
                kernel.push(" offset = " + this.getUVOffset(i*this._pixelSize));
                kernel.push(" pixel += texture2D(Texture0, FragTexCoord0 + offset);");
                kernel.push(" pixel += texture2D(Texture0, FragTexCoord0 - offset);");
            }
            kernel.push(" pixel /= float(" + nbSamples + ");");
            return kernel;
        },
        build: function() {
            var nbSamples = this._nbSamples;
            var vtx = osgUtil.Composer.Filter.defaultVertexShader;
            var fgt = [
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform float width;",

                "void main (void)",
                "{",
                "  vec4 pixel;",
                this.getShaderBlurKernel().join('\n'),
                "  gl_FragColor = vec4(pixel);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vtx),
                new osg.Shader(gl.FRAGMENT_SHADER, fgt));

            if (this._stateSet.getUniform('Texture0') === undefined) {
                this._stateSet.addUniform(osg.Uniform.createInt1(0,'Texture0'));
            }
            this._stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });


    osgUtil.Composer.Filter.AverageVBlur = function(nbSamplesOpt) {
        osgUtil.Composer.Filter.AverageHBlur.call(this, nbSamplesOpt);
    };
    osgUtil.Composer.Filter.AverageVBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.AverageHBlur.prototype, {
        getUVOffset: function(value) {
            return "vec2(0.0, float("+value+"))/RenderSize[1];";
        }
    });


    osgUtil.Composer.Filter.BilateralHBlur = function(options) {
        osgUtil.Composer.Filter.call(this);

        if (options === undefined) {
            options = {};
        }

        var nbSamplesOpt = options.nbSamples;
        var depthTexture = options.depthTexture;
        var radius = options.radius;

        if (nbSamplesOpt === undefined) {
            this.setBlurSize(5);
        } else {
            this.setBlurSize(nbSamplesOpt);
        }
        this._depthTexture = depthTexture;
        this._radius = osg.Uniform.createFloat(1.0,'radius');
        this._pixelSize = osg.Uniform.createFloat(1.0,'pixelSize');
        this.setRadius(radius);
    };
    
    osgUtil.Composer.Filter.BilateralHBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        setBlurSize: function(nbSamples) {
            if (nbSamples%2 !== 1) {
                nbSamples+=1;
            }
            osg.log("BlurSize " + nbSamples);
            this._nbSamples = nbSamples;
            this.dirty();
        },
        setPixelSize: function(value) {
            this._pixelSize.get()[0] = value;
            this._pixelSize.dirty();
        },
        setRadius: function(radius) {
            this._radius.get()[0] = radius;// *2.0;
            this._radius.dirty();
        },
        getUVOffset: function(value) {
            return "vec2(0.0, float("+value+") * pixelSize )/RenderSize[1];";
        },
        getShaderBlurKernel: function() {
            var nbSamples = this._nbSamples;
            var kernel = [];
            kernel.push(" pixel = texture2D(Texture0, FragTexCoord0 );");
            kernel.push(" if (pixel.w <= 0.0001) { gl_FragColor = vec4(1.0); return; }");
            kernel.push(" vec2 offset, tmpUV;");
            kernel.push(" depth = getDepthValue(texture2D(Texture1, FragTexCoord0 ));");
            for (var i = 1; i < Math.ceil(nbSamples/2); i++) {
                kernel.push(" offset = " + this.getUVOffset(i) );

                kernel.push(" tmpUV =  FragTexCoord0 + offset;");
                kernel.push(" tmpDepth = getDepthValue(texture2D(Texture1, tmpUV ));");
                kernel.push(" if ( abs(depth-tmpDepth) < radius) {");
                kernel.push("   pixel += texture2D(Texture0, tmpUV);");
                kernel.push("   nbHits += 1.0;");
                kernel.push(" }");

                kernel.push(" tmpUV =  FragTexCoord0 - offset;");
                kernel.push(" tmpDepth = getDepthValue(texture2D(Texture1, tmpUV ));");
                kernel.push(" if ( abs(depth-tmpDepth) < radius) {");
                kernel.push("   pixel += texture2D(Texture0, tmpUV);");
                kernel.push("   nbHits += 1.0;");
                kernel.push(" }");
            }
            kernel.push(" pixel /= nbHits;");
            return kernel;
        },
        build: function() {
            var nbSamples = this._nbSamples;
            var vtx = osgUtil.Composer.Filter.defaultVertexShader;
            var fgt = [
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform sampler2D Texture1;",
                "uniform float width;",
                "uniform mat4 projection;",
                "uniform float radius;",
                "uniform float pixelSize;",

                "float znear,zfar,zrange;",
                "",
                osgUtil.Composer.Filter.shaderUtils,
                "",
                "float getDepthValue(vec4 v) {",
                "  float depth = unpack4x8ToFloat(v);",
                "  depth = depth*zrange+znear;",
                "  return -depth;",
                "}",

                "void main (void)",
                "{",
                "  vec4 pixel;",
                "  float depth, tmpDepth;",
                "  znear = projection[3][2] / (projection[2][2]-1.0);",
                "  zfar = projection[3][2] / (projection[2][2]+1.0);",
                "  zrange = zfar-znear;",
                "  float nbHits = 1.0;",

                this.getShaderBlurKernel().join('\n'),
                "  gl_FragColor = vec4(pixel);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vtx),
                new osg.Shader(gl.FRAGMENT_SHADER, fgt));

            if (this._stateSet.getUniform('Texture0') === undefined) {
                this._stateSet.addUniform(osg.Uniform.createInt1(0,'Texture0'));
            }
            if (this._stateSet.getUniform('Texture1') === undefined) {
                this._stateSet.addUniform(osg.Uniform.createInt1(1,'Texture1'));
            }
            this._stateSet.addUniform(this._radius);
            this._stateSet.addUniform(this._pixelSize);
            this._stateSet.setTextureAttributeAndModes(1, this._depthTexture);
            this._stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });


    osgUtil.Composer.Filter.BilateralVBlur = function(options) {
        osgUtil.Composer.Filter.BilateralHBlur.call(this, options);
    };
    
    osgUtil.Composer.Filter.BilateralVBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.BilateralHBlur.prototype, {
        getUVOffset: function(value) {
            return "vec2(float("+value+")*pixelSize,0.0)/RenderSize[0];";
        }
    });


    // InputTexture is a fake filter to setup the first texture
    // in the composer pipeline
    osgUtil.Composer.Filter.InputTexture = function(texture) {
        osgUtil.Composer.Filter.call(this);
        this._stateSet.setTextureAttributeAndModes(0, texture);
    };
    osgUtil.Composer.Filter.InputTexture.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        build: function() { this._dirty = false; }
    });



    // Operate a Gaussian horizontal blur
    osgUtil.Composer.Filter.HBlur = function(nbSamplesOpt) {
        osgUtil.Composer.Filter.call(this);
        if (nbSamplesOpt === undefined) {
            this.setBlurSize(5);
        } else {
            this.setBlurSize(nbSamplesOpt);
        }
    };
    
    osgUtil.Composer.Filter.HBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        setBlurSize: function(nbSamples) {
            if (nbSamples%2 !== 1) {
                nbSamples+=1;
            }
            this._nbSamples = nbSamples;
            this.dirty();
        },
        getUVOffset: function(value) {
            return "vec2(float("+value+"), 0.0)/RenderSize[0];";
        },
        build: function() {
            var nbSamples = this._nbSamples;
            var vtx = osgUtil.Composer.Filter.defaultVertexShader;
            var pascal = osgUtil.Composer.Filter.Helper.getOrCreatePascalCoefficients();
            var weights = pascal[nbSamples-1];
            var start = Math.floor(nbSamples/2.0);
            var kernel = [];
            kernel.push(" pixel += float("+weights[start]+")*texture2D(Texture0, FragTexCoord0 ).rgb;");
            var offset = 1;
            kernel.push(" vec2 offset;");
            for (var i = start+1; i < nbSamples; i++) {
                var weight = weights[i];
                kernel.push(" offset = " + this.getUVOffset(i) );
                offset++;
                kernel.push(" pixel += "+weight+"*texture2D(Texture0, FragTexCoord0 + offset).rgb;");
                kernel.push(" pixel += "+weight+"*texture2D(Texture0, FragTexCoord0 - offset).rgb;");
            }

            var fgt = [
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform float width;",

                "void main (void)",
                "{",
                "  vec3 pixel;",
                kernel.join('\n'),
                "  gl_FragColor = vec4(pixel,1.0);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vtx),
                new osg.Shader(gl.FRAGMENT_SHADER, fgt));

            if (this._stateSet.getUniform('Texture0') === undefined) {
                this._stateSet.addUniform(osg.Uniform.createInt1(0,'Texture0'));
            }
            this._stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });


    // Operate a Gaussian vertical blur
    osgUtil.Composer.Filter.VBlur = function(nbSamplesOpt) {
        osgUtil.Composer.Filter.HBlur.call(this);
    };

    osgUtil.Composer.Filter.VBlur.prototype = osg.objectInehrit(osgUtil.Composer.Filter.HBlur.prototype, {
        getUVOffset: function(value) {
            return "vec2(0.0, float("+value+"))/RenderSize[1];";
        }
    });


    osgUtil.Composer.Filter.BlendMix = function() {
        osgUtil.Composer.Filter.call(this);
        var texture0,texture1,mixValue;
        var unit0 = 0;
        var unit1 = 1;
        var stateSet = this._stateSet;
        if (arguments.length === 3) {
            texture0 = arguments[0];
            texture1 = arguments[1];
            mixValue = arguments[2];
            unit0 = 1;
            unit1 = 2;
        stateSet.setTextureAttributeAndModes(unit0,texture0);
        } else if (arguments.length === 2) {
            texture1 = arguments[0];
            mixValue = arguments[1];
        } else if (arguments.length === 1) {
            texture1 = arguments[0];
            mixValue = 0.5;
        }
        stateSet.setTextureAttributeAndModes(unit1,texture1);
        stateSet.addUniform(osg.Uniform.createInt1(unit0,'Texture0'));
        stateSet.addUniform(osg.Uniform.createInt1(unit1,'Texture1'));
        this._mixValueUniform = osg.Uniform.createFloat1(mixValue,'MixValue');
        stateSet.addUniform(mixValueUniform);
    };

    osgUtil.Composer.Filter.BlendMix = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        getBlendFactorUniform: function() {
            return this._mixValueUniform;
        },

        build: function() {
            var stateSet = this._stateSet;
            var vtx = osgUtil.Composer.Filter.defaultVertexShader;
            var fgt = [
                "",
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform sampler2D Texture1;",
                "uniform float MixValue;",

                "void main (void)",
                "{",
                "  gl_FragColor = mix(texture2D(Texture0,FragTexCoord0), texture2D(Texture1,FragTexCoord0),MixValue);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vtx),
                new osg.Shader(gl.FRAGMENT_SHADER, fgt));

            stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });


    osgUtil.Composer.Filter.BlendMultiply = function() {
        osgUtil.Composer.Filter.call(this);
        var stateSet = this._stateSet;
        var texture0,texture1,mixValue;
        var unit0 = 0;
        var unit1 = 1;
        if (arguments.length === 2) {
            texture0 = arguments[0];
            texture1 = arguments[1];
            unit0 = 1;
            unit0 = 2;
            stateSet.setTextureAttributeAndModes(unit0,texture0);
        } else if (arguments.length === 1) {
            texture1 = arguments[0];
        }
        stateSet.setTextureAttributeAndModes(unit1,texture1);
        stateSet.addUniform(osg.Uniform.createInt1(unit0,'Texture0'));
        stateSet.addUniform(osg.Uniform.createInt1(unit1,'Texture1'));
    };

    osgUtil.Composer.Filter.BlendMultiply.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {
        build: function() {
            var vtx = osgUtil.Composer.Filter.defaultVertexShader;
            var fgt = [
                "",
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform sampler2D Texture1;",
                "uniform float MixValue;",

                "void main (void)",
                "{",
                "  gl_FragColor = texture2D(Texture0,FragTexCoord0)*texture2D(Texture1,FragTexCoord0);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vtx),
                new osg.Shader(gl.FRAGMENT_SHADER, fgt));

            this._stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });

    osgUtil.Composer.Filter.SSAO = function(options) {
        osgUtil.Composer.Filter.call(this);

        var stateSet = this._stateSet;
        var nbSamples = 16;
        var radius = 0.05;
        if (options !== undefined) {
            if (options.nbSamples !== undefined)
                nbSamples = options.nbSamples;

            if (options.radius !== undefined)
                radius = options.radius;
        }

        var textureNormal = options.normal;
        var texturePosition = options.position;
        this._radius = radius;
        this._nbSamples = nbSamples;
        this._noiseTextureSize = 16;
        this._sceneRadius = 2.0;

        stateSet.addUniform(osg.Uniform.createFloat1(1.0,'Power'));
        stateSet.addUniform(osg.Uniform.createFloat1(radius,'Radius'));
        stateSet.addUniform(osg.Uniform.createInt1(0,'Texture0'));
        stateSet.addUniform(osg.Uniform.createInt1(1,'Texture1'));
        stateSet.addUniform(osg.Uniform.createInt1(2,'Texture2'));
        stateSet.addUniform(osg.Uniform.createFloat1(0.1,'AngleLimit'));

        var w = textureNormal.getWidth();
        var h = textureNormal.getHeight();
        this._size = [w,h];

        stateSet.setTextureAttributeAndModes(0,textureNormal);
        stateSet.setTextureAttributeAndModes(1,texturePosition);

        this.initNoise();
        
    };

    osgUtil.Composer.Filter.SSAO.prototype = osg.objectInehrit(osgUtil.Composer.Filter.prototype, {

        initNoise: function() {
            var sizeNoise = this._noiseTextureSize;
            var noise = new Array(sizeNoise*sizeNoise*3);
            (function(array) {
                for (var i = 0; i < sizeNoise*sizeNoise; i++) {
                    var x,y,z;
                    x = 2.0*(Math.random()-0.5);
                    y = 2.0*(Math.random()-0.5);
                    z = 0.0;

                    var n = osg.Vec3.normalize([x,y,z],[]);
                    array[i*3+0] = 255*(n[0]*0.5+0.5);
                    array[i*3+1] = 255*(n[1]*0.5+0.5);
                    array[i*3+2] = 255*(n[2]*0.5+0.5);
                }
            })(noise);

            var noiseTexture = new osg.Texture();
            noiseTexture.setWrapS('REPEAT');
            noiseTexture.setWrapT('REPEAT');
            noiseTexture.setMinFilter('NEAREST');
            noiseTexture.setMagFilter('NEAREST');
            
            noiseTexture.setTextureSize(sizeNoise,sizeNoise);
            noiseTexture.setImage(new Uint8Array(noise),'RGB');
            this._noiseTexture = noiseTexture;
        },
        setSceneRadius: function(value) {
            this._sceneRadius = value;
            this.dirty();
        },
        setAngleLimit: function(value) {
            var uniform = this._stateSet.getUniform('AngleLimit');
            uniform.get()[0] = value;
            uniform.dirty();
        },
        setNbSamples: function(value) {
            if (value === this._nbSamples) {
                return;
            }
            this._nbSamples = Math.floor(value);
            this.dirty();
        },
        setRadius: function(value) {
            var uniform = this._stateSet.getUniform('Radius');
            uniform.get()[0] = value;
            uniform.dirty();
        },
        setPower: function(value) {
            var uniform = this._stateSet.getUniform('Power');
            uniform.get()[0] = value;
            uniform.dirty();
        },
        build: function() {
            var stateSet = this._stateSet;
            var nbSamples = this._nbSamples;
            var kernel = new Array(nbSamples*4);
            (function(array) {
                for (var i = 0; i < nbSamples; i++) {
                    var x,y,z;
                    x = 2.0*(Math.random()-0.5);
                    y = 2.0*(Math.random()-0.5);
                    z = Math.random();

                    var v = osg.Vec3.normalize([x,y,z],[]);
                    var scale = Math.max(i/nbSamples,0.1);
                    scale = 0.1+(1.0-0.1)*(scale*scale);
                    array[i*3+0] = v[0];
                    array[i*3+1] = v[1];
                    array[i*3+2] = v[2];
                    array[i*3+3] = scale;
                }
            })(kernel);


            stateSet.setTextureAttributeAndModes(2, this._noiseTexture);
            var uniform = stateSet.getUniform('noiseSampling');
            if (uniform === undefined) {
                uniform = osg.Uniform.createFloat2([this._size[0]/this._noiseTextureSize, this._size[1]/this._noiseTextureSize],'noiseSampling');
                stateSet.addUniform(uniform);
            } else {
                uniform.set([this._size[0]/this._noiseTextureSize, this._size[1]/this._noiseTextureSize]);
                uniform.dirty();
            }
            var vertexshader = [
                "",
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",
                "attribute vec3 Vertex;",
                "attribute vec2 TexCoord0;",
                "varying vec2 FragTexCoord0;",
                "uniform mat4 ModelViewMatrix;",
                "uniform mat4 ProjectionMatrix;",
                "void main(void) {",
                "  gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);",
                "  FragTexCoord0 = TexCoord0;",
                "}",
                ""
            ].join('\n');

            var kernelglsl = [];
            for (var i = 0; i < nbSamples; i++) {
                kernelglsl.push("kernel["+i+"] = vec4("+kernel[i*3]+"," + kernel[i*3+1] + ", " + kernel[i*3+2] +", " + kernel[i*3+3] + ");");
            }
            kernelglsl = kernelglsl.join('\n');

            var ssaoRadiusMin = this._sceneRadius*0.002;
            var ssaoRadiusMax = this._sceneRadius*0.05;
            var ssaoRadiusStep = (ssaoRadiusMax-ssaoRadiusMin)/200.0;

            var fragmentshader = [
                "",
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "uniform sampler2D Texture1;",
                "uniform sampler2D Texture2;",
                "uniform mat4 projection;",
                "uniform vec2 noiseSampling;",
                "uniform float Power;", //"+ '{ "min": 0.1, "max": 16.0, "step": 0.1, "value": 1.0 }',
                "uniform float Radius;",  //"+ '{ "min": ' + ssaoRadiusMin +', "max": ' + ssaoRadiusMax + ', "step": '+ ssaoRadiusStep + ', "value": 0.01 }',
                "uniform float AngleLimit;",
                "#define NB_SAMPLES " + this._nbSamples,
                "float depth;",
                "vec3 normal;",
                "vec4 position;",
                "vec4 kernel["+nbSamples+"];",


                "mat3 computeBasis()",
                "{",
                "  vec2 uvrand = FragTexCoord0*noiseSampling;",
                "  vec3 rvec = texture2D(Texture2, uvrand*2.0).xyz*2.0-vec3(1.0);",
                "  vec3 tangent = normalize(rvec - normal * dot(rvec, normal));",
                "  vec3 bitangent = cross(normal, tangent);",
                "  mat3 tbn = mat3(tangent, bitangent, normal);",
                "  return tbn;",
                "}",

                "void main (void)",
                "{",
                kernelglsl,
                "  position = texture2D(Texture1, FragTexCoord0);",
                "  vec4 p = texture2D(Texture0, FragTexCoord0);",
                "  depth = p.w;",
                "  normal = vec3(p);",
                "  if ( position.w == 0.0) {",
                "     gl_FragColor = vec4(1.0,1.0,1.0,0.0);",
                "     return;",
                "  }",
                "",
                " mat3 tbn = computeBasis();",
                " float occlusion = 0.0;",
                " for (int i = 0; i < NB_SAMPLES; i++) {",
                "    vec3 vecKernel = vec3(kernel[i]);",
                "    vecKernel[2] = max(AngleLimit,vecKernel[2]);",
                "    vec3 sample = tbn * vecKernel;",
                "    vec3 dir = sample;",
                "    float w = dot(dir, normal);",
                "    float dist = 1.0-kernel[i].w;",
                "    w *= dist*dist*Power;",
                "    sample = dir * float(Radius) + position.xyz;",
                
                "    vec4 offset = projection * vec4(sample,1.0);",
                "    offset.xy /= offset.w;",
                "    offset.xy = offset.xy * 0.5 + 0.5;",

                "    float sample_depth = texture2D(Texture1, offset.xy).z;",
                "    float range_check = abs(sample.z - sample_depth) < float(Radius) ? 1.0 : 0.0;",
                "    occlusion += (sample_depth > sample.z ? 1.0 : 0.0) * range_check*w;",

                " }",
                " occlusion = 1.0 - (occlusion / float(NB_SAMPLES));",
                " gl_FragColor = vec4(vec3(occlusion),1.0);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

            stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });




    osgUtil.Composer.Filter.SSAO8 = function(options) {
        osgUtil.Composer.Filter.SSAO.call(this, options);
    };

    osgUtil.Composer.Filter.SSAO8.prototype = osg.objectInehrit(osgUtil.Composer.Filter.SSAO.prototype, {
        buildGeometry: function(quad) {
            quad.getAttributes().TexCoord1 = this._texCoord1;
            return quad;
        },
        build: function() {
            var stateSet = this._stateSet;
            var nbSamples = this._nbSamples;
            var kernel = new Array(nbSamples*4);
            var angleLimit = this._angleLimit;
            (function(array) {
                for (var i = 0; i < nbSamples; i++) {
                    var x,y,z;
                    x = 2.0*(Math.random()-0.5);
                    y = 2.0*(Math.random()-0.5);
                    z = Math.random();

                    var v = osg.Vec3.normalize([x,y,z],[]);
                    var scale = Math.max(i/nbSamples,0.1);
                    scale = 0.1+(1.0-0.1)*(scale*scale);
                    array[i*3+0] = v[0];
                    array[i*3+1] = v[1];
                    array[i*3+2] = v[2];
                    array[i*3+3] = scale;
                }
            })(kernel);

            var sizeNoise = this._noiseTextureSize;
            stateSet.setTextureAttributeAndModes(2,this._noiseTexture);
            var uniform = stateSet.getUniform('noiseSampling');
            if (uniform === undefined) {
                uniform = osg.Uniform.createFloat2([this._size[0]/this._noiseTextureSize, this._size[1]/this._noiseTextureSize],'noiseSampling');
                stateSet.addUniform(uniform);
            } else {
                uniform.set([this._size[0]/this._noiseTextureSize, this._size[1]/this._noiseTextureSize]);
                uniform.dirty();
            }
            var vertexshader = [
                "",
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",
                "attribute vec3 Vertex;",
                "attribute vec2 TexCoord0;",
                "attribute vec3 TexCoord1;",
                "varying vec2 FragTexCoord0;",
                "varying vec3 FragTexCoord1;",
                "uniform mat4 ModelViewMatrix;",
                "uniform mat4 ProjectionMatrix;",
                "void main(void) {",
                "  gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);",
                "  FragTexCoord0 = TexCoord0;",
                "  FragTexCoord1 = TexCoord1;",
                "}",
                ""
            ].join('\n');

            var kernelglsl = [];
            for (var i = 0; i < nbSamples; i++) {
                kernelglsl.push("kernel["+i+"] = vec4("+kernel[i*3]+"," + kernel[i*3+1] + ", " + kernel[i*3+2] +", " + kernel[i*3+3] + ");");
            }
            kernelglsl = kernelglsl.join('\n');

            var ssaoRadiusMin = this._sceneRadius*0.002;
            var ssaoRadiusMax = this._sceneRadius*0.05;
            var ssaoRadiusStep = (ssaoRadiusMax-ssaoRadiusMin)/200.0;

            var fragmentshader = [
                "",
                osgUtil.Composer.Filter.defaultFragmentShaderHeader,
                "varying vec3 FragTexCoord1;",
                "uniform sampler2D Texture1;",
                "uniform sampler2D Texture2;",
                "uniform mat4 projection;",
                "uniform vec2 noiseSampling;",
                "uniform float Power;", //"+ '{ "min": 0.1, "max": 16.0, "step": 0.1, "value": 1.0 }',
                "uniform float Radius;", //"+ '{ "min": ' + ssaoRadiusMin +', "max": ' + ssaoRadiusMax + ', "step": '+ ssaoRadiusStep + ', "value": 0.01 }',
                "uniform float AngleLimit;",
                "#define NB_SAMPLES " + this._nbSamples,
                "float depth;",
                "float znear, zfar, zrange;",
                "vec3 normal;",
                "vec3 position;",
                "vec4 kernel["+nbSamples+"];",


                osgUtil.Composer.Filter.shaderUtils,

                "mat3 computeBasis()",
                "{",
                "  vec2 uvrand = FragTexCoord0*noiseSampling;",
                "  //uvrand = rand(gl_FragCoord.xy);",
                "  vec3 rvec = texture2D(Texture2, uvrand*2.0).xyz*2.0-vec3(1.0);",
                "  //vec3 rvec = normalize(vec3(uvrand,0.0));",
                "  vec3 tangent = normalize(rvec - normal * dot(rvec, normal));",
                "  vec3 bitangent = cross(normal, tangent);",
                "  mat3 tbn = mat3(tangent, bitangent, normal);",
                "  return tbn;",
                "}",

                "float getDepthValue(vec4 v) {",
                "  float depth = unpack4x8ToFloat(v);",
                "  depth = depth*zrange+znear;",
                "  //depth = depth*zrange;",
                "  return -depth;",
                "}",

                "void main (void)",
                "{",
                kernelglsl,
                "  vec4 p = texture2D(Texture0, FragTexCoord0);",
                "  if (dot(p,p) < 0.001) { ",
                "     gl_FragColor = vec4(1.0,1.0,1.0,0.0);",
                "     return;",
                "  }",
                "  znear = projection[3][2] / (projection[2][2]-1.0);",
                "  zfar = projection[3][2] / (projection[2][2]+1.0);",
                "  zrange = zfar-znear;",
                "  depth = getDepthValue(texture2D(Texture1, FragTexCoord0));",
                //B = (A - znear)/(zfar-znear);",
                //B = A/(zfar-znear) - znear/(zfar-znear);",
                //B+ znear/(zfar-znear) = A/(zfar-znear) ;",
                //(zfar-znear)*(B+ znear/(zfar-znear)) = A ;",
                //(zfar-znear)*B+ znear = A ;",

                "  if ( -depth < znear) {",
                "     gl_FragColor = vec4(1.0,1.0,1.0,0.0);",
                "     return;",
                "  }",

                "  normal = decodeNormal(unpack4x8To2Float(p));",

                "  position = -FragTexCoord1*depth;",
                "  position.z = -position.z;",

                "",
                " mat3 tbn = computeBasis();",
                " float occlusion = 0.0;",
                " for (int i = 0; i < NB_SAMPLES; i++) {",
                "    vec3 vecKernel = vec3(kernel[i]);",
                "    vecKernel[2] = max(AngleLimit,vecKernel[2]);",
                "    vec3 sample = tbn * vec3(vecKernel);",
                "    vec3 dir = sample;",
                "    float w = dot(dir, normal);",
                "    float dist = 1.0-kernel[i].w;",
                "    w *= dist*dist*Power;",
                "    sample = dir * float(Radius) + position.xyz;",
                
                "    vec4 offset = projection * vec4(sample,1.0);",
                "    offset.xy /= offset.w;",
                "    offset.xy = offset.xy * 0.5 + 0.5;",

                "    float sample_depth = getDepthValue(texture2D(Texture1, offset.xy));",
                "    float range_check = abs(sample.z - sample_depth) < float(Radius) ? 1.0 : 0.0;",
                "    occlusion += (sample_depth > sample.z ? 1.0 : 0.0) * range_check*w;",

                " }",
                " occlusion = 1.0 - (occlusion / float(NB_SAMPLES));",
                " gl_FragColor = vec4(vec3(occlusion),1.0);",
                "}",
                ""
            ].join('\n');

            var program = new osg.Program(
                new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

            stateSet.setAttributeAndModes(program);
            this._dirty = false;
        }
    });


})();/** -*- compile-command: "jslint-cli osgDB.js" -*-
 *
 *  Copyright (C) 2010 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */

var osgDB = {};

osgDB.ObjectWrapper = {};
osgDB.ObjectWrapper.serializers = {};

osgDB.readImage = function (url) {
    if (osgDB._input === undefined) {
        osgDB._input = new osgDB.Input();
    }
    return osgDB._input.readImageURL(url);
};

osgDB.parseSceneGraph = function (node, options) {
    if (node.Version !== undefined && node.Version > 0) {

        var getPropertyValue = function(o) {
            var props = Object.keys(o);
            for (var i = 0, l = props.length; i < l; i++) {
                if (props[i] !== "Generator" && props[i] !== "Version") {
                    return props[i];
                }
            }
            return undefined;
        };

        var key = getPropertyValue(node);
        if (key) {
            var obj = {};
            obj[key] = node[key];
            var input = new osgDB.Input(obj);
            if (options !== undefined && 
                options.progressXHRCallback !== undefined) {
                input.setProgressXHRCallback(options.progressXHRCallback);
            }
            return input.readObject();
            //return osgDB.ObjectWrapper.readObject(obj);
        } else {
            osg.log("can't parse scenegraph " + node);
        }
    } else {
        return osgDB.parseSceneGraph_deprecated(node);
    }
};
osgDB.parseSceneGraph_deprecated = function (node)
{
    var getFieldBackwardCompatible = function(field, json) {
        var value = json[field];
        if (value === undefined) {
            value = json[field.toLowerCase()];
        }
        return value;
    };
    var setName = function(osgjs, json) {
        var name = getFieldBackwardCompatible("Name", json);
        if (name && osgjs.setName !== undefined) {
            osgjs.setName(name);
        }
    };

    var setMaterial = function(osgjs, json) {
        setName(osgjs, json);
        osgjs.setAmbient(getFieldBackwardCompatible("Ambient", json));
        osgjs.setDiffuse(getFieldBackwardCompatible("Diffuse", json));
        osgjs.setEmission(getFieldBackwardCompatible("Emission", json));
        osgjs.setSpecular(getFieldBackwardCompatible("Specular", json));
        osgjs.setShininess(getFieldBackwardCompatible("Shininess", json));
    };

    var setBlendFunc = function(osgjs, json) {
        setName(osgjs, json);
        osgjs.setSourceRGB(json.SourceRGB);
        osgjs.setSourceAlpha(json.SourceAlpha);
        osgjs.setDestinationRGB(json.DestinationRGB);
        osgjs.setDestinationAlpha(json.DestinationAlpha);
    };

    var setTexture = function( osgjs, json) {
        var magFilter = json.MagFilter || json.mag_filter || undefined;
        if (magFilter) {
            osgjs.setMagFilter(magFilter);
        }
        var minFilter = json.MinFilter || json.min_filter || undefined;
        if (minFilter) {
            osgjs.setMinFilter(minFilter);
        }
        var wrapT = json.WrapT || json.wrap_t || undefined;
        if (wrapT) {
            osgjs.setWrapT(wrapT);
        }
        var wrapS = json.WrapS || json.wrap_s || undefined;
        if (wrapS) {
            osgjs.setWrapS(wrapS);
        }
        var file = getFieldBackwardCompatible("File", json);
        osgDB.Promise.when(osgDB.readImage(file)).then(
            function(img) {
                osgjs.setImage(img);
            });
    };

    var setStateSet = function(osgjs, json) {
        setName(osgjs, json);
        var textures = getFieldBackwardCompatible("Textures", json) || getFieldBackwardCompatible("TextureAttributeList", json) || undefined;
        if (textures) {
            for (var t = 0, tl = textures.length; t < tl; t++) {
                var file = getFieldBackwardCompatible("File", textures[t]);
                if (!file) {
                    osg.log("no texture on unit " + t + " skip it");
                    continue;
                }
                var tex = new osg.Texture();
                setTexture(tex, textures[t]);
                
                osgjs.setTextureAttributeAndMode(t, tex);
                osgjs.addUniform(osg.Uniform.createInt1(t,"Texture" + t));
            }
        }
        
        var blendfunc = getFieldBackwardCompatible("BlendFunc",json);
        if (blendfunc) {
            var newblendfunc = new osg.BlendFunc();
            setBlendFunc(newblendfunc, blendfunc);
            osgjs.setAttributeAndMode(newblendfunc);
        }

        var material = getFieldBackwardCompatible("Material",json);
        if (material) {
            var newmaterial = new osg.Material();
            setMaterial(newmaterial, material);
            osgjs.setAttributeAndMode(newmaterial);
        }
    };


    var newnode;
    var children = node.children;
    var primitives = node.primitives || node.Primitives || undefined;
    var attributes = node.attributes || node.Attributes || undefined;
    if (primitives || attributes) {
        newnode = new osg.Geometry();

        setName(newnode, node);

        osg.extend(newnode, node); // we should not do that
        node = newnode;
        node.primitives = primitives; // we should not do that
        node.attributes = attributes; // we should not do that

        var i;
        for ( var p = 0, lp = primitives.length; p < lp; p++) {
            var mode = primitives[p].mode;
            if (primitives[p].indices) {
                var array = primitives[p].indices;
                array = new osg.BufferArray(osg.BufferArray[array.type], array.elements, array.itemSize );
                if (!mode) {
                    mode = gl.TRIANGLES;
                } else {
                    mode = osg.PrimitiveSet[mode];
                }
                primitives[p] = new osg.DrawElements(mode, array);
            } else {
                mode = gl[mode];
                var first = primitives[p].first;
                var count = primitives[p].count;
                primitives[p] = new osg.DrawArrays(mode, first, count);
            }
        }

        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                var attributeArray = attributes[key];
                attributes[key] = new osg.BufferArray(gl[attributeArray.type], attributeArray.elements, attributeArray.itemSize );
            }
        }
    }

    var stateset = getFieldBackwardCompatible("StateSet", node);
    if (stateset) {
        var newstateset = new osg.StateSet();
        setStateSet(newstateset, stateset);
        node.stateset = newstateset;
    }

    var matrix = node.matrix || node.Matrix || undefined;
    if (matrix) {
        newnode = new osg.MatrixTransform();
        setName(newnode, node);

        osg.extend(newnode, node);
        newnode.setMatrix(osg.Matrix.copy(matrix));
        node = newnode;
    }

    var projection = node.projection || node.Projection || undefined;
    if (projection) {
        newnode = new osg.Projection();
        setName(newnode, node);
        osg.extend(newnode, node);
        newnode.setProjectionMatrix(osg.Matrix.copy(projection));
        node = newnode;
    }

    // default type
    if (node.objectType === undefined) {
        newnode = new osg.Node();
        setName(newnode, node);
        osg.extend(newnode, node);
        node = newnode;
    }


    if (children) {
        // disable children, it will be processed in the end
        node.children = [];

        for (var child = 0, childLength = children.length; child < childLength; child++) {
            node.addChild(osgDB.parseSceneGraph_deprecated(children[child]));
        }
    }

    return node;
};
osgDB.Input = function(json, identifier)
{
    this._json = json;
    var map = identifier;
    if (map === undefined) {
        map = {};
    }
    this._identifierMap = map;
    this._objectRegistry = {};
    this._progressXHRCallback = undefined;
};

osgDB.Input.prototype = {
    setProgressXHRCallback: function(func) {
        this._progressXHRCallback = func;
    },

    // used to override the type from pathname
    // typically if you want to create proxy object
    registerObject: function(fullyqualified_objectname, constructor) {
        this._objectRegistry[fullyqualified_objectname] = constructor;
    },

    getJSON: function() {
        return this._json;
    },

    setJSON: function(json) {
        this._json = json;
        return this;
    },

    getObjectWrapper: function (path) {
        if (this._objectRegistry[path] !== undefined) {
            return new (this._objectRegistry[path])();
        }

        var scope = window;
        var splittedPath = path.split('.');
        for (var i = 0, l = splittedPath.length; i < l; i++) {
            var obj = scope[ splittedPath[i] ];
            if (obj === undefined) {
                return undefined;
            }
            scope = obj;
        }
        // create the new obj
        return new (scope)();
    },

    readImageURL: function(url) {
        var defer = osgDB.Promise.defer();
        var img = new Image();
        img.onerror = function() {
            osg.warn("warning use white texture as fallback instead of " + url);
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2P8DwQACgAD/il4QJ8AAAAASUVORK5CYII=";
        };
        img.onload = function() {
            defer.resolve(img);
        };
        img.src = url;
        return defer.promise;
    },

    readImage: function() {
        var jsonObj = this.getJSON();
        var uniqueID = jsonObj.UniqueID;
        if (uniqueID !== undefined) {
            img = this._identifierMap[uniqueID];
            if (img !== undefined) {
                return img;
            }
        }
        var self = this;
        var defer = osgDB.Promise.defer();
        var url = jsonObj.Url;
        osgDB.Promise.when(this.readImageURL(url)).then( function ( img ) {
            if (uniqueID !== undefined) {
                self._identifierMap[uniqueID] = img;
            }
            defer.resolve(img);
        });

        return defer.promise;
    },

    readBinaryArrayURL: function(url) {
        if (this._identifierMap[url] !== undefined) {
            return this._identifierMap[url];
        }
        var defer = osgDB.Promise.defer();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        if (this._progressXHRCallback) {
            xhr.addEventListener("progress", this._progressXHRCallback, false);
        }

        xhr.addEventListener("error", function() {
            defer.reject();
        }, false);

        var self = this;
        xhr.addEventListener("load", function (oEvent) {
            var arrayBuffer = xhr.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                // var byteArray = new Uint8Array(arrayBuffer);
                self._identifierMap[url] = arrayBuffer;
                defer.resolve(arrayBuffer);
            } else {
                defer.reject();
            }
        }, false);

        xhr.send(null);
        this._identifierMap[url] = defer.promise;
        return defer.promise;
    },

    readBufferArray: function() {
        var jsonObj = this.getJSON();

        var uniqueID = jsonObj.UniqueID;
        var osgjsObject;
        if (uniqueID !== undefined) {
            osgjsObject = this._identifierMap[uniqueID];
            if (osgjsObject !== undefined) {
                return osgjsObject;
            }
        }

        var check = function(o) {
            if ((o.Elements !== undefined || o.Array !== undefined) && 
                o.ItemSize !== undefined &&
                o.Type) {
                return true;
            }
            return false;
        };

        if (!check(jsonObj)) {
            return;
        }

        var obj, defer;

        // inline array
        if (jsonObj.Elements !== undefined) {
            obj = new osg.BufferArray(osg.BufferArray[jsonObj.Type], jsonObj.Elements, jsonObj.ItemSize );

        } else if (jsonObj.Array !== undefined) {

            var buf = new osg.BufferArray(osg.BufferArray[jsonObj.Type]);
            buf.setItemSize(jsonObj.ItemSize);
            
            var vb, type;
            if (jsonObj.Array.Float32Array !== undefined) {
                vb = jsonObj.Array.Float32Array;
                type = 'Float32Array';
            } else if (jsonObj.Array.Uint16Array !== undefined) {
                vb = jsonObj.Array.Uint16Array;
                type = 'Uint16Array';
            } else {
                osg.warn("Typed Array " + Object.keys(o.Array)[0]);
                type = 'Float32Array';
            }

            if (vb !== undefined) {
                if (vb.File !== undefined) {
                    var url = vb.File;
                    defer = osgDB.Promise.defer();
                    osgDB.Promise.when(this.readBinaryArrayURL(url)).then(function(array) {

                        var typedArray;
                        // manage endianness
                        var big_endian;
                        (function() {
                            var a = new Uint8Array([0x12, 0x34]);
                            var b = new Uint16Array(a.buffer);
                            big_endian = ( (b[0]).toString(16) === "1234");
                        })();

                        var offset = 0;
                        if (vb.Offset !== undefined) {
                            offset = vb.Offset;
                        }

                        var bytesPerElement = osg[type].BYTES_PER_ELEMENT;
                        var nbItems = vb.Size;
                        var nbCoords = buf.getItemSize();
                        var totalSizeInBytes = nbItems*bytesPerElement*nbCoords;

                        if (big_endian) {
                            osg.log("big endian detected");
                            var typed_array = osg[type];
                            var tmpArray = new typed_array(nbItems*nbCoords);
                            var data = new DataView(array, offset, totalSizeInBytes);
                            var i = 0, l = tmpArray.length;
                            if (type === 'Uint16Array') {
                                for (; i < l; i++) {
                                    tempArray[i] = data.getUint16(i * bytesPerElement, true);
                                }
                            } else if (type === 'Float32Array') {
                                for (; i < l; i++) {
                                    tempArray[i] = data.getFloat32(i * bytesPerElement, true);
                                }
                            }
                            typedArray = tempArray;
                            data = null;
                        } else {
                            typedArray = new osg[type](array, offset, nbCoords*nbItems);
                        }
                        a = b = null;

                        buf.setElements(typedArray);
                        defer.resolve(buf);
                    });
                } else if (vb.Elements !== undefined) {
                    var a = new osg[type](vb.Elements);
                    buf.setElements(a);
                }
            }
            obj = buf;
        }
        
        if (uniqueID !== undefined) {
            this._identifierMap[uniqueID] = obj;
        }

        if (defer !== undefined) {
            return defer.promise;
        }
        return obj;
    },

    readUserDataContainer: function() {
        var jsonObj = this.getJSON();
        var osgjsObject;
        var uniqueID = jsonObj.UniqueID;
        if (uniqueID !== undefined) {
            osgjsObject = this._identifierMap[uniqueID];
            if (osgjsObject !== undefined) {
                return osgjsObject.Values;
            }
        }

        this._identifierMap[uniqueID] = jsonObj;
        return jsonObj.Values;
    },

    readPrimitiveSet: function() {
        var jsonObj = this.getJSON();
        var uniqueID;
        var osgjsObject;

        var obj;
        var defer;
        var drawElementPrimitive = jsonObj.DrawElementUShort || jsonObj.DrawElementUByte || jsonObj.DrawElementUInt || jsonObj.DrawElementsUShort || jsonObj.DrawElementsUByte || jsonObj.DrawElementsUInt || undefined;
        if ( drawElementPrimitive ) {

            uniqueID = drawElementPrimitive.UniqueID;
            if (uniqueID !== undefined) {
                osgjsObject = this._identifierMap[uniqueID];
                if (osgjsObject !== undefined) {
                    return osgjsObject;
                }
            }

            defer = osgDB.Promise.defer();
            var jsonArray = drawElementPrimitive.Indices;
            var prevJson = jsonObj;

            mode = drawElementPrimitive.Mode;
            if (!mode) {
                mode = osg.PrimitiveSet.TRIANGLES;
            } else {
                mode = osg.PrimitiveSet[mode];
            }
            obj = new osg.DrawElements(mode);

            this.setJSON(jsonArray);
            osgDB.Promise.when(this.readBufferArray()).then(
                function(array) {
                    obj.setIndices(array);
                    defer.resolve(obj);
                });
            this.setJSON(prevJson);
        }

        var drawArrayPrimitive = jsonObj.DrawArray || jsonObj.DrawArrays;
        if (drawArrayPrimitive) {

            uniqueID = drawArrayPrimitive.UniqueID;
            if (uniqueID !== undefined) {
                osgjsObject = this._identifierMap[uniqueID];
                if (osgjsObject !== undefined) {
                    return osgjsObject;
                }
            }

            mode = drawArrayPrimitive.Mode || drawArrayPrimitive.mode;
            first = drawArrayPrimitive.First !== undefined ? drawArrayPrimitive.First : drawArrayPrimitive.first;
            count = drawArrayPrimitive.Count !== undefined ? drawArrayPrimitive.Count : drawArrayPrimitive.count;
            var drawArray = new osg.DrawArrays(osg.PrimitiveSet[mode], first, count);
            obj = drawArray;
        }

        var drawArrayLengthsPrimitive = jsonObj.DrawArrayLengths || undefined;
        if (drawArrayLengthsPrimitive) {

            uniqueID = drawArrayLengthsPrimitive.UniqueID;
            if (uniqueID !== undefined) {
                osgjsObject = this._identifierMap[uniqueID];
                if (osgjsObject !== undefined) {
                    return osgjsObject;
                }
            }

            mode = drawArrayLengthsPrimitive.Mode;
            first = drawArrayLengthsPrimitive.First;
            var array = drawArrayLengthsPrimitive.ArrayLengths;
            var drawArrayLengths =  new osg.DrawArrayLengths(osg.PrimitiveSet[mode], first, array);
            obj = drawArrayLengths;
        }

        if (uniqueID !== undefined) {
            this._identifierMap[uniqueID] = obj;
        }

        if (defer) {
            return defer.promise;
        }
        return obj;
    },


    readObject: function () {

        var jsonObj = this.getJSON();
        var prop = Object.keys(jsonObj)[0];
        if (!prop) {
            osg.warn("can't find property for object " + jsonObj);
            return undefined;
        }

        var uniqueID = jsonObj[prop].UniqueID;
        var osgjsObject;
        if (uniqueID !== undefined) {
            osgjsObject = this._identifierMap[uniqueID];
            if (osgjsObject !== undefined) {
                return osgjsObject;
            }
        }

        var obj = this.getObjectWrapper(prop);
        if (!obj) {
            osg.warn("can't instanciate object " + prop);
            return undefined;
        }

        var scope = osgDB.ObjectWrapper.serializers;
        var splittedPath = prop.split('.');
        for (var i = 0, l = splittedPath.length; i < l; i++) {
            var reader = scope[ splittedPath[i] ];
            if (reader === undefined) {
                osg.warn("can't find function to read object " + prop + " - undefined");
                return undefined;
            }
            scope = reader;
        }
        
        var promise = scope(this.setJSON(jsonObj[prop]), obj);

        if (uniqueID !== undefined) {
            this._identifierMap[uniqueID] = obj;
            obj._uniqueID = uniqueID;
        }
        return promise;
    }
};
// from https://gist.github.com/814052
osgDB.Promise = {};

(function() {

    var exports = osgDB.Promise;

// vim:ts=4:sts=4:sw=4:
/*jshint browser: true, node: true,
  curly: true, eqeqeq: true, noarg: true, nonew: true, trailing: true,
  undef: true */
/*global define: false, Q: true, msSetImmediate: false, setImmediate: false,
  ReturnValue: false, cajaVM: false, ses: false */

/*
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * With formatStackTrace and formatSourcePosition functions
 * Copyright 2006-2008 the V8 project authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the following
 *       disclaimer in the documentation and/or other materials provided
 *       with the distribution.
 *     * Neither the name of Google Inc. nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /*jshint strict: false*/

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // RequireJS
    if (typeof define === "function") {
        define(definition);

    // CommonJS
    } else if (typeof exports === "object") {
        definition(void 0, exports);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = function () {
                var Q = {};
                return definition(void 0, Q);
            };
        }

    // <script>
    } else {
        definition(void 0, Q = {});
    }

})(function (require, exports) {
"use strict";

// shims

// used for fallback "defend" and in "allResolved"
var noop = function () {};

// for the security conscious, defend may be a deep freeze as provided
// by cajaVM.  Otherwise we try to provide a shallow freeze just to
// discourage promise changes that are not compatible with secure
// usage.  If Object.freeze does not exist, fall back to doing nothing
// (no op).
var defend = Object.freeze || noop;
if (typeof cajaVM !== "undefined") {
    defend = cajaVM.def;
}

// use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick;
if (typeof process !== "undefined") {
    // node
    nextTick = process.nextTick;
} else if (typeof msSetImmediate === "function") {
    // IE 10 only, at the moment
    // And yes, ``bind``ing to ``window`` is necessary O_o.
    nextTick = msSetImmediate.bind(window);
} else if (typeof setImmediate === "function") {
    // https://github.com/NobleJS/setImmediate
    nextTick = setImmediate;
} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    // linked list of tasks (single, with head node)
    var head = {}, tail = head;
    channel.port1.onmessage = function () {
        head = head.next;
        var task = head.task;
        delete head.task;
        task();
    };
    nextTick = function (task) {
        tail = tail.next = {task: task};
        channel.port2.postMessage(0);
    };
} else {
    // old browsers
    nextTick = function (task) {
        setTimeout(task, 0);
    };
}

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this does have the nice side-effect of reducing the size
// of the code by reducing x.call() to merely x(), eliminating many
// hard-to-minify characters.
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var uncurryThis;
// I have kept both variations because the first is theoretically
// faster, if bind is available.
if (Function.prototype.bind) {
    var Function_bind = Function.prototype.bind;
    uncurryThis = Function_bind.bind(Function_bind.call);
} else {
    uncurryThis = function (f) {
        return function (thisp) {
            return f.call.apply(f, arguments);
        };
    };
}

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        keys.push(key);
    }
    return keys;
};

var object_toString = Object.prototype.toString;

// generator related shims

function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

function formatStackTrace(error, frames) {
    var lines = [];
    try {
        lines.push(error.toString());
    } catch (e) {
        try {
            lines.push("<error: " + e + ">");
        } catch (ee) {
            lines.push("<error>");
        }
    }
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        var line;

        // <Inserted by @domenic>
        if (typeof frame === "string") {
            lines.push(frame);
        // </Inserted by @domenic>
        } else {
            try {
                line = formatSourcePosition(frame);
            } catch (e) {
                try {
                    line = "<error: " + e + ">";
                } catch (ee) {
                    // Any code that reaches this point is seriously nasty!
                    line = "<error>";
                }
            }
            lines.push("    at " + line);
        }
    }
    return lines.join("\n");
}

function formatSourcePosition(frame) {
    var fileLocation = "";
    if (frame.isNative()) {
        fileLocation = "native";
    } else if (frame.isEval()) {
        fileLocation = "eval at " + frame.getEvalOrigin();
    } else {
        var fileName = frame.getFileName();
        if (fileName) {
            fileLocation += fileName;
            var lineNumber = frame.getLineNumber();
            if (lineNumber !== null) {
                fileLocation += ":" + lineNumber;
                var columnNumber = frame.getColumnNumber();
                if (columnNumber) {
                    fileLocation += ":" + columnNumber;
                }
            }
        }
    }
    if (!fileLocation) {
        fileLocation = "unknown source";
    }
    var line = "";
    var functionName = frame.getFunction().name;
    var addPrefix = true;
    var isConstructor = frame.isConstructor();
    var isMethodCall = !(frame.isToplevel() || isConstructor);
    if (isMethodCall) {
        var methodName = frame.getMethodName();
        line += frame.getTypeName() + ".";
        if (functionName) {
            line += functionName;
            if (methodName && (methodName !== functionName)) {
                line += " [as " + methodName + "]";
            }
        } else {
            line += methodName || "<anonymous>";
        }
    } else if (isConstructor) {
        line += "new " + (functionName || "<anonymous>");
    } else if (functionName) {
        line += functionName;
    } else {
        line += fileLocation;
        addPrefix = false;
    }
    if (addPrefix) {
        line += " (" + fileLocation + ")";
    }
    return line;
}

/*
 * Retrieves an array of structured stack frames parsed from the ``stack``
 * property of a given object.
 *
 * @param objectWithStack {Object} an object with a ``stack`` property: usually
 * an error or promise.
 *
 * @returns an array of stack frame objects. For more information, see
 * [V8's JavaScript stack trace API documentation](http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi).
 */
function getStackFrames(objectWithStack) {
    var oldPrepareStackTrace = Error.prepareStackTrace;

    Error.prepareStackTrace = function (error, frames) {
        // Filter out frames from the innards of Node and Q.
        return frames.filter(function (frame) {
            var fileName = frame.getFileName();
            return (
                fileName !== "module.js" &&
                fileName !== "node.js" &&
                fileName !== qFileName
            );
        });
    };

    var stack = objectWithStack.stack;

    Error.prepareStackTrace = oldPrepareStackTrace;

    return stack;
}

// discover own file name for filtering stack traces
var qFileName;
if (Error.captureStackTrace) {
    qFileName = (function () {
        var fileName;

        var oldPrepareStackTrace = Error.prepareStackTrace;

        Error.prepareStackTrace = function (error, frames) {
            fileName = frames[0].getFileName();
        };

        // teases call of temporary prepareStackTrace
        // JSHint and Closure Compiler generate known warnings here
        /*jshint expr: true */
        new Error().stack;

        Error.prepareStackTrace = oldPrepareStackTrace;

        return fileName;
    })();
}

function deprecate(fn, name, alternative){
    return function () {
        if (typeof console !== "undefined" && typeof console.warn === "function"){
            console.warn(name + " is deprecated, use " + alternative + " instead.");
        }
        return fn.apply(fn,arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
exports.nextTick = nextTick;

/**
 * Constructs a {promise, resolve} object.
 *
 * The resolver is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke the resolver with any value that is
 * not a function. To reject the promise, invoke the resolver with a rejection
 * object. To put the promise in the same state as another promise, invoke the
 * resolver with that other promise.
 */
exports.defer = defer;
function defer() {
    // if "pending" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the pending array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the ref promise because it handles both fully
    // resolved values and other promises gracefully.
    var pending = [], value;

    var deferred = object_create(defer.prototype);
    var promise = object_create(makePromise.prototype);

    promise.promiseSend = function () {
        var args = array_slice(arguments);
        if (pending) {
            pending.push(args);
        } else {
            nextTick(function () {
                value.promiseSend.apply(value, args);
            });
        }
    };

    promise.valueOf = function () {
        if (pending) {
            return promise;
        }
        return value.valueOf();
    };

    if (Error.captureStackTrace) {
        Error.captureStackTrace(promise, defer);
    }

    function become(resolvedValue) {
        if (!pending) {
            return;
        }
        value = resolve(resolvedValue);
        array_reduce(pending, function (undefined, pending) {
            nextTick(function () {
                value.promiseSend.apply(value, pending);
            });
        }, void 0);
        pending = void 0;
        return value;
    }

    defend(promise);

    deferred.promise = promise;
    deferred.resolve = become;
    deferred.reject = function (exception) {
        return become(reject(exception));
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};
// XXX deprecated
defer.prototype.node = deprecate(defer.prototype.makeNodeResolver, "node", "makeNodeResolver");

/**
 * @param makePromise {Function} a function that returns nothing and accepts
 * the resolve and reject functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in makePromise
 */
exports.promise = promise;
function promise(makePromise) {
    var deferred = defer();
    call(
        makePromise,
        void 0,
        deferred.resolve,
        deferred.reject
    ).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * put(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
exports.makePromise = makePromise;
function makePromise(descriptor, fallback, valueOf, exception) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error("Promise does not support operation: " + op));
        };
    }

    var promise = object_create(makePromise.prototype);

    promise.promiseSend = function (op, resolved /* ...args */) {
        var args = array_slice(arguments, 2);
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.apply(promise, [op].concat(args));
            }
        } catch (exception) {
            result = reject(exception);
        }
        resolved(result);
    };

    if (valueOf) {
        promise.valueOf = valueOf;
    }

    if (exception) {
        promise.exception = exception;
    }

    defend(promise);

    return promise;
}

// provide thenables, CommonJS/Promises/A
makePromise.prototype.then = function (fulfilled, rejected) {
    return when(this, fulfilled, rejected);
};

// Chainable methods
array_reduce(
    [
        "isResolved", "isFulfilled", "isRejected",
        "when", "spread", "send",
        "get", "put", "del",
        "post", "invoke",
        "keys",
        "apply", "call", "bind",
        "fapply", "fcall", "fbind",
        "all", "allResolved",
        "view", "viewInfo",
        "timeout", "delay",
        "catch", "finally", "fail", "fin", "end"
    ],
    function (prev, name) {
        makePromise.prototype[name] = function () {
            return exports[name].apply(
                exports,
                [this].concat(array_slice(arguments))
            );
        };
    },
    void 0
);

makePromise.prototype.toSource = function () {
    return this.toString();
};

makePromise.prototype.toString = function () {
    return "[object Promise]";
};

defend(makePromise.prototype);

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */
exports.nearer = valueOf;
function valueOf(value) {
    // if !Object.isObject(value)
    // generates a known JSHint "constructor invocation without new" warning
    // supposed to be fixed, but isn't? https://github.com/jshint/jshint/issues/392
    /*jshint newcap: false */
    if (Object(value) !== value) {
        return value;
    } else {
        return value.valueOf();
    }
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
exports.isPromise = isPromise;
function isPromise(object) {
    return object && typeof object.promiseSend === "function";
}

/**
 * @returns whether the given object is a resolved promise.
 */
exports.isResolved = isResolved;
function isResolved(object) {
    return isFulfilled(object) || isRejected(object);
}

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
exports.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(valueOf(object));
}

/**
 * @returns whether the given object is a rejected promise.
 */
exports.isRejected = isRejected;
function isRejected(object) {
    object = valueOf(object);
    return isPromise(object) && 'exception' in object;
}

var rejections = [];
var errors = [];
if (typeof window !== "undefined" && window.console) {
    // This promise library consumes exceptions thrown in handlers so
    // they can be handled by a subsequent promise.  The rejected
    // promises get added to this array when they are created, and
    // removed when they are handled.
    console.log("Should be empty:", errors);
}

/**
 * Constructs a rejected promise.
 * @param exception value describing the failure
 */
exports.reject = reject;
function reject(exception) {
    exception = exception || new Error();
    var rejection = makePromise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                var at = array_indexOf(rejections, this);
                if (at !== -1) {
                    errors.splice(at, 1);
                    rejections.splice(at, 1);
                }
            }
            return rejected ? rejected(exception) : reject(exception);
        }
    }, function fallback(op) {
        return reject(exception);
    }, function valueOf() {
        return this;
    }, exception);
    // note that the error has not been handled
    rejections.push(rejection);
    errors.push(exception);
    return rejection;
}

/**
 * Constructs a promise for an immediate reference.
 * @param value immediate reference
 */
exports.begin = resolve; // XXX experimental
exports.resolve = resolve;
exports.ref = deprecate(resolve, "ref", "resolve"); // XXX deprecated, use resolve
function resolve(object) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(object)) {
        return object;
    }
    // assimilate thenables, CommonJS/Promises/A
    if (object && typeof object.then === "function") {
        var result = defer();
        object.then(result.resolve, result.reject);
        return result.promise;
    }
    return makePromise({
        "when": function (rejected) {
            return object;
        },
        "get": function (name) {
            return object[name];
        },
        "put": function (name, value) {
            return object[name] = value;
        },
        "del": function (name) {
            return delete object[name];
        },
        "post": function (name, value) {
            return object[name].apply(object, value);
        },
        "apply": function (self, args) {
            return object.apply(self, args);
        },
        "fapply": function (args) {
            return object.apply(void 0, args);
        },
        "viewInfo": function () {
            var on = object;
            var properties = {};

            function fixFalsyProperty(name) {
                if (!properties[name]) {
                    properties[name] = typeof on[name];
                }
            }

            while (on) {
                Object.getOwnPropertyNames(on).forEach(fixFalsyProperty);
                on = Object.getPrototypeOf(on);
            }
            return {
                "type": typeof object,
                "properties": properties
            };
        },
        "keys": function () {
            return object_keys(object);
        }
    }, void 0, function valueOf() {
        return object;
    });
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
exports.master = master;
function master(object) {
    return makePromise({
        "isDef": function () {}
    }, function fallback(op) {
        var args = array_slice(arguments);
        return send.apply(void 0, [object].concat(args));
    }, function () {
        return valueOf(object);
    });
}

exports.viewInfo = viewInfo;
function viewInfo(object, info) {
    object = resolve(object);
    if (info) {
        return makePromise({
            "viewInfo": function () {
                return info;
            }
        }, function fallback(op) {
            var args = array_slice(arguments);
            return send.apply(void 0, [object].concat(args));
        }, function () {
            return valueOf(object);
        });
    } else {
        return send(object, "viewInfo");
    }
}

exports.view = view;
function view(object) {
    return viewInfo(object).when(function (info) {
        var view;
        if (info.type === "function") {
            view = function () {
                return apply(object, void 0, arguments);
            };
        } else {
            view = {};
        }
        var properties = info.properties || {};
        object_keys(properties).forEach(function (name) {
            if (properties[name] === "function") {
                view[name] = function () {
                    return post(object, name, arguments);
                };
            }
        });
        return resolve(view);
    });
}

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value     promise or immediate reference to observe
 * @param fulfilled function to be called with the fulfilled value
 * @param rejected  function to be called with the rejection exception
 * @return promise for the return value from the invoked callback
 */
exports.when = when;
function when(value, fulfilled, rejected) {
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return fulfilled ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        try {
            return rejected ? rejected(exception) : reject(exception);
        } catch (newException) {
            return reject(newException);
        }
    }

    nextTick(function () {
        resolve(value).promiseSend("when", function (value) {
            if (done) {
                return;
            }
            done = true;
            resolve(value).promiseSend("when", function (value) {
                deferred.resolve(_fulfilled(value));
            }, function (exception) {
                deferred.resolve(_rejected(exception));
            });
        }, function (exception) {
            if (done) {
                return;
            }
            done = true;
            deferred.resolve(_rejected(exception));
        });
    });

    return deferred.promise;
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
exports.spread = spread;
function spread(promise, fulfilled, rejected) {
    return when(promise, function (values) {
        return fulfilled.apply(void 0, values);
    }, rejected);
}

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  This presently only works in
 * Firefox/Spidermonkey, however, this code does not cause syntax
 * errors in older engines.  This code should continue to work and
 * will in fact improve over time as the language improves.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 *  - in present implementations of generators, when a generator
 *    function is complete, it throws ``StopIteration``, ``return`` is
 *    a syntax error in the presence of ``yield``, so there is no
 *    observable return value. There is a proposal[1] to add support
 *    for ``return``, which would permit the value to be carried by a
 *    ``StopIteration`` instance, in which case it would fulfill the
 *    promise returned by the asynchronous generator.  This can be
 *    emulated today by throwing StopIteration explicitly with a value
 *    property.
 *
 *  [1]: http://wiki.ecmascript.org/doku.php?id=strawman:async_functions#reference_implementation
 *
 */
exports.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            try {
                result = generator[verb](arg);
            } catch (exception) {
                if (isStopIteration(exception)) {
                    return exception.value;
                } else {
                    return reject(exception);
                }
            }
            return when(result, callback, errback);
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "send");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 * Only useful presently in Firefox/SpiderMonkey since generators are
 * implemented.
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
exports['return'] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * Constructs a promise method that can be used to safely observe resolution of
 * a promise for an arbitrarily named method like "propfind" in a future turn.
 */
exports.sender = deprecate(sender, "sender", "dispatcher"); // XXX deprecated, use dispatcher
exports.Method = deprecate(sender, "Method", "dispatcher"); // XXX deprecated, use dispatcher
function sender(op) {
    return function (object) {
        var args = array_slice(arguments, 1);
        return send.apply(void 0, [object, op].concat(args));
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param ...args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
exports.send = deprecate(send, "send", "dispatch"); // XXX deprecated, use dispatch
function send(object, op) {
    var deferred = defer();
    var args = array_slice(arguments, 2);
    object = resolve(object);
    nextTick(function () {
        object.promiseSend.apply(
            object,
            [op, deferred.resolve].concat(args)
        );
    });
    return deferred.promise;
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
exports.dispatch = dispatch;
function dispatch(object, op, args) {
    var deferred = defer();
    object = resolve(object);
    nextTick(function () {
        object.promiseSend.apply(
            object,
            [op, deferred.resolve].concat(args)
        );
    });
    return deferred.promise;
}

/**
 * Constructs a promise method that can be used to safely observe resolution of
 * a promise for an arbitrarily named method like "propfind" in a future turn.
 *
 * "dispatcher" constructs methods like "get(promise, name)" and "put(promise)".
 */
exports.dispatcher = dispatcher;
function dispatcher(op) {
    return function (object) {
        var args = array_slice(arguments, 1);
        return dispatch(object, op, args);
    };
}

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
exports.get = dispatcher("get");

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
exports.put = dispatcher("put");

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
exports["delete"] = // XXX experimental
exports.del = dispatcher("del");

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
var post = exports.post = dispatcher("post");

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
exports.invoke = function (value, name) {
    var args = array_slice(arguments, 2);
    return post(value, name, args);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param thisp     the `this` object for the call
 * @param args      array of application arguments
 */
// XXX deprecated, use fapply
var apply = exports.apply = deprecate(dispatcher("apply"), "apply", "fapply");

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
var fapply = exports.fapply = dispatcher("fapply");

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param thisp     the `this` object for the call
 * @param ...args   array of application arguments
 */
// XXX deprecated, use fcall
exports.call = deprecate(call, "call", "fcall");
function call(value, thisp) {
    var args = array_slice(arguments, 2);
    return apply(value, thisp, args);
}

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
exports["try"] = fcall; // XXX experimental
exports.fcall = fcall;
function fcall(value) {
    var args = array_slice(arguments, 1);
    return fapply(value, args);
}

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param thisp   the `this` object for the call
 * @param ...args   array of application arguments
 */
exports.bind = deprecate(bind, "bind", "fbind"); // XXX deprecated, use fbind
function bind(value, thisp) {
    var args = array_slice(arguments, 2);
    return function bound() {
        var allArgs = args.concat(array_slice(arguments));
        return apply(value, thisp, allArgs);
    };
}

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
exports.fbind = fbind;
function fbind(value) {
    var args = array_slice(arguments, 1);
    return function fbound() {
        var allArgs = args.concat(array_slice(arguments));
        return fapply(value, allArgs);
    };
}

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually resolved object
 */
exports.keys = dispatcher("keys");

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
exports.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = promises.length;
        if (countDown === 0) {
            return resolve(promises);
        }
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            when(promise, function (value) {
                promises[index] = value;
                if (--countDown === 0) {
                    deferred.resolve(promises);
                }
            })
            .fail(deferred.reject);
        }, void 0);
        return deferred.promise;
    });
}

/**
 * Waits for all promises to be resolved, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
exports.allResolved = allResolved;
function allResolved(promises) {
    return when(promises, function (promises) {
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return array_map(promises, resolve);
        });
    });
}

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
exports["catch"] = // XXX experimental
exports.fail = fail;
function fail(promise, rejected) {
    return when(promise, void 0, rejected);
}

/**
 * Provides an opportunity to observe the rejection of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
exports["finally"] = // XXX experimental
exports.fin = fin;
function fin(promise, callback) {
    return when(promise, function (value) {
        return when(callback(), function () {
            return value;
        });
    }, function (exception) {
        return when(callback(), function () {
            return reject(exception);
        });
    });
}

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
exports.end = end; // XXX stopgap
function end(promise) {
    when(promise, void 0, function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            // If possible (that is, if in V8), transform the error stack
            // trace by removing Node and Q cruft, then concatenating with
            // the stack trace of the promise we are ``end``ing. See #57.
            if (Error.captureStackTrace && "stack" in error) {
                var errorStackFrames = getStackFrames(error);
                var promiseStackFrames = getStackFrames(promise);

                var combinedStackFrames = errorStackFrames.concat(
                    "From previous event:",
                    promiseStackFrames
                );
                error.stack = formatStackTrace(error, combinedStackFrames);
            }

            throw error;
        });
    });
}

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
exports.timeout = timeout;
function timeout(promise, ms) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error("Timed out after " + ms + " ms"));
    }, ms);

    when(promise, function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, deferred.reject);
    return deferred.promise;
}

/**
 * Returns a promise for the given value (or promised value) after some
 * milliseconds.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after some
 * time has elapsed.
 */
exports.delay = delay;
function delay(promise, timeout) {
    if (timeout === void 0) {
        timeout = promise;
        promise = void 0;
    }
    var deferred = defer();
    setTimeout(function () {
        deferred.resolve(promise);
    }, timeout);
    return deferred.promise;
}

/**
 * Passes a continuation to a Node function, which is called with a given
 * `this` value and arguments provided as an array, and returns a promise.
 *
 *      var FS = require("fs");
 *      Q.napply(FS.readFile, FS, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
exports.napply = napply;
function napply(callback, thisp, args) {
    return nbind(callback, thisp).apply(void 0, args);
}

/**
 * Passes a continuation to a Node function, which is called with a given
 * `this` value and arguments provided individually, and returns a promise.
 *
 *      var FS = require("fs");
 *      Q.ncall(FS.readFile, FS, __filename)
 *      .then(function (content) {
 *      })
 *
 */
exports.ncall = ncall;
function ncall(callback, thisp /*, ...args*/) {
    var args = array_slice(arguments, 2);
    return napply(callback, thisp, args);
}

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 *
 *      Q.nbind(FS.readFile, FS)(__filename)
 *      .then(console.log)
 *      .end()
 *
 */
exports.nbind = nbind;
function nbind(callback /* thisp, ...args*/) {
    if (arguments.length > 1) {
        var thisp = arguments[1];
        var args = array_slice(arguments, 2);

        var originalCallback = callback;
        callback = function () {
            var combinedArgs = args.concat(array_slice(arguments));
            return originalCallback.apply(thisp, combinedArgs);
        };
    }
    return function () {
        var deferred = defer();
        var args = array_slice(arguments);
        // add a continuation that resolves the promise
        args.push(deferred.makeNodeResolver());
        // trap exceptions thrown by the callback
        fapply(callback, args)
        .fail(deferred.reject);
        return deferred.promise;
    };
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
exports.npost = npost;
function npost(object, name, args) {
    return napply(object[name], object, args);
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
exports.ninvoke = ninvoke;
function ninvoke(object, name /*, ...args*/) {
    var args = array_slice(arguments, 2);
    return napply(object[name], object, args);
}

defend(exports);

});





})();
/** -*- compile-command: "jslint-cli osgViewer.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

var osgViewer = {};
/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimationFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

WebGLUtils = function() {

    /**
     * Creates the HTLM for a failure message
     * @param {string} canvasContainerId id of container of th
     *        canvas.
     * @return {string} The html.
     */
    var makeFailHTML = function(msg) {
        return '' +
            '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
        // return '' +
        //   '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
        //   '<td align="center">' +
        //   '<div style="display: table-cell; vertical-align: middle;">' +
        //   '<div style="">' + msg + '</div>' +
        //   '</div>' +
        //   '</td></tr></table>';
    };

    /**
     * Mesasge for getting a webgl browser
     * @type {string}
     */
    var GET_A_WEBGL_BROWSER = '' +
        'This page requires a browser that supports WebGL.<br/>' +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    /**
     * Mesasge for need better hardware
     * @type {string}
     */
    var OTHER_PROBLEM = '' +
        "It doesn't appear your computer can support WebGL.<br/>" +
        '<a href="http://get.webgl.org">Click here for more information.</a>';

    /**
     * Creates a webgl context. If creation fails it will
     * change the contents of the container of the <canvas>
     * tag to an error message with the correct links for WebGL.
     * @return {WebGLRenderingContext} The created context.
     */
    var setupWebGL = function(
        /** Element */ canvas, 
        /** WebGLContextCreationAttirbutes */ opt_attribs, 
        /** function:(msg) */ opt_onError) {
        function handleCreationError(msg) {
            var container = document.getElementsByTagName("body")[0];
            //var container = canvas.parentNode;
            if (container) {
                var str = window.WebGLRenderingContext ?
                    OTHER_PROBLEM :
                    GET_A_WEBGL_BROWSER;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML = makeFailHTML(str);
            }
        }

        opt_onError = opt_onError || handleCreationError;

        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function(event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!window.WebGLRenderingContext) {
                opt_onError("");
            } else {
                opt_onError("");
            }
        }

        return context;
    };

    /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
    var create3DContext = function(canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    };

    return {
        create3DContext: create3DContext,
        setupWebGL: setupWebGL
    };
}();

/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000/60);
            };
    })();
}

if (!window.cancelRequestAnimFrame) {
    window.cancelRequestAnimFrame = ( function() {
        return window.cancelAnimationFrame          ||
            window.webkitCancelRequestAnimationFrame    ||
            window.mozCancelRequestAnimationFrame       ||
            window.oCancelRequestAnimationFrame     ||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout;
    } )();
}//Copyright (c) 2009 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.

// Various functions for helping debug WebGL apps.

WebGLDebugUtils = function() {

/**
 * Wrapped logging function.
 * @param {string} msg Message to log.
 */
var log = function(msg) {
  if (window.console && window.console.log) {
    window.console.log(msg);
  }
};

/**
 * Which arguements are enums.
 * @type {!Object.<number, string>}
 */
var glValidEnumContexts = {

  // Generic setters and getters

  'enable': { 0:true },
  'disable': { 0:true },
  'getParameter': { 0:true },

  // Rendering

  'drawArrays': { 0:true },
  'drawElements': { 0:true, 2:true },

  // Shaders

  'createShader': { 0:true },
  'getShaderParameter': { 1:true },
  'getProgramParameter': { 1:true },

  // Vertex attributes

  'getVertexAttrib': { 1:true },
  'vertexAttribPointer': { 2:true },

  // Textures

  'bindTexture': { 0:true },
  'activeTexture': { 0:true },
  'getTexParameter': { 0:true, 1:true },
  'texParameterf': { 0:true, 1:true },
  'texParameteri': { 0:true, 1:true, 2:true },
  'texImage2D': { 0:true, 2:true, 6:true, 7:true },
  'texSubImage2D': { 0:true, 6:true, 7:true },
  'copyTexImage2D': { 0:true, 2:true },
  'copyTexSubImage2D': { 0:true },
  'generateMipmap': { 0:true },

  // Buffer objects

  'bindBuffer': { 0:true },
  'bufferData': { 0:true, 2:true },
  'bufferSubData': { 0:true },
  'getBufferParameter': { 0:true, 1:true },

  // Renderbuffers and framebuffers

  'pixelStorei': { 0:true, 1:true },
  'readPixels': { 4:true, 5:true },
  'bindRenderbuffer': { 0:true },
  'bindFramebuffer': { 0:true },
  'checkFramebufferStatus': { 0:true },
  'framebufferRenderbuffer': { 0:true, 1:true, 2:true },
  'framebufferTexture2D': { 0:true, 1:true, 2:true },
  'getFramebufferAttachmentParameter': { 0:true, 1:true, 2:true },
  'getRenderbufferParameter': { 0:true, 1:true },
  'renderbufferStorage': { 0:true, 1:true },

  // Frame buffer operations (clear, blend, depth test, stencil)

  'clear': { 0:true },
  'depthFunc': { 0:true },
  'blendFunc': { 0:true, 1:true },
  'blendFuncSeparate': { 0:true, 1:true, 2:true, 3:true },
  'blendEquation': { 0:true },
  'blendEquationSeparate': { 0:true, 1:true },
  'stencilFunc': { 0:true },
  'stencilFuncSeparate': { 0:true, 1:true },
  'stencilMaskSeparate': { 0:true },
  'stencilOp': { 0:true, 1:true, 2:true },
  'stencilOpSeparate': { 0:true, 1:true, 2:true, 3:true },

  // Culling

  'cullFace': { 0:true },
  'frontFace': { 0:true }
};

/**
 * Map of numbers to names.
 * @type {Object}
 */
var glEnums = null;

/**
 * Initializes this module. Safe to call more than once.
 * @param {!WebGLRenderingContext} ctx A WebGL context. If
 *    you have more than one context it doesn't matter which one
 *    you pass in, it is only used to pull out constants.
 */
function init(ctx) {
  if (glEnums === null) {
    glEnums = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
      }
    }
  }
}

/**
 * Checks the utils have been initialized.
 */
function checkInit() {
  if (glEnums === null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}

/**
 * Returns true or false if value matches any WebGL enum
 * @param {*} value Value to check if it might be an enum.
 * @return {boolean} True if value matches one of the WebGL defined enums
 */
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}

/**
 * Gets an string version of an WebGL enum.
 *
 * Example:
 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
 *
 * @param {number} value Value to return an enum for
 * @return {string} The string version of the enum.
 */
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? name :
      ("*UNKNOWN WebGL ENUM (0x" + value.toString(16) + ")");
}

/**
 * Returns the string version of a WebGL argument.
 * Attempts to convert enum arguments to strings.
 * @param {string} functionName the name of the WebGL function.
 * @param {number} argumentIndx the index of the argument.
 * @param {*} value The value of the argument.
 * @return {string} The value as a string.
 */
function glFunctionArgToString(functionName, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    if (funcInfo[argumentIndex]) {
      return glEnumToString(value);
    }
  }
  return value.toString();
}

function makePropertyWrapper(wrapper, original, propertyName) {
  //log("wrap prop: " + propertyName);
  wrapper.__defineGetter__(propertyName, function() {
    return original[propertyName];
  });
  // TODO(gmane): this needs to handle properties that take more than
  // one value?
  wrapper.__defineSetter__(propertyName, function(value) {
    //log("set: " + propertyName);
    original[propertyName] = value;
  });
}

// Makes a function that calls a function on another object.
function makeFunctionWrapper(original, functionName) {
  //log("wrap fn: " + functionName);
  var f = original[functionName];
  return function() {
    //log("call: " + functionName);
    var result = f.apply(original, arguments);
    return result;
  };
}

/**
 * Given a WebGL context returns a wrapped context that calls
 * gl.getError after every command and calls a function if the
 * result is not gl.NO_ERROR.
 *
 * @param {!WebGLRenderingContext} ctx The webgl context to
 *        wrap.
 * @param {!function(err, funcName, args): void} opt_onErrorFunc
 *        The function to call when gl.getError returns an
 *        error. If not specified the default function calls
 *        console.log with a message.
 */
function makeDebugContext(ctx, opt_onErrorFunc) {
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        for (var ii = 0; ii < args.length; ++ii) {
          argStr += ((ii === 0) ? '' : ', ') +
              glFunctionArgToString(functionName, ii, args[ii]);
        }
        log("WebGL error "+ glEnumToString(err) + " in "+ functionName +
            "(" + argStr + ")");
      };

  // Holds booleans for each GL error so after we get the error ourselves
  // we can still return it to the client app.
  var glErrorShadow = { };

  // Makes a function that calls a WebGL function and then calls getError.
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      var result = ctx[functionName].apply(ctx, arguments);
      var err = ctx.getError();
      if (err !== 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }

  // Make a an object that has a copy of every property of the WebGL context
  // but wraps all functions.
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
       wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
     } else {
       makePropertyWrapper(wrapper, ctx, propertyName);
     }
  }

  // Override the getError function with one that returns our saved results.
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow[err]) {
        glErrorShadow[err] = false;
        return err;
      }
    }
    return ctx.NO_ERROR;
  };

  return wrapper;
}

    function resetToInitialState(ctx) {
        var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
        var tmp = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
        var ii;
        for (ii = 0; ii < numAttribs; ++ii) {
            ctx.disableVertexAttribArray(ii);
            ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
            ctx.vertexAttrib1f(ii, 0);
        }
        ctx.deleteBuffer(tmp);

        var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
        for (ii = 0; ii < numTextureUnits; ++ii) {
            ctx.activeTexture(ctx.TEXTURE0 + ii);
            ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        ctx.activeTexture(ctx.TEXTURE0);
        ctx.useProgram(null);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.disable(ctx.BLEND);
        ctx.disable(ctx.CULL_FACE);
        ctx.disable(ctx.DEPTH_TEST);
        ctx.disable(ctx.DITHER);
        ctx.disable(ctx.SCISSOR_TEST);
        ctx.blendColor(0, 0, 0, 0);
        ctx.blendEquation(ctx.FUNC_ADD);
        ctx.blendFunc(ctx.ONE, ctx.ZERO);
        ctx.clearColor(0, 0, 0, 0);
        ctx.clearDepth(1);
        ctx.clearStencil(-1);
        ctx.colorMask(true, true, true, true);
        ctx.cullFace(ctx.BACK);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(true);
        ctx.depthRange(0, 1);
        ctx.frontFace(ctx.CCW);
        ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
        ctx.lineWidth(1);
        ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        // TODO: Delete this IF.
        if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
        }
        ctx.polygonOffset(0, 0);
        ctx.sampleCoverage(1, false);
        ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
        ctx.stencilMask(0xFFFFFFFF);
        ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
        ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

        // TODO: This should NOT be needed but Firefox fails with 'hint'
        while (ctx.getError()) {}
    }

    function makeLostContextSimulatingCanvas(canvas) {
        var unwrappedContext_;
        //var wrappedContext_;
        var onLost_ = [];
        var onRestored_ = [];
        var wrappedContext_ = {};
        var contextId_ = 1;
        var contextLost_ = false;
        var resourceId_ = 0;
        var resourceDb_ = [];
        var numCallsToLoseContext_ = 0;
        var numCalls_ = 0;
        var canRestore_ = false;
        var restoreTimeout_ = 0;

        // Holds booleans for each GL error so can simulate errors.
        var glErrorShadow_ = { };

        canvas.getContext = function(f) {
            return function() {
                var ctx = f.apply(canvas, arguments);
                // Did we get a context and is it a WebGL context?
                if (ctx instanceof WebGLRenderingContext) {
                    if (ctx != unwrappedContext_) {
                        if (unwrappedContext_) {
                            throw "got different context";
                        }
                        unwrappedContext_ = ctx;
                        wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
                    }
                    return wrappedContext_;
                }
                return ctx;
            };
        }(canvas.getContext);

        function wrapEvent(listener) {
            if (typeof(listener) == "function") {
                return listener;
            } else {
                return function(info) {
                    listener.handleEvent(info);
                }
            }
        }

        var addOnContextLostListener = function(listener) {
            onLost_.push(wrapEvent(listener));
        };

        var addOnContextRestoredListener = function(listener) {
            onRestored_.push(wrapEvent(listener));
        };


        function wrapAddEventListener(canvas) {
            var f = canvas.addEventListener;
            canvas.addEventListener = function(type, listener, bubble) {
                switch (type) {
                case 'webglcontextlost':
                    addOnContextLostListener(listener);
                    break;
                case 'webglcontextrestored':
                    addOnContextRestoredListener(listener);
                    break;
                default:
                    f.apply(canvas, arguments);
                }
            };
        }

        wrapAddEventListener(canvas);

        canvas.loseContext = function() {
            if (!contextLost_) {
                contextLost_ = true;
                numCallsToLoseContext_ = 0;
                ++contextId_;
                while (unwrappedContext_.getError()) {}
                clearErrors();
                glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
                var event = makeWebGLContextEvent("context lost");
                var callbacks = onLost_.slice();
                setTimeout(function() {
                    //log("numCallbacks:" + callbacks.length);
                    for (var ii = 0; ii < callbacks.length; ++ii) {
                        //log("calling callback:" + ii);
                        callbacks[ii](event);
                    }
                    if (restoreTimeout_ >= 0) {
                        setTimeout(function() {
                            canvas.restoreContext();
                        }, restoreTimeout_);
                    }
                }, 0);
            }
        };

        canvas.restoreContext = function() {
            if (contextLost_) {
                if (onRestored_.length) {
                    setTimeout(function() {
                        if (!canRestore_) {
                            throw "can not restore. webglcontestlost listener did not call event.preventDefault";
                        }
                        freeResources();
                        resetToInitialState(unwrappedContext_);
                        contextLost_ = false;
                        numCalls_ = 0;
                        canRestore_ = false;
                        var callbacks = onRestored_.slice();
                        var event = makeWebGLContextEvent("context restored");
                        for (var ii = 0; ii < callbacks.length; ++ii) {
                            callbacks[ii](event);
                        }
                    }, 0);
                }
            }
        };

        canvas.loseContextInNCalls = function(numCalls) {
            if (contextLost_) {
                throw "You can not ask a lost contet to be lost";
            }
            numCallsToLoseContext_ = numCalls_ + numCalls;
        };

        canvas.getNumCalls = function() {
            return numCalls_;
        };

        canvas.setRestoreTimeout = function(timeout) {
            restoreTimeout_ = timeout;
        };

        function isWebGLObject(obj) {
            //return false;
            return (obj instanceof WebGLBuffer ||
                    obj instanceof WebGLFramebuffer ||
                    obj instanceof WebGLProgram ||
                    obj instanceof WebGLRenderbuffer ||
                    obj instanceof WebGLShader ||
                    obj instanceof WebGLTexture);
        }

        function checkResources(args) {
            for (var ii = 0; ii < args.length; ++ii) {
                var arg = args[ii];
                if (isWebGLObject(arg)) {
                    return arg.__webglDebugContextLostId__ == contextId_;
                }
            }
            return true;
        }

        function clearErrors() {
            var k = Object.keys(glErrorShadow_);
            for (var ii = 0; ii < k.length; ++ii) {
                delete glErrorShadow_[k];
            }
        }

        function loseContextIfTime() {
            ++numCalls_;
            if (!contextLost_) {
                if (numCallsToLoseContext_ == numCalls_) {
                    canvas.loseContext();
                }
            }
        }

        // Makes a function that simulates WebGL when out of context.
        function makeLostContextFunctionWrapper(ctx, functionName) {
            var f = ctx[functionName];
            return function() {
                // log("calling:" + functionName);
                // Only call the functions if the context is not lost.
                loseContextIfTime();
                if (!contextLost_) {
                    //if (!checkResources(arguments)) {
                    //  glErrorShadow_[wrappedContext_.INVALID_OPERATION] = true;
                    //  return;
                    //}
                    var result = f.apply(ctx, arguments);
                    return result;
                }
            };
        }

        function freeResources() {
            for (var ii = 0; ii < resourceDb_.length; ++ii) {
                var resource = resourceDb_[ii];
                if (resource instanceof WebGLBuffer) {
                    unwrappedContext_.deleteBuffer(resource);
                } else if (resource instanceof WebGLFramebuffer) {
                    unwrappedContext_.deleteFramebuffer(resource);
                } else if (resource instanceof WebGLProgram) {
                    unwrappedContext_.deleteProgram(resource);
                } else if (resource instanceof WebGLRenderbuffer) {
                    unwrappedContext_.deleteRenderbuffer(resource);
                } else if (resource instanceof WebGLShader) {
                    unwrappedContext_.deleteShader(resource);
                } else if (resource instanceof WebGLTexture) {
                    unwrappedContext_.deleteTexture(resource);
                }
            }
        }

        function makeWebGLContextEvent(statusMessage) {
            return {
                statusMessage: statusMessage,
                preventDefault: function() {
                    canRestore_ = true;
                }
            };
        }

        return canvas;

        function makeLostContextSimulatingContext (ctx) {
            // copy all functions and properties to wrapper
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'function') {
                    wrappedContext_[propertyName] = makeLostContextFunctionWrapper(
                        ctx, propertyName);
                } else {
                    makePropertyWrapper(wrappedContext_, ctx, propertyName);
                }
            }

            // Wrap a few functions specially.
            wrappedContext_.getError = function() {
                loseContextIfTime();
                var err;
                if (!contextLost_) {
                    while (err = unwrappedContext_.getError()) {
                        glErrorShadow_[err] = true;
                    }
                }
                for (err in glErrorShadow_) {
                    if (glErrorShadow_[err]) {
                        delete glErrorShadow_[err];
                        return err;
                    }
                }
                return wrappedContext_.NO_ERROR;
            };

            var creationFunctions = [
                "createBuffer",
                "createFramebuffer",
                "createProgram",
                "createRenderbuffer",
                "createShader",
                "createTexture"
            ];
            for (var ii = 0; ii < creationFunctions.length; ++ii) {
                var functionName = creationFunctions[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return null;
                        }
                        var obj = f.apply(ctx, arguments);
                        obj.__webglDebugContextLostId__ = contextId_;
                        resourceDb_.push(obj);
                        return obj;
                    };
                }(ctx[functionName]);
            }

            var functionsThatShouldReturnNull = [
                "getActiveAttrib",
                "getActiveUniform",
                "getBufferParameter",
                "getContextAttributes",
                "getAttachedShaders",
                "getFramebufferAttachmentParameter",
                "getParameter",
                "getProgramParameter",
                "getProgramInfoLog",
                "getRenderbufferParameter",
                "getShaderParameter",
                "getShaderInfoLog",
                "getShaderSource",
                "getTexParameter",
                "getUniform",
                "getUniformLocation",
                "getVertexAttrib"
            ];
            for (ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
                var functionName = functionsThatShouldReturnNull[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return null;
                        }
                        return f.apply(ctx, arguments);
                    }
                }(wrappedContext_[functionName]);
            }

            var isFunctions = [
                "isBuffer",
                "isEnabled",
                "isFramebuffer",
                "isProgram",
                "isRenderbuffer",
                "isShader",
                "isTexture"
            ];
            for (var ii = 0; ii < isFunctions.length; ++ii) {
                var functionName = isFunctions[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return false;
                        }
                        return f.apply(ctx, arguments);
                    }
                }(wrappedContext_[functionName]);
            }

            wrappedContext_.checkFramebufferStatus = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.checkFramebufferStatus);

            wrappedContext_.getAttribLocation = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return -1;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getAttribLocation);

            wrappedContext_.getVertexAttribOffset = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return 0;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getVertexAttribOffset);

            wrappedContext_.isContextLost = function() {
                return contextLost_;
            };

            return wrappedContext_;
        }
    }

return {
    /**
     * Initializes this module. Safe to call more than once.
     * @param {!WebGLRenderingContext} ctx A WebGL context. If
    }
   *    you have more than one context it doesn't matter which one
   *    you pass in, it is only used to pull out constants.
   */
  'init': init,

  /**
   * Returns true or false if value matches any WebGL enum
   * @param {*} value Value to check if it might be an enum.
   * @return {boolean} True if value matches one of the WebGL defined enums
   */
  'mightBeEnum': mightBeEnum,

  /**
   * Gets an string version of an WebGL enum.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
   *
   * @param {number} value Value to return an enum for
   * @return {string} The string version of the enum.
   */
  'glEnumToString': glEnumToString,

  /**
   * Converts the argument of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 0, gl.TEXTURE_2D);
   *
   * would return 'TEXTURE_2D'
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} argumentIndx the index of the argument.
   * @param {*} value The value of the argument.
   * @return {string} The value as a string.
   */
  'glFunctionArgToString': glFunctionArgToString,

  /**
   * Given a WebGL context returns a wrapped context that calls
   * gl.getError after every command and calls a function if the
   * result is not NO_ERROR.
   *
   * You can supply your own function if you want. For example, if you'd like
   * an exception thrown on any GL error you could do this
   *
   *    function throwOnGLError(err, funcName, args) {
   *      throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" +
   *            funcName;
   *    };
   *
   *    ctx = WebGLDebugUtils.makeDebugContext(
   *        canvas.getContext("webgl"), throwOnGLError);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
   *     to call when gl.getError returns an error. If not specified the default
   *     function calls console.log with a message.
   */
  'makeDebugContext': makeDebugContext,

  /**
   * Given a canvas element returns a wrapped canvas element that will
   * simulate lost context. The canvas returned adds the following functions.
   *
   * loseContext:
   *   simulates a lost context event.
   *
   * restoreContext:
   *   simulates the context being restored.
   *
   * lostContextInNCalls:
   *   loses the context after N gl calls.
   *
   * getNumCalls:
   *   tells you how many gl calls there have been so far.
   *
   * setRestoreTimeout:
   *   sets the number of milliseconds until the context is restored
   *   after it has been lost. Defaults to 0. Pass -1 to prevent
   *   automatic restoring.
   *
   * @param {!Canvas} canvas The canvas element to wrap.
   */
  'makeLostContextSimulatingCanvas': makeLostContextSimulatingCanvas,

  /**
   * Resets a context to the initial state.
   * @param {!WebGLRenderingContext} ctx The webgl context to
   *     reset.
   */
  'resetToInitialState': resetToInitialState
};

}();
/** -*- compile-command: "jslint-cli stats.js" -*-
 *
 *  Copyright (C) 2010 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.net>
 *
 */

var Stats = {};

Stats.Stats = function(canvas) {
    this.layers = [];
    this.last_update = undefined;
    this.canvas = canvas;
};

Stats.Stats.prototype = {
    addLayer: function(color, getter) {
        if (color === undefined) {
            color = "rgb(255,255,255)";
        }
        this.layers.push({ 
            previous: 0, 
            color: color,
            getValue: getter
        });
    },

    update: function() {
        
        var t = (new Date()).getTime();
        if (this.last_update === undefined) {
            this.last_update = t;
        }
        var delta = (t - this.last_update)* 2.0*60.0/1000.0;
        if (delta < 1.0) {
            return;
        }

        var report = delta - Math.floor(delta);
        t -= report/(2.0*60.0/1000.0);
        delta = Math.floor(delta);

        var translate = delta;
        var c = this.canvas;
        var width = c.width;
        var height = c.height;
        var ctx = c.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation="copy";
        ctx.mozImageSmoothingEnabled = false;
        ctx.translate(-delta,0);
        ctx.drawImage(c, 0, 0, width, height);
        ctx.restore();
        ctx.clearRect(width - delta, 0, delta, height);

        for (var i = 0, l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            c = this.canvas;
            var value = layer.getValue(t);
            width = c.width;
            height = c.height;

            ctx.lineWidth = 1.0;
            ctx.strokeStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(width - delta, height - layer.previous);
            ctx.lineTo(width, height - value);
            ctx.stroke();
            layer.previous = value;
        }
        this.last_update = t;
    }
};/** -*- compile-command: "jslint-cli View.js" -*- */
osgViewer.View = function() {
    this._graphicContext = undefined;
    this._camera = new osg.Camera();
    this._scene = new osg.Node();
    this._sceneData = undefined;
    this._frameStamp = new osg.FrameStamp();
    this._lightingMode = undefined;
    this._manipulator = undefined;

    this.setLightingMode(osgViewer.View.LightingMode.HEADLIGHT);

    this._scene.getOrCreateStateSet().setAttributeAndMode(new osg.Material());
    this._scene.getOrCreateStateSet().setAttributeAndMode(new osg.Depth());
    this._scene.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc());
    this._scene.getOrCreateStateSet().setAttributeAndMode(new osg.CullFace());
};

osgViewer.View.LightingMode = {
    NO_LIGHT:  0,
    HEADLIGHT: 1,
    SKY_LIGHT: 2
};

osgViewer.View.prototype = {
    setGraphicContext: function(gc) { this._graphicContext = gc; },
    getGraphicContext: function() { return this._graphicContext; },
    setUpView: function (canvas) {
        var ratio = canvas.width/canvas.height;
        this._camera.setViewport(new osg.Viewport(0,0, canvas.width, canvas.height));
        osg.Matrix.makeLookAt([0,0,-10], [0,0,0], [0,1,0], this._camera.getViewMatrix());
        osg.Matrix.makePerspective(60, ratio, 1.0, 1000.0, this._camera.getProjectionMatrix());
    },
    computeIntersections: function (x, y, traversalMask) {
        if (traversalMask === undefined) {
            traversalMask = ~0;
        }
        
        var iv = new osgUtil.IntersectVisitor();
        iv.setTraversalMask(traversalMask);
        iv.addLineSegment([x,y,0.0], [x,y,1.0]);
        iv.pushCamera(this._camera);
        this._sceneData.accept(iv);
        return iv.hits;
    },

    setFrameStamp: function(frameStamp) { this._frameStamp = frameStamp;},
    getFrameStamp: function() { return this._frameStamp; },
    setCamera: function(camera) { this._camera = camera; },
    getCamera: function() { return this._camera; },

    setSceneData: function(node) {
        this._scene.removeChildren();
        this._scene.addChild( node );
        this._sceneData = node;
    },
    getSceneData: function() { return this._sceneData; },
    getScene: function() { return this._scene;},

    getManipulator: function() { return this._manipulator; },
    setManipulator: function(manipulator) { this._manipulator = manipulator; },

    getLight: function() { return this._light; },
    setLight: function(light) { 
        this._light = light;
        if (this._lightingMode !== osgViewer.View.LightingMode.NO_LIGHT) {
            this._scene.getOrCreateStateSet().setAttributeAndMode(this._light);
        }
    },
    getLightingMode: function() { return this._lightingMode; },
    setLightingMode: function(lightingMode) {
        if (this._lightingMode !== lightingMode) {
            this._lightingMode = lightingMode;
            if (this._lightingMode !== osgViewer.View.LightingMode.NO_LIGHT) {
                if (! this._light) {
                    this._light = new osg.Light();
                    this._light.setAmbient([0.2,0.2,0.2,1.0]);
                    this._light.setDiffuse([0.8,0.8,0.8,1.0]);
                    this._light.setSpecular([0.5,0.5,0.5,1.0]);
                }
            } else {
                this._light = undefined;
            }
        }
    }

};
/** -*- compile-command: "jslint-cli Viewer.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */


osgViewer.Viewer = function(canvas, options, error) {
    osgViewer.View.call(this);

    if (options === undefined) {
        options = {antialias : true};
    }

    if (osg.SimulateWebGLLostContext) {
        canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas);
        canvas.loseContextInNCalls(osg.SimulateWebGLLostContext);
    }

    gl = WebGLUtils.setupWebGL(canvas, options, error );
    var self = this;
    canvas.addEventListener("webglcontextlost", function(event) {
        self.contextLost();
        event.preventDefault();
    }, false);

    canvas.addEventListener("webglcontextrestored", function() {
        self.contextRestored();
    }, false);


    if (osg.reportWebGLError) {
        gl = WebGLDebugUtils.makeDebugContext(gl);
    }


    if (gl) {
        this.setGraphicContext(gl);
        osg.init();
        this._canvas = canvas;
        this._frameRate = 60.0;
        osgUtil.UpdateVisitor = osg.UpdateVisitor;
        osgUtil.CullVisitor = osg.CullVisitor;
        this._urlOptions = true;

        this._mouseWheelEventNode = canvas;
        this._mouseEventNode = canvas;
        this._keyboardEventNode = document;
        if (options) {
            if(options.mouseWheelEventNode){
                this._mouseWheelEventNode = options.mouseWheelEventNode;
            }
            if(options.mouseEventNode){
                this._mouseEventNode = options.mouseEventNode;
            }
            if(options.keyboardEventNode){
                this._keyboardEventNode = options.keyboardEventNode;
            }
        }

        this.setUpView(canvas);
    } else {
        throw "No WebGL implementation found";
    }
};


osgViewer.Viewer.prototype = osg.objectInehrit(osgViewer.View.prototype, {

    contextLost: function() {
        osg.log("webgl context lost");
        cancelRequestAnimFrame(this._requestID);
    },
    contextRestored: function() {
        osg.log("webgl context restored, but not supported - reload the page");
    },

    init: function() {
        this._done = false;
        this._state = new osg.State();

        var gl = this.getGraphicContext();
        this._state.setGraphicContext(gl);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        this._updateVisitor = new osgUtil.UpdateVisitor();
        this._cullVisitor = new osgUtil.CullVisitor();

        this._renderStage = new osg.RenderStage();
        this._stateGraph = new osg.StateGraph();

        if (this._urlOptions) {
            this.parseOptions();
        }

        this.getCamera().setClearColor([0.0, 0.0, 0.0, 0.0]);
    },
    getState: function() {
        // would have more sense to be in view
        // but I would need to put cull and draw on lower Object
        // in View or a new Renderer object
        return this._state;
    },
    parseOptions: function() {

        var optionsURL = function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                var element = hash[0].toLowerCase();
                vars.push(element);
                var result = hash[1];
                if (result === undefined) {
                    result = "1";
                }
                vars[element] = result.toLowerCase();

            }
            return vars;
        };
        
        var options = optionsURL();
        
        if (options.stats === "1") {
            this.initStats(options);
        }
        
        var gl = this.getGraphicContext();
        // not the best way to do it
        if (options.depth_test === "0") {
            this.getGraphicContext().disable(gl.DEPTH_TEST);
        }
        if (options.blend === "0") {
            this.getGraphicContext().disable(gl.BLEND);
        }
        if (options.cull_face === "0") {
            this.getGraphicContext().disable(gl.CULL_FACE);
        }
        if (options.light === "0") {
            this.setLightingMode(osgViewer.View.LightingMode.NO_LIGHT);
        }
    },

    

    initStats: function(options) {

        var maxMS = 50;
        var stepMS = 10;
        var fontsize = 14;

        if (options.statsMaxMS !== undefined) {
            maxMS = parseInt(options.statsMaxMS,10);
        }
        if (options.statsStepMS !== undefined) {
            stepMS = parseInt(options.statsStepMS,10);
        }

        var createDomElements = function (elementToAppend) {
            var dom = [
                "<div id='StatsDiv' style='float: left; position: relative; width: 300px; height: 150px; z-index: 10;'>",
                "<div id='StatsLegends' style='position: absolute; left: 0px; font-size: " + fontsize +"px;color: #ffffff;'>",

                "<div id='frameRate' style='color: #00ff00;' > frameRate </div>",
                "<div id='frameTime' style='color: #ffff00;' > frameTime </div>",
                "<div id='updateTime' style='color: #d07b1f;'> updateTime </div>",
                "<div id='cullTime' style='color: #73e0ff;'> cullTime </div>",
                "<div id='drawTime' style='color: #ff0000;'> drawTime </div>",
                "<div id='fps'> </div>",
                
                "</div>",

                "<div id='StatsCanvasDiv' style='position: relative;'>",
                "<canvas id='StatsCanvasGrid' width='300' height='150' style='z-index:-1; position: absolute; background: rgba(14,14,14,0.8); ' ></canvas>",
                "<canvas id='StatsCanvas' width='300' height='150' style='z-index:8; position: absolute;' ></canvas>",
                "<canvas id='StatsCanvasFps' width='30' height='15' style='z-index:9; position: absolute; top: 130px' ></canvas>",
                "</div>",

                "</div>"
            ].join("\n");
            var parent;
            if (elementToAppend === undefined) {
                parent = document.body;
                //elementToAppend = "body";
            } else {
                parent = document.getElementById(elementToAppend);
            }

            //jQuery(dom).appendTo(elementToAppend);
            var mydiv = document.createElement('div');
            mydiv.innerHTML = dom;
            parent.appendChild(mydiv);

            var grid = document.getElementById("StatsCanvasGrid");
            var ctx = grid.getContext("2d");
            ctx.clearRect(0,0,grid.width, grid.height);

            var step = Math.floor(maxMS/stepMS).toFixed(0);
            var r = grid.height/step;
            ctx.strokeStyle = "rgb(70,70,70)";
            for (var i = 0, l = step; i < l; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i*r);
                ctx.lineTo(grid.width, i*r);
                ctx.stroke();
            }

            // setup the font for fps
            var cfps = document.getElementById("StatsCanvasFps");
            ctx = cfps.getContext("2d");
            ctx.font = "14px Sans";

            return document.getElementById("StatsCanvas");
        };

        if (this._canvasStats === undefined || this._canvasStats === null) {
            this._canvasStats = createDomElements();
        }
        this._stats = new Stats.Stats(this._canvasStats);
        var that = this;
        this._frameRate = 1;
        this._frameTime = 0;
        this._updateTime = 0;
        this._cullTime = 0;
        this._drawTime = 0;
        var height = this._canvasStats.height;
        var ratio = height / maxMS;
        height = height - 2;
        var getStyle = function(el,styleProp)
        {
            var x = document.getElementById(el);
            if (x.style) {
		return x.style.getPropertyValue(styleProp);
            }
            return null;
        };
        this._stats.addLayer(getStyle("frameRate","color"), function(t) { 
            var v = (height)/60.0 * (1000/that._frameRate);
            if (v > height) {
                return height;
            }
            return v;} );
        this._stats.addLayer(getStyle("frameTime", "color"), function(t) { 
            var v = that._frameTime * ratio;
            if (v > height) {
                return height;
            }
            return v;} );
        this._stats.addLayer(getStyle("updateTime","color"), function(t) { 
            var v = that._updateTime * ratio;
            if (v > height) {
                return height;
            }
            return v;} );
        this._stats.addLayer(getStyle("cullTime","color"), function(t) { 
            var v = that._cullTime * ratio;
            if (v > height) {
                return height;
            }
            return v;} );
        this._stats.addLayer(getStyle("drawTime","color"), function(t) { 
            var v = that._drawTime * ratio;
            if (v > height) {
                return height;
            }
            return v;} );
    },

    update: function() {
        this.getScene().accept(this._updateVisitor);
    },
    cull: function() {
        // this part of code should be called for each view
        // right now, we dont support multi view
        this._stateGraph.clean();
        this._renderStage.reset();

        this._cullVisitor.reset();
        this._cullVisitor.setStateGraph(this._stateGraph);
        this._cullVisitor.setRenderStage(this._renderStage);
        var camera = this.getCamera();
        this._cullVisitor.pushStateSet(camera.getStateSet());
        this._cullVisitor.pushProjectionMatrix(camera.getProjectionMatrix());

        // update bound
        var bs = camera.getBound();

        var identity = osg.Matrix.makeIdentity([]);
        this._cullVisitor.pushModelviewMatrix(identity);

        if (this._light) {
            this._cullVisitor.addPositionedAttribute(this._light);
        }

        this._cullVisitor.pushModelviewMatrix(camera.getViewMatrix());
        this._cullVisitor.pushViewport(camera.getViewport());
        this._cullVisitor.setCullSettings(camera);

        this._renderStage.setClearDepth(camera.getClearDepth());
        this._renderStage.setClearColor(camera.getClearColor());
        this._renderStage.setClearMask(camera.getClearMask());
        this._renderStage.setViewport(camera.getViewport());

        //osg.CullVisitor.prototype.handleCullCallbacksAndTraverse.call(this._cullVisitor,camera);
        this.getScene().accept(this._cullVisitor);

        // fix projection matrix if camera has near/far auto compute
        this._cullVisitor.popModelviewMatrix();
        this._cullVisitor.popProjectionMatrix();
        this._cullVisitor.popViewport();
        this._cullVisitor.popStateSet();

        this._renderStage.sort();
    },
    draw: function() {
        var state = this.getState();
        this._renderStage.draw(state);

        // noticed that we accumulate lot of stack, maybe because of the stateGraph
        state.popAllStateSets();
        state.applyWithoutProgram();  //state.apply(); // apply default state (global)
    },

    frame: function() {
        var frameTime, beginFrameTime;
        frameTime = (new Date()).getTime();
        if (this._lastFrameTime === undefined) {
            this._lastFrameTime = 0;
        }
        this._frameRate = frameTime - this._lastFrameTime;
        this._lastFrameTime = frameTime;
        beginFrameTime = frameTime;

        var frameStamp = this.getFrameStamp();

        if (frameStamp.getFrameNumber() === 0) {
            frameStamp.setReferenceTime(frameTime/1000.0);
            this._numberFrame = 0;
        }

        frameStamp.setSimulationTime(frameTime/1000.0 - frameStamp.getReferenceTime());

        // setup framestamp
        this._updateVisitor.setFrameStamp(this.getFrameStamp());
        //this._cullVisitor.setFrameStamp(this.getFrameStamp());

        if (this.getManipulator()) {
            this.getManipulator().update(this._updateVisitor);
            osg.Matrix.copy(this.getManipulator().getInverseMatrix(), this.getCamera().getViewMatrix());
        }

        // time the update
        var updateTime = (new Date()).getTime();
        this.update();

        var cullTime = (new Date()).getTime();
        updateTime = cullTime - updateTime;
        this._updateTime = updateTime;

        this.cull();
        var drawTime = (new Date()).getTime();
        cullTime = drawTime - cullTime;
        this._cullTime = cullTime;

        this.draw();
        drawTime = (new Date()).getTime() - drawTime;
        this._drawTime = drawTime;

        var f = frameStamp.getFrameNumber()+1;
        frameStamp.setFrameNumber(f);

        this._numberFrame++;
        var endFrameTime = (new Date()).getTime();

        this._frameTime = (new Date()).getTime() - beginFrameTime;
        if (this._stats !== undefined) {
            this._stats.update();

            if (this._numberFrame % 60 === 0.0) {
                var nd = endFrameTime;
                var diff = nd - this._statsStartTime;
                var fps = (this._numberFrame*1000/diff).toFixed(1);
                this._statsStartTime = nd;
                this._numberFrame = 0;

                var cfps = document.getElementById("StatsCanvasFps");
                var ctx = cfps.getContext("2d");
                ctx.clearRect(0,0,cfps.width, cfps.height);
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(fps, 0, cfps.height);
            }
        }
    },

    setDone: function(bool) { this._done = bool; },
    done: function() { return this._done; },

    run: function() {
        var self = this;
        var render = function() {
            if (!self.done()) {
                self._requestID = window.requestAnimationFrame(render, self.canvas);
                self.frame();
            }
        };
        render();
    },

    setupManipulator: function(manipulator, dontBindDefaultEvent) {
        if (manipulator === undefined) {
            manipulator = new osgGA.OrbitManipulator();
        }

        if (manipulator.setNode !== undefined) {
            manipulator.setNode(this.getSceneData());
        } else {
            // for backward compatibility
            manipulator.view = this;
        }

        this.setManipulator(manipulator);

        var that = this;
        var viewer = this;
	var fixEvent = function( event ) {

            //if ( event[ expando ] ) {
                //return event;
            //}

            // store a copy of the original event object
            // and "clone" to set read-only properties

            // nop
            //var originalEvent = event;
            //event = jQuery.Event( originalEvent );

            for ( var i = this.props.length, prop; i; ) {
                prop = this.props[ --i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Fix target property, if necessary
            if ( !event.target ) {
                event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
            }

            // check if target is a textnode (safari)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && event.fromElement ) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX === null && event.clientX !== null ) {
                var doc = document.documentElement, body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
            }

            // Add which for key events
            if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
                event.which = event.charCode || event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if ( !event.metaKey && event.ctrlKey ) {
                event.metaKey = event.ctrlKey;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && event.button !== undefined ) {
                event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
            }

            return event;
        };

        if (dontBindDefaultEvent === undefined || dontBindDefaultEvent === false) {

            var disableMouse = false;

            var touchstart = function(ev)
            {
                //disableMouse = true;
                return viewer.getManipulator().touchstart(ev);
            };
            var touchend = function(ev)
            {
                //disableMouse = true;
                return viewer.getManipulator().touchend(ev);
            };
            var touchmove = function(ev)
            {
                //disableMouse = true;
                return viewer.getManipulator().touchmove(ev);
            };

            var touchcancel = function(ev)
            {
                //disableMouse = true;
                return viewer.getManipulator().touchcancel(ev);
            };

            var touchleave = function(ev)
            {
                //disableMouse = true;
                return viewer.getManipulator().touchleave(ev);
            };

            // iphone/ipad
            var gesturestart = function(ev)
            {
                return viewer.getManipulator().gesturestart(ev);
            };
            var gesturechange = function(ev)
            {
                return viewer.getManipulator().gesturechange(ev);
            };
            var gestureend = function(ev)
            {
                return viewer.getManipulator().gestureend(ev);
            };

            // touch events
            this._canvas.addEventListener("touchstart", touchstart, false);
            this._canvas.addEventListener("touchend", touchend, false);
            this._canvas.addEventListener("touchmove", touchmove, false);
            this._canvas.addEventListener("touchcancel", touchcancel, false);
            this._canvas.addEventListener("touchleave", touchleave, false);

            // iphone/ipad 
            this._canvas.addEventListener("gesturestart", gesturestart, false);
            this._canvas.addEventListener("gesturechange", gesturechange, false);
            this._canvas.addEventListener("gestureend", gestureend, false);

            // mouse
            var mousedown = function (ev)
            {
                if (disableMouse === false) {
                    return viewer.getManipulator().mousedown(ev);
                }
            };
            var mouseup = function (ev)
            {
                if (disableMouse === false) {
                    return viewer.getManipulator().mouseup(ev);
                }
            };
            var mousemove = function (ev)
            {
                if (disableMouse === false) {
                    return viewer.getManipulator().mousemove(ev);
                }
            };
            var dblclick = function (ev)
            {
                if (disableMouse === false) {
                    return viewer.getManipulator().dblclick(ev);
                }
            };
            var mousewheel = function (event)
            {
                if (disableMouse === false) {
                    // from jquery
                    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
                    //event = $.event.fix(orgEvent);
                    event.type = "mousewheel";
                    
                    // Old school scrollwheel delta
                    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
                    if ( event.detail     ) { delta = -event.detail/3; }
                    
                    // New school multidimensional scroll (touchpads) deltas
                    deltaY = delta;
                    
                    // Gecko
                    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
                        deltaY = 0;
                        deltaX = -1*delta;
                    }
                    
                    // Webkit
                    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
                    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
                    // Add event and delta to the front of the arguments
                    args.unshift(event, delta, deltaX, deltaY);
                    var m = viewer.getManipulator();
                    return m.mousewheel.apply(m, args);
                }
            };

            if (viewer.getManipulator().mousedown) {
                this._mouseEventNode.addEventListener("mousedown", mousedown, false);
            }
            if (viewer.getManipulator().mouseup) {
                this._mouseEventNode.addEventListener("mouseup", mouseup, false);
            }
            if (viewer.getManipulator().mousemove) {
                this._mouseEventNode.addEventListener("mousemove", mousemove, false);
            }
            if (viewer.getManipulator().dblclick) {
                this._mouseEventNode.addEventListener("dblclick", dblclick, false);
            }
            if (viewer.getManipulator().mousewheel) {
                this._mouseWheelEventNode.addEventListener("DOMMouseScroll", mousewheel, false);
                this._mouseWheelEventNode.addEventListener("mousewheel", mousewheel, false);
            }

            var keydown = function(ev) {return viewer.getManipulator().keydown(ev); };
            var keyup = function(ev) {return viewer.getManipulator().keyup(ev);};

            if (viewer.getManipulator().keydown) {
                this._keyboardEventNode.addEventListener("keydown", keydown, false);
            }
            if (viewer.getManipulator().keyup) {
                this._keyboardEventNode.addEventListener("keyup", keyup, false);
            }

            var self = this;
            var resize = function(ev) {
                var w = window.innerWidth;
                var h = window.innerHeight;

                var prevWidth = self._canvas.width;
                var prevHeight = self._canvas.height;
                self._canvas.width = w;
                self._canvas.height = h;
                self._canvas.style.width = w;
                self._canvas.style.height = h;
                osg.log("window resize "  + prevWidth + "x" + prevHeight + " to " + w + "x" + h);
                var camera = self.getCamera();
                var vp = camera.getViewport();
                var widthChangeRatio = w/vp.width();
                var heightChangeRatio = h/vp.height();
                var aspectRatioChange = widthChangeRatio / heightChangeRatio; 
                vp.setViewport(vp.x()*widthChangeRatio, vp.y()*heightChangeRatio, vp.width()*widthChangeRatio, vp.height()*heightChangeRatio);

                if (aspectRatioChange !== 1.0) {

                    osg.Matrix.postMult(osg.Matrix.makeScale(1.0, aspectRatioChange, 1.0 ,[]), camera.getProjectionMatrix());
                }
            };
            window.onresize = resize;
        }
    }
});
/** -*- compile-command: "jslint-cli osgGA.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

osgGA = {};
/** -*- compile-command: "jslint-cli Manipulator.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

/** 
 *  Manipulator
 *  @class
 */
osgGA.Manipulator = function() {
    this._touches = [];

    this._inverseMatrix = new Array(16);
    osg.Matrix.makeIdentity(this._inverseMatrix);
};

/** @lends osgGA.Manipulator.prototype */
osgGA.Manipulator.prototype = {
    getPositionRelativeToCanvas: function(e) {
        var myObject = e.target;
        var posx,posy;
	if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
        var divGlobalOffset = function(obj) {
            var x=0, y=0;
            x = obj.offsetLeft;
            y = obj.offsetTop;
            var body = document.getElementsByTagName('body')[0];
            while (obj.offsetParent && obj!=body){
                x += obj.offsetParent.offsetLeft;
                y += obj.offsetParent.offsetTop;
                obj = obj.offsetParent;
            }
            return [x,y];
        };
	// posx and posy contain the mouse position relative to the document
	// Do something with this information
        var globalOffset = divGlobalOffset(myObject);
        posx = posx - globalOffset[0];
        posy = myObject.height-(posy - globalOffset[1]);
        return [posx,posy];
    },

    /**
       Method called when a keydown event is triggered
        @type KeyEvent
     */
    keydown: function(event) {},
    /**
       Method called when a keyup event is triggered
       @type KeyEvent
     */
    keyup: function(event) {},
    mouseup: function(event) {},
    mousedown: function(event) {},
    mousemove: function(event) {},
    dblclick: function(event) {},

    touchstart: function(event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            this._touches[id] = touch;
            // relative to element position
            var rte = this.getPositionRelativeToCanvas(touch);
            osg.debug("touch " + id + " started at " + rte[0] + " " + rte[1] );
        }
    },
    touchend: function(event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            this._touches[id] = undefined;
            // relative to element position
            var rte = this.getPositionRelativeToCanvas(touch);
            osg.debug("touch " + id + " stoped at " + rte[0] + " " + rte[1] );
        }
    },
    touchmove: function(event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            // relative to element position
            var rteCurrent = this.getPositionRelativeToCanvas(touch);
            var rtePrevious = this.getPositionRelativeToCanvas(this._touches[id]);
            var deltax = rteCurrent[0] - rtePrevious[0];
            var deltay = rteCurrent[1] - rtePrevious[1];
            this._touches[id] = touch;
            osg.debug("touch " + id + " moved " + deltax + " " + deltay);
        }
    },
    touchleave: function(event) {
        return this.touchend(event);
    },
    touchcancel: function(event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            this._touches[id] = undefined;
            var rte = this.getPositionRelativeToCanvas(touch);
            osg.debug("touch " + id + " cancelled at " + rte[0] + " " + rte[1] );
        }
    },
    gesturestart: function(event) {
        event.preventDefault();
        osg.debug("gesturestart  scale " + event.scale + " rotation " + event.rotation);
    },
    gestureend: function(event) {
        event.preventDefault();
        osg.debug("gestureend  scale " + event.scale + " rotation " + event.rotation);
    },
    gesturechange: function(event) {
        event.preventDefault();
        osg.debug("gesturechange scale " + event.scale + " rotation " + event.rotation);
    },


    mousewheel: function(event, intDelta, deltaX, deltaY) {
        event.preventDefault();
        osg.debug("mousewheel " + intDelta + " " + " " + deltaX + " " + deltaY );
    },

    // The node visitor let you get information during the traverse time.
    // it contains a FrameStamp object

    // setReferenceTime = function(s) { startSimulation = s; };
    // setSimulationTime = function(s) { currentSimulation = s; };
    // getReferenceTime = function() { return startSimulation; };
    // getSimulationTime = function() { return currentSimulation; };
    // setFrameNumber = function(n) { frame = n; };
    // getFrameNumber = function() { return frame; };

    // eg: var currentTime = nv.getFrameStamp().getSimulationTime();
    update: function(nv) {
    },

    getInverseMatrix: function () { 
        return this._inverseMatrix;
    }

};
/** -*- compile-command: "jslint-cli OrbitManipulator.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

/** 
 *  OrbitManipulator
 *  @class
 */
osgGA.OrbitManipulator = function () {
    osgGA.Manipulator.call(this);
    this.init();
};

osgGA.OrbitManipulator.Rotate = 0;
osgGA.OrbitManipulator.Pan = 1;
osgGA.OrbitManipulator.Zoom = 2;

osgGA.OrbitManipulator.Interpolator = function(size, delay) {
    this._current = new Array(size);
    this._target = new Array(size);
    this._delta = new Array(size);
    this._delay = delay;
    if (this._delay === undefined) {
        this._delay = 0.15;        
    }
    this._reset = false;
    this.reset();
};
osgGA.OrbitManipulator.Interpolator.prototype = {
    reset: function() {
            for (var i = 0, l = this._current.length; i < l; i++) {
                this._current[i] = this._target[i] = 0;
            }
            this._reset = true;
    },
    update: function() {
        for (var i = 0, l = this._current.length; i < l; i++) {
            var d = (this._target[i]-this._current[i])*this._delay;
            this._delta [ i ] = d;
            this._current[i] += d;
        }
        return this._delta;
    },
    set: function() {
        for (var i = 0, l = this._current.length; i < l; i++) {
            this._current[i] = this._target[i] = arguments[i];
        }
        this._reset = false;
    },
    isReset: function() { return this._reset;},
    getCurrent: function() { return this._current; },
    setTarget: function() {
        for (var i = 0, l = this._target.length; i < l; i++) {
            if (this._reset) {
                this._target[i] = this._current[i] = arguments[i];
            } else {
                this._target[i] = arguments[i];
            }
        }
        this._reset = false;
    },
    getTarget: function() { return this._target; },
    getDelta: function() {
        return this._delta;
    }
};

/** @lends osgGA.OrbitManipulator.prototype */
osgGA.OrbitManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    init: function() {
        this._distance = 25;
        this._target = new Array(3); osg.Vec3.init(this._target);

        this._rotation = osg.Matrix.mult(osg.Matrix.makeRotate( Math.PI, 0,0,1, []), osg.Matrix.makeRotate( -Math.PI/10.0, 1,0,0, []), []);
        this._time = 0.0;

        this._rotate = new osgGA.OrbitManipulator.Interpolator(2);
        this._pan = new osgGA.OrbitManipulator.Interpolator(2);
        this._zoom = new osgGA.OrbitManipulator.Interpolator(1);
        this._zoom.reset = function() {
            osgGA.OrbitManipulator.Interpolator.prototype.reset.call(this);
            this._start = 0.0;
        };

        this._buttonup = true;

        this._scale = 10.0;
        this._currentMode = undefined;
        this._maxDistance = 0;
        this._minDistance = 0;
        this._scaleMouseMotion = 1.0/10;
        this._node = undefined;

        this._moveTouch = undefined;
        this._inverseMatrix = new Array(16);
        this._rotateKey = 65; // a
        this._zoomKey = 83; // s
        this._panKey = 68; // d
    },
    reset: function() {
        this.init();
    },
    setNode: function(node) {
        this._node = node;
    },
    setTarget: function(target) {
        osg.Vec3.copy(target, this._target);
        var eyePos = new Array(3);
        this.getEyePosition(eyePos);
        this._distance = osg.Vec3.distance(eyePos, target);
    },
    setEyePosition: function(eye) {
        var result = this._rotation;
        var center = this._target;
        var up = [ 0, 0, 1];

        var f = osg.Vec3.sub(eye, center, []);
        osg.Vec3.normalize(f, f);

        var s = osg.Vec3.cross(f, up, []);
        osg.Vec3.normalize(s, s);

        var u = osg.Vec3.cross(s, f, []);
        osg.Vec3.normalize(u, u);

        // s[0], f[0], u[0], 0.0,
        // s[1], f[1], u[1], 0.0,
        // s[2], f[2], u[2], 0.0,
        // 0,    0,    0,     1.0
        result[0]=s[0]; result[1]=f[0]; result[2]=u[0]; result[3]=0.0;
        result[4]=s[1]; result[5]=f[1]; result[6]=u[1]; result[7]=0.0;
        result[8]=s[2]; result[9]=f[2]; result[10]=u[2];result[11]=0.0;
        result[12]=  0; result[13]=  0; result[14]=  0;  result[15]=1.0;

        this._distance = osg.Vec3.distance(eye, center);
    },
    computeHomePosition: function() {
        if (this._node !== undefined) {
            //this.reset();
            var bs = this._node.getBound();
            this.setDistance(bs.radius()*1.5);
            this.setTarget(bs.center());
        }
    },

    keydown: function(ev) {
        if (ev.keyCode === 32) {
            this.computeHomePosition();
        } else if (ev.keyCode === 33) { // pageup
            this.distanceIncrease();
        } else if (ev.keyCode === 34) { //pagedown
            this.distanceDecrease();

        } else if (ev.keyCode === this._panKey && 
                   this._currentMode !== osgGA.OrbitManipulator.Pan) {
            this._currentMode = osgGA.OrbitManipulator.Pan;
            this._pan.reset();
            this.pushButton();
            ev.preventDefault();
        } else if ( ev.keyCode === this._zoomKey &&
                  this._currentMode !== osgGA.OrbitManipulator.Zoom) {
            this._currentMode = osgGA.OrbitManipulator.Zoom;
            this._zoom.reset();
            this.pushButton();
            ev.preventDefault();
        } else if ( ev.keyCode === this._rotateKey &&
                  this._currentMode !== osgGA.OrbitManipulator.Rotate) {
            this._currentMode = osgGA.OrbitManipulator.Rotate;
            this._rotate.reset();
            this.pushButton();
            ev.preventDefault();
        }
        
    },

    keyup: function(ev) {
        if (ev.keyCode === this._panKey) {
            this.mouseup(ev);
        } else if ( ev.keyCode === this._rotateKey) {
            this.mouseup(ev);
        } else if ( ev.keyCode === this._rotateKey) {
            this.mouseup(ev);
        }
        this._currentMode = undefined;
    },

    touchstart: function(ev) {
        if ( this._currentMode === undefined) {
            this._currentMode = osgGA.OrbitManipulator.Rotate;
        }

        var touches = ev.changedTouches;
        if (this._moveTouch === undefined) {
            this._moveTouch = new osgGA.OrbitManipulator.TouchEvent();
        }
        if (this._moveTouch.id === undefined) {
            var touch = touches[0];
            var id = touch.identifier;
            // relative to element position
            var rte = this.getPositionRelativeToCanvas(touch);
            this._rotate.set(rte[0], rte[1]);
            this._moveTouch.init(id, rte[0], rte[1]);
            this.pushButton(touch);
        }
        ev.preventDefault();
    },
    touchend: function(event) {
        event.preventDefault();
        this._currentMode = undefined;
        this._moveTouch = undefined;
        this.releaseButton(event);
    },
    touchmove: function(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            if (id === this._moveTouch.id) {
                var rteCurrent = this.getPositionRelativeToCanvas(touch);
                this._rotate.setTarget(rteCurrent[0], rteCurrent[1]);
                this._moveTouch.init(id, rteCurrent[0], rteCurrent[1]);
            }
        }
    },
    touchleave: function(event) {
        return this.touchend(event);
    },
    touchcancel: function(event) {
        this.touchend(event);
    },

    gesturestart: function(event) {
        event.preventDefault();
        if (this._moveTouch) { // disable id for gesture
            this._moveTouch.id = undefined;
        }
        this._moveTouch.init(undefined, 0, 0, event.scale, event.rotation);
        this._zoom.reset();
    },
    gestureend: function(event) {
        event.preventDefault();
        this._moveTouch.init(undefined, 0, 0, event.scale, event.rotation);
        this._currentMode = undefined;
    },
    gesturechange: function(event) {
        event.preventDefault();
        var scale = (event.scale - this._moveTouch.scale)*5.0;
        this._moveTouch.init(undefined, 0, 0, event.scale, event.rotation);
        this._zoom.setTarget(this._zoom.getTarget()[0]-scale);
    },

    mouseup: function(ev) {
        this.releaseButton(ev);
        this._currentMode = undefined;
    },

    mousedown: function(ev) {
        if (this._currentMode === undefined) {
            if (ev.button === 0) {
                if (ev.shiftKey) {
                    this._currentMode = osgGA.OrbitManipulator.Pan;
                } else if (ev.ctrlKey) {
                    this._currentMode = osgGA.OrbitManipulator.Zoom;
                } else {
                    this._currentMode = osgGA.OrbitManipulator.Rotate;
                }
            } else {
                this._currentMode = osgGA.OrbitManipulator.Pan;
            }
        }

        this.pushButton(ev);

        var pos = this.getPositionRelativeToCanvas(ev);

        if (this._currentMode === osgGA.OrbitManipulator.Rotate) {
            this._rotate.reset(pos[0], pos[1]);
            this._rotate.set(pos[0], pos[1]);
        } else if (this._currentMode === osgGA.OrbitManipulator.Pan) {
            this._pan.reset(pos[0], pos[1]);
            this._pan.set(pos[0], pos[1]);
        } else if (this._currentMode === osgGA.OrbitManipulator.Zoom) {
            this._zoom._start = pos[1];
            this._zoom.set(0.0);
        }
        ev.preventDefault();
    },
    mousemove: function(ev) {
        if (this._buttonup === true) {
            return;
        }
        var pos = this.getPositionRelativeToCanvas(ev);

        if (isNaN(pos[0]) === false && isNaN(pos[1]) === false) {
            
            if (this._currentMode === osgGA.OrbitManipulator.Rotate) {
                this._rotate.setTarget(pos[0], pos[1]);
            } else if (this._currentMode === osgGA.OrbitManipulator.Pan) {
                this._pan.setTarget(pos[0], pos[1]);
            } else if (this._currentMode === osgGA.OrbitManipulator.Zoom) {
                if (this._zoom.isReset()) {
                    this._zoom._start = pos[1];
                    this._zoom.set(0.0);
                }
                var dy = pos[1]-this._zoom._start;
                this._zoom._start = pos[1];
                var v = this._zoom.getTarget()[0];
                this._zoom.setTarget(v-dy/20.0);
            }
        }

        ev.preventDefault();
        ev.preventDefault();
    },
    setMaxDistance: function(d) {
        this._maxDistance =  d;
    },
    setMinDistance: function(d) {
        this._minDistance =  d;
    },
    setDistance: function(d) {
        this._distance = d;
    },
    getDistance: function() {
        return this._distance;
    },
    computePan: function(dx, dy) {
        dy *= this._distance;
        dx *= this._distance;

        var inv = new Array(16);
        var x = new Array(3);
        var y = new Array(3);
        osg.Matrix.inverse(this._rotation, inv);
        x[0] = osg.Matrix.get(inv, 0,0);
        x[1] = osg.Matrix.get(inv, 0,1);
        x[2] = osg.Matrix.get(inv, 0,2);
        osg.Vec3.normalize(x, x);

        y[0] = osg.Matrix.get(inv, 2,0);
        y[1] = osg.Matrix.get(inv, 2,1);
        y[2] = osg.Matrix.get(inv, 2,2);
        osg.Vec3.normalize(y, y);

        osg.Vec3.mult(x, -dx, x);
        osg.Vec3.mult(y, dy, y);
        osg.Vec3.add(this._target, x, this._target);
        osg.Vec3.add(this._target, y, this._target);
    },

    computeRotation: function(dx, dy) {
        var of = osg.Matrix.makeRotate(dx / 10.0, 0,0,1, []);
        var r = osg.Matrix.mult(this._rotation, of, []);

        of = osg.Matrix.makeRotate(dy / 10.0, 1,0,0, []);
        var r2 = osg.Matrix.mult(of, r, []);

        // test that the eye is not too up and not too down to not kill
        // the rotation matrix
        var inv = [];
        osg.Matrix.inverse(r2, inv);
        var eye = osg.Matrix.transformVec3(inv, [0, this._distance, 0], new Array(3));

        var dir = osg.Vec3.neg(eye, []);
        osg.Vec3.normalize(dir, dir);

        var p = osg.Vec3.dot(dir, [0,0,1]);
        if (Math.abs(p) > 0.95) {
            //discard rotation on y
            this._rotation = r;
            return;
        }
        this._rotation = r2;
    },

    releaseButton: function() {
        this._buttonup = true;
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
        ev.preventDefault();
        this._zoom.setTarget(this._zoom.getTarget()[0] - intDelta);
    },

    computeZoom: function(dz) {
        this.zoom(dz);
    },

    zoom: function(ratio) {
        var newValue = this._distance*ratio;
        if (this._minDistance > 0) {
            if (newValue < this._minDistance) {
                newValue = this._minDistance;
            }
        }
        if (this._maxDistance > 0) {
            if (newValue > this._maxDistance) {
                newValue = this._maxDistance;
            }
        }
        this._distance = newValue;
    },


    pushButton: function() {
        this._buttonup = false;
    },

    getTarget: function(target) {
        osg.Vec3.copy(this._target, target);
    },

    getEyePosition: function(eye) {
        var inv = new Array(16);
        osg.Matrix.inverse(this._rotation, inv);
        osg.Matrix.transformVec3(inv,
                                 [0, this._distance, 0],
                                 eye );
        osg.Vec3.add(this._target, eye, eye);
    },

    update: function(nv) {
        var t = nv.getFrameStamp().getSimulationTime();
        if (this._lastUpdate === undefined) {
            this._lastUpdate = t;
        }
        var dt = t - this._lastUpdate;
        this._lastUpdate = t;

        var delta;
        var mouseFactor = 0.1;
        delta = this._rotate.update();
        this.computeRotation(-delta[0]*mouseFactor, -delta[1]*mouseFactor);


        var panFactor = 0.002;
        delta = this._pan.update();
        this.computePan(-delta[0]*panFactor, -delta[1]*panFactor);

        
        delta = this._zoom.update();
        this.computeZoom(1.0 + delta[0]/10.0);

        var target = this._target;
        var distance = this._distance;

        var eye = new Array(3);
        osg.Matrix.inverse(this._rotation, this._inverseMatrix);
        osg.Matrix.transformVec3(this._inverseMatrix,
                                 [0, distance, 0],
                                 eye );

        osg.Matrix.makeLookAt(osg.Vec3.add(target, eye, eye),
                              target,
                              [0,0,1], 
                              this._inverseMatrix);
    },

    getInverseMatrix: function () {
        return this._inverseMatrix;
    }
});

osgGA.OrbitManipulator.TouchEvent = function() {
    this.x = 0;
    this.y = 0;
    this.scale = 1.0;
    this.rotation = 0.0;
    this.id = undefined;
};
osgGA.OrbitManipulator.TouchEvent.prototype = {
    init: function(id, x, y, scale, rotation) {
        this.id = id;
        this.x = x;
        this.y = y;
        if (scale !== undefined) {
            this.scale = scale;
        }
        if (rotation !== undefined) {
            this.rotation = rotation;
        }
    }
};
/** -*- compile-command: "jslint-cli FirstPersonManipulator.js" -*-
 * Authors:
 *  Matt Fontaine <tehqin@gmail.com>
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */


/** 
 *  FirstPersonManipulator
 *  @class
 */
osgGA.FirstPersonManipulator = function () {
    osgGA.Manipulator.call(this);
    this.init();
};

/** @lends osgGA.FirstPersonManipulator.prototype */
osgGA.FirstPersonManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    setNode: function(node) {
        this._node = node;
        this.computeHomePosition();
    },
    computeHomePosition: function() {
        if (this._node !== undefined) {
            var bs = this._node.getBound();
            this._radius = bs.radius();
            this._eye = [ 0, -bs.radius()*1.5, 0 ];

            this._angleVertical = 0.0;
            this._angleHorizontal = 0.0;
        }
    },
    init: function()
    {
        this._direction = [0.0, 1.0, 0.0];
        this._angleVertical = 0.0;
        this._angleHorizontal = 0.0;
        this._eye = [0, 25.0, 10.0];
        this._up = [0, 0, 1];
        this._buttonup = true;
        this._radius = 1;
        this._forward = new osgGA.OrbitManipulator.Interpolator(1);
        this._side = new osgGA.OrbitManipulator.Interpolator(1);
        this._lookPosition = new osgGA.OrbitManipulator.Interpolator(2);
        this._stepFactor = 1.0; // meaning radius*stepFactor to move
        this._target = new Array(3); osg.Vec3.init(this._target);
    },
    reset: function()
    {
        this.init();
    },

    getEyePosition: function(eye) {
        eye[0] = this._eye[0];
        eye[1] = this._eye[1];
        eye[2] = this._eye[2];
        return eye;
    },

    setEyePosition: function(eye) {
        this._eye[0] = eye[0];
        this._eye[1] = eye[1];
        this._eye[2] = eye[2];
    },

    getTarget: function(pos, distance) {
        if (distance === undefined) {
            distance = 25;
        }
        var dir = osg.Vec3.mult(this._direction, distance, new Array(3));
        osg.Vec3.add(this._eye, dir, pos);
    },

    setTarget: function(pos) {
        this._target[0] = pos[0];
        this._target[1] = pos[1];
        this._target[2] = pos[2];
        var dir = new Array(3);
        osg.Vec3.sub(pos, this._eye, dir);
        dir[2] = 0;
        osg.Vec3.normalize(dir, dir);
        this._angleHorizontal = Math.acos(dir[1]);
        if (dir[0] < 0) {
            this._angleHorizontal = -this._angleHorizontal;
        }
        osg.Vec3.sub(pos, this._eye, dir);
        osg.Vec3.normalize(dir, dir);

        this._angleVertical = -Math.asin(dir[2]);
        osg.Vec3.copy(dir, this._direction);
    },

    mousedown: function(ev)
    {
        var pos = this.getPositionRelativeToCanvas(ev);
        this._lookPosition.set(pos[0], pos[1]);
        this._buttonup = false;
    },
    mouseup: function(ev) {
        this._buttonup = true;
    },
    mousemove: function(ev)
    {
        if (this._buttonup === true) { return; }

        var curX;
        var curY;
        var deltaX;
        var deltaY;
        var pos = this.getPositionRelativeToCanvas(ev);

        this._lookPosition.setTarget(pos[0], pos[1]);
    },

    computeRotation: function(dx, dy)
    {
        this._angleVertical += dy*0.01;
        this._angleHorizontal -= dx*0.01;

        var first = [];
        var second = [];
        var rotMat = [];
        osg.Matrix.makeRotate(this._angleVertical, 1, 0, 0, first);
        osg.Matrix.makeRotate(this._angleHorizontal, 0, 0, 1, second);
        osg.Matrix.mult(second, first, rotMat);
        //rotMat = second;

        this._direction = osg.Matrix.transformVec3(rotMat, [0, 1, 0], []);
        osg.Vec3.normalize(this._direction, this._direction);

        this._up = osg.Matrix.transformVec3(rotMat, [0, 0, 1], [] );
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
        ev.preventDefault();
        this._stepFactor = Math.min(Math.max(0.001,this._stepFactor+intDelta*0.01), 4.0);
    },

    update: function(nv) {
        var t = nv.getFrameStamp().getSimulationTime();
        if (this._lastUpdate === undefined) {
            this._lastUpdate = t;
        }
        var dt = t - this._lastUpdate;
        this._lastUpdate = t;

        this._forward.update();
        this._side.update();
        var delta = this._lookPosition.update();

        this.computeRotation(-delta[0]*0.5, -delta[1]*0.5);

        var vec = new Array(2);
        vec[0] = this._forward.getCurrent()[0];
        vec[1] = this._side.getCurrent()[0];
        if (osg.Vec2.length(vec) > 1.0) {
            osg.Vec2.normalize(vec, vec);
        }
        var factor = this._radius;
        if (this._radius < 1e-3) {
            factor = 1.0;
        }
        this.moveForward(vec[0] * factor*this._stepFactor*dt);
        this.strafe(vec[1] * factor*this._stepFactor*dt);

        var target = osg.Vec3.add(this._eye, this._direction, []);
        this._target = target;

        osg.Matrix.makeLookAt(this._eye, target, this._up, this._inverseMatrix);
    },

    getInverseMatrix: function()
    {
        return this._inverseMatrix;
    },

    moveForward: function(distance)
    {
        var d = osg.Vec3.mult(osg.Vec3.normalize(this._direction, []), distance, []);
        this._eye = osg.Vec3.add(this._eye, d, []);
    },

    strafe: function(distance)
    {
        var cx = osg.Vec3.cross(this._direction, this._up, []);
        var d = osg.Vec3.mult(osg.Vec3.normalize(cx,cx), distance, []);
        this._eye = osg.Vec3.add(this._eye, d, []);
    },
    
    keydown: function(event) {
        if (event.keyCode === 32) {
            this.computeHomePosition();
        } else if (event.keyCode === 87 || event.keyCode === 90 || event.keyCode === 38){ // w/z/up
            this._forward.setTarget(1);
            return false;
        }
        else if (event.keyCode === 83 || event.keyCode === 40){ // S/down
            this._forward.setTarget(-1);
            return false;
        }
        else if (event.keyCode === 68 || event.keyCode === 39){ // D/right
            this._side.setTarget(1);
            return false;
        }
        else if (event.keyCode === 65 || event.keyCode === 81 || event.keyCode === 37){ // a/q/left
            this._side.setTarget(-1);
            return false;
        }
    },

    keyup: function(event) {
        if (event.keyCode === 87 || event.keyCode === 90 || event.keyCode === 38) { // w/z/up
            this._forward.setTarget(0);
            return false;
        }
        else if (event.keyCode == 83 || event.keyCode === 40){ // S/down
            this._forward.setTarget(0);
            return false;
        }
        else if (event.keyCode == 68 || event.keyCode === 39){ // D/right
            this._side.setTarget(0);
            return false;
        }
        else if (event.keyCode === 65 || event.keyCode === 81 || event.keyCode === 37){ // a/q/left
            this._side.setTarget(0);
            return false;
        }
    }
});
/** -*- compile-command: "jslint-cli SwitchManipulator.js" -*-
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 */

/** 
 *  OrbitManipulator
 *  @class
 */
osgGA.SwitchManipulator = function () {
    osgGA.Manipulator.call(this);
    this._manipulatorList = [];
    this._currentManipulator = undefined;
};

/** @lends osgGA.OrbitManipulator.prototype */
osgGA.SwitchManipulator.prototype = osg.objectInehrit(osgGA.Manipulator.prototype, {
    update: function(nv) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.update(nv);
        }
    },
    setNode: function (node) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator.setNode === undefined) {
            osg.log("manipulator has not setNode method");
            return;
        }
        manipulator.setNode(node);
    },
    getNumManipulator: function () {
        return this._manipulatorList.length;
    },
    addManipulator: function (manipulator) {
        this._manipulatorList.push(manipulator);
        if (this._currentManipulator === undefined) {
            this._currentManipulator = 0;
        }
    },
    getManipulatorList: function () {
        return this._manipulatorList;
    },
    setManipulatorIndex: function (index) {
        this._currentManipulator = index;
    },
    getCurrentManipulatorIndex: function() {
        return this._currentManipulator;
    },
    getCurrentManipulator: function () {
        var manipulator = this._manipulatorList[this._currentManipulator];
        return manipulator;
    },
    reset: function() {
        this.getCurrentManipulator().reset();
    },
    computeHomePosition: function() {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            manipulator.computeHomePosition();
        }
    },
    /**
       Method called when a keydown event is triggered
        @type KeyEvent
     */
    keydown: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.keydown(ev);
        }
    },
    /**
       Method called when a keyup event is triggered
       @type KeyEvent
     */
    keyup: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.keyup(ev);
        }
    },
    mouseup: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.mouseup(ev);
        }
    },
    mousedown: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.mousedown(ev);
        }
    },
    mousemove: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.mousemove(ev);
        }
    },
    dblclick: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.dblclick(ev);
        }
    },
    touchstart: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.touchstart(ev);
        }
    },
    touchend: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.touchend(ev);
        }
    },
    touchmove: function(ev) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.touchmove(ev);
        }
    },

    touchleave: function(event) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.touchleave(event);
        }
    },
    touchcancel: function(event) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.touchcancel(event);
        }
    },

    gesturestart: function(event) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.gesturestart(event);
        }
    },
    gestureend: function(event) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.gestureend(event);
        }
    },
    gesturechange: function(event) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.gesturechange(event);
        }
    },

    mousewheel: function(ev, intDelta, deltaX, deltaY) {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.mousewheel(ev, intDelta, deltaX, deltaY);
        }
    },
    getInverseMatrix: function () {
        var manipulator = this.getCurrentManipulator();
        if (manipulator !== undefined) {
            return manipulator.getInverseMatrix();
        }
    }
});

/** -*- compile-command: "jslint-cli osg.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */

osgDB.ObjectWrapper.serializers.osg = {};

osgDB.ObjectWrapper.serializers.osg.Object = function(input, obj) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return;
    }
    
    if (jsonObj.Name) {
        obj.setName(jsonObj.Name);
    }

    if (jsonObj.UserDataContainer) {
        var userdata = input.setJSON(jsonObj.UserDataContainer).readUserDataContainer();
        if (userdata !== undefined) {
            obj.setUserData(userdata);
        }
    }

    return obj;
};

osgDB.ObjectWrapper.serializers.osg.Node = function(input, node) {
    var jsonObj = input.getJSON();

    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, node);

    var promiseArray = [];

    var createCallback = function(jsonCallback) {
        var promise = input.setJSON(jsonCallback).readObject();
        var df = osgDB.Promise.defer();
        promiseArray.push(df.promise);
        osgDB.Promise.when(promise).then(function(cb) {
            if (cb) {
                node.addUpdateCallback(cb);
            }
            df.resolve();
        });
    };

    if (jsonObj.UpdateCallbacks) {
        for (var j = 0, l = jsonObj.UpdateCallbacks.length; j < l; j++) {
            createCallback(jsonObj.UpdateCallbacks[j]);
        }
    }


    if (jsonObj.StateSet) {
        var pp = input.setJSON(jsonObj.StateSet).readObject();
        var df = osgDB.Promise.defer();
        promiseArray.push(df.promise);
        osgDB.Promise.when(pp).then(function(stateset) {
            node.setStateSet(stateset);
            df.resolve();
        });
    }

    var createChildren = function(jsonChildren) {
        var promise = input.setJSON(jsonChildren).readObject();
        var df = osgDB.Promise.defer();
        promiseArray.push(df.promise);
        osgDB.Promise.when(promise).then(function(obj) {
            if (obj) {
                node.addChild(obj);
            }
            df.resolve(obj);
        });
    };

    if (jsonObj.Children) {
        for (var i = 0, k = jsonObj.Children.length; i < k; i++) {
            createChildren(jsonObj.Children[i]);
        }
    }

    var defer = osgDB.Promise.defer();
    osgDB.Promise.all(promiseArray).then(function() {
        defer.resolve(node);
    });

    return defer.promise;
};

osgDB.ObjectWrapper.serializers.osg.StateSet = function(input, stateSet) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        return true;
    };

    if (!check(jsonObj)) {
        return;
    }
    
    osgDB.ObjectWrapper.serializers.osg.Object(input, stateSet);

    if (jsonObj.RenderingHint !== undefined) {
        stateSet.setRenderingHint(jsonObj.RenderingHint);
    }

    var createAttribute = function(jsonAttribute) {
        var promise = input.setJSON(jsonAttribute).readObject();
        var df = osgDB.Promise.defer();
        promiseArray.push(df.promise);
        osgDB.Promise.when(promise).then(function(attribute) {
            if (attribute !== undefined) {
                stateSet.setAttributeAndMode(attribute);
            }
            df.resolve();
        });
    };

    var promiseArray = [];

    if (jsonObj.AttributeList !== undefined) {
        for (var i = 0, l = jsonObj.AttributeList.length; i < l; i++) {
            createAttribute(jsonObj.AttributeList[i]);
        }
    }

    var createTextureAttribute = function(unit, textureAttribute) {
        var promise = input.setJSON(textureAttribute).readObject();
        var df = osgDB.Promise.defer();
        promiseArray.push(df.promise);
        osgDB.Promise.when(promise).then(function(attribute) {
            if (attribute)
                stateSet.setTextureAttributeAndMode(unit, attribute);
            df.resolve();
        });
    };

    if (jsonObj.TextureAttributeList) {
        var textures = jsonObj.TextureAttributeList;
        for (var t = 0, lt = textures.length; t < lt; t++) {
            var textureAttributes = textures[t];
            for (var a = 0, al = textureAttributes.length; a < al; a++) {
                createTextureAttribute(t, textureAttributes[a]);
            }
        }
    }

    var defer = osgDB.Promise.defer();
    osgDB.Promise.all(promiseArray).then(function() {
        defer.resolve(stateSet);
    });

    return defer.promise;
};

osgDB.ObjectWrapper.serializers.osg.Material = function(input, material) {
    var jsonObj = input.getJSON();

    var check = function(o) {
        if (o.Diffuse !== undefined && 
            o.Emission !== undefined && 
            o.Specular !== undefined && 
            o.Shininess !== undefined) {
            return true;
        }
        return false;
    };

    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, material);

    material.setAmbient(jsonObj.Ambient);
    material.setDiffuse(jsonObj.Diffuse);
    material.setEmission(jsonObj.Emission);
    material.setSpecular(jsonObj.Specular);
    material.setShininess(jsonObj.Shininess);
    return material;
};


osgDB.ObjectWrapper.serializers.osg.BlendFunc = function(input, blend) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.SourceRGB && o.SourceAlpha && o.DestinationRGB && o.DestinationAlpha) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, blend);

    blend.setSourceRGB(jsonObj.SourceRGB);
    blend.setSourceAlpha(jsonObj.SourceAlpha);
    blend.setDestinationRGB(jsonObj.DestinationRGB);
    blend.setDestinationAlpha(jsonObj.DestinationAlpha);
    return blend;
};

osgDB.ObjectWrapper.serializers.osg.CullFace = function(input, attr) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.Mode !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, attr);
    attr.setMode(jsonObj.Mode);
    return attr;
};

osgDB.ObjectWrapper.serializers.osg.BlendColor = function(input, attr) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.ConstantColor !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, attr);
    attr.setConstantColor(jsonObj.ConstantColor);
    return attr;
};

osgDB.ObjectWrapper.serializers.osg.Light = function(input, light) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.LightNum !== undefined &&
            o.Ambient !== undefined &&
            o.Diffuse !== undefined &&
            o.Direction !== undefined &&
            o.Position !== undefined &&
            o.Specular !== undefined &&
            o.SpotCutoff !== undefined &&
            o.LinearAttenuation !== undefined &&
            o.ConstantAttenuation !== undefined &&
            o.QuadraticAttenuation !== undefined ) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, light);
    light.setAmbient(jsonObj.Ambient);
    light.setConstantAttenuation(jsonObj.ConstantAttenuation);
    light.setDiffuse(jsonObj.Diffuse);
    light.setDirection(jsonObj.Direction);
    light.setLightNumber(jsonObj.LightNum);
    light.setLinearAttenuation(jsonObj.LinearAttenuation);
    light.setPosition(jsonObj.Position);
    light.setQuadraticAttenuation(jsonObj.QuadraticAttenuation);
    light.setSpecular(jsonObj.Specular);
    light.setSpotCutoff(jsonObj.SpotCutoff);
    light.setSpotBlend(0.01);
    if (jsonObj.SpotExponent !== undefined) {
        light.setSpotBlend(jsonObj.SpotExponent/128.0);
    }
    return light;
};

osgDB.ObjectWrapper.serializers.osg.Texture = function(input, texture) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(input, texture);

    if (jsonObj.MinFilter !== undefined) {
        texture.setMinFilter(jsonObj.MinFilter);
    }
    if (jsonObj.MagFilter !== undefined) {
        texture.setMagFilter(jsonObj.MagFilter);
    }

    if (jsonObj.WrapT !== undefined) {
        texture.setWrapT(jsonObj.WrapT);
    }
    if (jsonObj.WrapS !== undefined) {
        texture.setWrapS(jsonObj.WrapS);
    }

    var defer = osgDB.Promise.defer();
    if (jsonObj.File !== undefined) {
        osgDB.Promise.when(input.readImageURL(jsonObj.File)).then(
            function(img) {
                texture.setImage(img);
                defer.resolve(texture);
            });
    }
    return defer.promise;
};


osgDB.ObjectWrapper.serializers.osg.Projection = function(input, node) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.Matrix !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    var promise = osgDB.ObjectWrapper.serializers.osg.Node(input, node);

    if (jsonObj.Matrix !== undefined) {
        node.setMatrix(jsonObj.Matrix);
    }
    return promise;
};


osgDB.ObjectWrapper.serializers.osg.MatrixTransform = function(input, node) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.Matrix) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    var promise = osgDB.ObjectWrapper.serializers.osg.Node(input, node);

    if (jsonObj.Matrix !== undefined) {
        node.setMatrix(jsonObj.Matrix);
    }
    return promise;
};


osgDB.ObjectWrapper.serializers.osg.LightSource = function(input, node) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.Light !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    var defer = osgDB.Promise.defer();
    var promise = osgDB.ObjectWrapper.serializers.osg.Node(input, node);
    osgDB.Promise.all([input.setJSON(jsonObj.Light).readObject(), promise]).then( function (args) {
        var light = args[0];
        var lightsource = args[1];
        node.setLight(light);
        defer.resolve(node);
    });
    return defer.promise;
};


osgDB.ObjectWrapper.serializers.osg.Geometry = function(input, node) {
    var jsonObj = input.getJSON();
    var check = function(o) {
        if (o.PrimitiveSetList !== undefined && o.VertexAttributeList !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    var arraysPromise = [];
    arraysPromise.push(osgDB.ObjectWrapper.serializers.osg.Node(input, node));

    var createPrimitive = function(jsonPrimitive) {
        var defer = osgDB.Promise.defer();
        arraysPromise.push(defer.promise);
        var promise = input.setJSON(jsonPrimitive).readPrimitiveSet();
        osgDB.Promise.when(promise).then(function(primitiveSet) {
            if (primitiveSet !== undefined) {
                node.getPrimitives().push(primitiveSet);
            }
            defer.resolve(primitiveSet);
        });
    };

    for (var i = 0, l = jsonObj.PrimitiveSetList.length; i < l; i++) {
        var entry = jsonObj.PrimitiveSetList[i];
        createPrimitive(entry);
    }

    var createVertexAttribute = function(name, jsonAttribute) {
        var defer = osgDB.Promise.defer();
        arraysPromise.push(defer.promise);
        var promise = input.setJSON(jsonAttribute).readBufferArray();
        osgDB.Promise.when(promise).then(function(buffer) {
            if (buffer !== undefined) {
                node.getVertexAttributeList()[name] = buffer;
            }
            defer.resolve(buffer);
        });
    };
    for (var key in jsonObj.VertexAttributeList) {
        if (jsonObj.VertexAttributeList.hasOwnProperty(key)) {
            createVertexAttribute(key, jsonObj.VertexAttributeList[key]);
        }
    }

    var defer = osgDB.Promise.defer();
    osgDB.Promise.all(arraysPromise).then(function() { defer.resolve(node);});
    return defer.promise;
};
/** -*- compile-command: "jslint-cli osgAnimation.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */

osgDB.ObjectWrapper.serializers.osgAnimation = {};
osgDB.ObjectWrapper.serializers.osgAnimation.Animation = function(input, animation) {
    var jsonObj = input.getJSON();
    // check
    // 
    var check = function(o) {
        if (o.Name && o.Channels && o.Channels.length > 0) {
            return true;
        }
        if (!o.Name) {
            osg.log("animation has field Name, error");
            return false;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    if (!osgDB.ObjectWrapper.serializers.osg.Object(input, animation)) {
        return;
    }

    // channels
    for (var i = 0, l = jsonObj.Channels.length; i < l; i++) {
        osgDB.Promise.when(input.setJSON(jsonObj.Channels[i]).readObject()).then(function(channel) {
            if (channel) {
                animation.getChannels().push(channel);
            }
        });
    }
    return animation;
};

osgDB.ObjectWrapper.serializers.osgAnimation.Vec3LerpChannel = function(input, channel) {
    var jsonObj = input.getJSON();
    // check
    // 
    var check = function(o) {
        if (o.KeyFrames && o.TargetName && o.Name) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    // doit
    if (!osgDB.ObjectWrapper.serializers.osg.Object(input, channel)) {
        return;
    }

    channel.setTargetName(jsonObj.TargetName);

    // channels
    var keys = channel.getSampler().getKeyframes();
    for (var i = 0, l = jsonObj.KeyFrames.length; i < l; i++) {
        var nodekey = jsonObj.KeyFrames[i];
        var mykey = nodekey.slice(1);
        mykey.t = nodekey[0];
        keys.push(mykey);
    }
    return channel;
};


osgDB.ObjectWrapper.serializers.osgAnimation.QuatLerpChannel = function(input, channel) {
    return osgDB.ObjectWrapper.serializers.osgAnimation.Vec3LerpChannel(input, channel);
};

osgDB.ObjectWrapper.serializers.osgAnimation.QuatSlerpChannel = function(input, channel) {
    return osgDB.ObjectWrapper.serializers.osgAnimation.Vec3LerpChannel(input, channel);
};


osgDB.ObjectWrapper.serializers.osgAnimation.FloatLerpChannel = function(input, channel) {
    var jsonObj = input.getJSON();
    // check
    // 
    var check = function(o) {
        if (o.KeyFrames && o.TargetName && o.Name) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    // doit
    if (!osgDB.ObjectWrapper.serializers.osg.Object(input, channel)) {
        return;
    }

    channel.setTargetName(jsonObj.TargetName);

    // channels
    var keys = channel.getSampler().getKeyframes();
    for (var i = 0, l = jsonObj.KeyFrames.length; i < l; i++) {
        var nodekey = jsonObj.KeyFrames[i];
        var mykey = nodekey.slice(1);
        mykey.t = nodekey[0];
        keys.push(mykey);
    }
    return channel;
};



osgDB.ObjectWrapper.serializers.osgAnimation.BasicAnimationManager = function(input, manager) {
    var jsonObj = input.getJSON();
    // check
    // 
    var check = function(o) {
        if (o.Animations) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    for (var i = 0, l = jsonObj.Animations.length; i < l; i++) {
        var entry = jsonObj.Animations[i];
        var anim = input.setJSON(entry).readObject();
        if (anim) {
            manager.registerAnimation(anim);
        }
    }
    return manager;
};


osgDB.ObjectWrapper.serializers.osgAnimation.UpdateMatrixTransform = function(input, umt) {
    var jsonObj = input.getJSON();
    // check
    var check = function(o) {
        if (o.Name && o.StackedTransforms) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    if (osgDB.ObjectWrapper.serializers.osg.Object(input, umt) === undefined) {
        return;
    }

    for (var i = 0, l = jsonObj.StackedTransforms.length; i < l; i++) {
        var entry = jsonObj.StackedTransforms[i];
        var ste = input.setJSON(entry).readObject();
        if (ste) {
            umt.getStackedTransforms().push(ste);
        }
    }
    return umt;
};


osgDB.ObjectWrapper.serializers.osgAnimation.StackedTranslate = function(input, st) {
    var jsonObj = input.getJSON();

    // check
    var check = function(o) {
        if (o.Name) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    if (!osgDB.ObjectWrapper.serializers.osg.Object(input,st)) {
        return;
    }

    if (jsonObj.Translate) {
        st.setTranslate(jsonObj.Translate);
    }
    return st;
};


osgDB.ObjectWrapper.serializers.osgAnimation.StackedQuaternion = function(input, st) {
    var jsonObj = input.getJSON();
    // check
    var check = function(o) {
        if (o.Name) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    if (!osgDB.ObjectWrapper.serializers.osg.Object(input,st)) {
        return;
    }

    if (jsonObj.Quaternion) {
        st.setQuaternion(jsonObj.Quaternion);
    }
    return st;
};

osgDB.ObjectWrapper.serializers.osgAnimation.StackedRotateAxis = function(input, st) {
    var jsonObj = input.getJSON();
    // check
    var check = function(o) {
        if (o.Axis) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    if (!osgDB.ObjectWrapper.serializers.osg.Object(input,st)) {
        return;
    }

    if (jsonObj.Angle) {
        st.setAngle(jsonObj.Angle);
    }

    st.setAxis(jsonObj.Axis);

    return st;
};
