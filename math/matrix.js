/*
Referenced External Functions
NAME:         USAGE:                        LOCATION:
checkTypes:   verify parameter types.       imported from "core-helpers.js"
*/

function Mat4 ( data ) {
  checkTypes( [data], ["array"] );
  this.data = new Float32Array( data );
}

Mat4.prototype.set = function ( col, row, value ) {
  checkTypes( [col,row,value], ["number","number","number"] );
  this.data[ 4*row + col ] = value;
  return this;
}

Mat4.prototype.get = function ( col, row ) {
  checkTypes( [col,row], ["number","number"] );
  return this.data[ 4*row + col ];
}

Mat4.multiply = function ( a, b ) {
  checkTypes( [a,b], ["Mat4","Mat4"] );
  var c = Mat4.zero();

  for ( i = 0; i < 4; ++i ) {
    for ( j = 0; j < 4; ++j ) {
      for ( k = 0; k < 4; ++k ) {
        c.data[4*i+j] += a.data[4*i+k] * b.data[4*k+j];
      }
    }
  }

  return c;
}

Mat4.scale = function ( m, s ) {
  checkTypes( [a,b], ["Mat4","number"] );
  return new Mat4( m.data.map( function(n) {return n * s;} ));
}

Mat4.invert = function ( mat ) {
    checkTypes( [mat], ["Mat4"] );
    var m = mat.data;
    var inv = new Array(16);

    inv[0] = m[5]  * m[10] * m[15] -
            m[5]  * m[11] * m[14] -
            m[9]  * m[6]  * m[15] +
            m[9]  * m[7]  * m[14] +
            m[13] * m[6]  * m[11] -
            m[13] * m[7]  * m[10];

    inv[4] = -m[4]  * m[10] * m[15] +
            m[4]  * m[11] * m[14] +
            m[8]  * m[6]  * m[15] -
            m[8]  * m[7]  * m[14] -
            m[12] * m[6]  * m[11] +
            m[12] * m[7]  * m[10];

    inv[8] = m[4]  * m[9] * m[15] -
            m[4]  * m[11] * m[13] -
            m[8]  * m[5] * m[15] +
            m[8]  * m[7] * m[13] +
            m[12] * m[5] * m[11] -
            m[12] * m[7] * m[9];

    inv[12] = -m[4]  * m[9] * m[14] +
            m[4]  * m[10] * m[13] +
            m[8]  * m[5] * m[14] -
            m[8]  * m[6] * m[13] -
            m[12] * m[5] * m[10] +
            m[12] * m[6] * m[9];

    inv[1] = -m[1]  * m[10] * m[15] +
            m[1]  * m[11] * m[14] +
            m[9]  * m[2] * m[15] -
            m[9]  * m[3] * m[14] -
            m[13] * m[2] * m[11] +
            m[13] * m[3] * m[10];

    inv[5] = m[0]  * m[10] * m[15] -
            m[0]  * m[11] * m[14] -
            m[8]  * m[2] * m[15] +
            m[8]  * m[3] * m[14] +
            m[12] * m[2] * m[11] -
            m[12] * m[3] * m[10];

    inv[9] = -m[0]  * m[9] * m[15] +
            m[0]  * m[11] * m[13] +
            m[8]  * m[1] * m[15] -
            m[8]  * m[3] * m[13] -
            m[12] * m[1] * m[11] +
            m[12] * m[3] * m[9];

    inv[13] = m[0]  * m[9] * m[14] -
            m[0]  * m[10] * m[13] -
            m[8]  * m[1] * m[14] +
            m[8]  * m[2] * m[13] +
            m[12] * m[1] * m[10] -
            m[12] * m[2] * m[9];

    inv[2] = m[1]  * m[6] * m[15] -
            m[1]  * m[7] * m[14] -
            m[5]  * m[2] * m[15] +
            m[5]  * m[3] * m[14] +
            m[13] * m[2] * m[7] -
            m[13] * m[3] * m[6];

    inv[6] = -m[0]  * m[6] * m[15] +
            m[0]  * m[7] * m[14] +
            m[4]  * m[2] * m[15] -
            m[4]  * m[3] * m[14] -
            m[12] * m[2] * m[7] +
            m[12] * m[3] * m[6];

    inv[10] = m[0]  * m[5] * m[15] -
            m[0]  * m[7] * m[13] -
            m[4]  * m[1] * m[15] +
            m[4]  * m[3] * m[13] +
            m[12] * m[1] * m[7] -
            m[12] * m[3] * m[5];

    inv[14] = -m[0]  * m[5] * m[14] +
            m[0]  * m[6] * m[13] +
            m[4]  * m[1] * m[14] -
            m[4]  * m[2] * m[13] -
            m[12] * m[1] * m[6] +
            m[12] * m[2] * m[5];

    inv[3] = -m[1] * m[6] * m[11] +
            m[1] * m[7] * m[10] +
            m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] -
            m[9] * m[2] * m[7] +
            m[9] * m[3] * m[6];

    inv[7] = m[0] * m[6] * m[11] -
            m[0] * m[7] * m[10] -
            m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] +
            m[8] * m[2] * m[7] -
            m[8] * m[3] * m[6];

    inv[11] = -m[0] * m[5] * m[11] +
            m[0] * m[7] * m[9] +
            m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] -
            m[8] * m[1] * m[7] +
            m[8] * m[3] * m[5];

    inv[15] = m[0] * m[5] * m[10] -
            m[0] * m[6] * m[9] -
            m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] +
            m[8] * m[1] * m[6] -
            m[8] * m[2] * m[5];

    var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det == 0)
        return null;

    det = 1.0 / det;

    for ( var i = 0; i < 16; i++)
        inv[i] *= det;

    return new Mat4( inv );
}

// TODO: Expand matrix transpose to not rely on "GET"
Mat4.transpose = function ( a ) {
  return new Mat4([
    a.get(0,0), a.get(0,1), a.get(0,2), a.get(0,3),
    a.get(1,0), a.get(1,1), a.get(1,2), a.get(1,3),
    a.get(2,0), a.get(2,1), a.get(2,2), a.get(2,3),
    a.get(3,0), a.get(3,1), a.get(3,2), a.get(3,3)
  ]);
}

// matrix generators
Mat4.zero = function () {
  return new Mat4([
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0
  ]);
}

Mat4.identity = function () {
  return new Mat4([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  ]);
}

Mat4.makeTranslation = function( v ) {
  var c = Mat4.identity();
  c.set(0,3,v.x);
  c.set(1,3,v.y);
  c.set(2,3,v.z);
  return c;
}

Mat4.makeScale = function ( v ) {
  var c = Mat4.identity();
  c.set(0,0,v.x);
  c.set(1,1,v.y);
  c.set(2,2,v.z);
  return c;
}

Mat4.makePerspective = function(fov, aspect, zNear, zFar) {
  var fovRad = fov * 0.0174533;
  var top   = Math.tan(fovRad/2) * zNear;
  var right = top * aspect;

  var mat = new Mat4.identity();
  mat.set(0,0, zNear/right);
  mat.set(1,1, zNear/top);
  mat.set(2,2, -(zFar+zNear)/(zFar-zNear));
  mat.set(2,3, -2.0*zFar*zNear/(zFar-zNear));
  mat.set(3,2, -1);
  return mat;
}
