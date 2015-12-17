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
