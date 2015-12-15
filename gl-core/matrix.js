function Mat4 ( data ) {
  this.data = new Float32Array( data );
}

Mat4.prototype.set = function ( col, row, value ) {
  this.data[ 4*row + col ] = value;
  return this;
}

Mat4.prototype.get = function ( col, row ) {
  return this.data[ 4*row + col ];
}

Mat4.multiply = function ( a, b ) {
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

Mat4.rotateX = function ( angle ) {
  var rad = angle * 0.0174533; // degrees to radians
  var c = Mat4.identity();
  c.set(1,1, Math.cos(rad));
  c.set(2,2, Math.cos(rad));
  c.set(2,1, Math.sin(rad));
  c.set(1,2, -c.get(2,1) );
  return c;
}

Mat4.rotateY = function ( angle ) {
  var rad = angle * 0.0174533; // degrees to radians
  var c = Mat4.identity();
  c.set(0,0, Math.cos(rad));
  c.set(2,2, Math.cos(rad));
  c.set(0,2, Math.sin(rad));
  c.set(2,0, -c.get(0,2) );
  return c;
}

Mat4.rotateZ = function ( angle ) {
  var rad = angle * 0.0174533; // degrees to radians
  var c = Mat4.identity();
  c.set(0,0, Math.cos(rad));
  c.set(1,1, Math.cos(rad));
  c.set(1,0, Math.sin(rad));
  c.set(0,1, -c.get(1,0) );
  return c;
}

Mat4.rotate = function ( x, y, z ) {
  return Mat4.multiply( Mat4.multiply( Mat4.rotateX(x), Mat4.rotateY(y) ), Mat4.rotateZ(z) );
}

Mat4.rotateVec = function ( vec ) {
  return Mat4.rotate(vec.x, vec.y, vec.z);
}

Mat4.translate = function( x, y, z ) {
  var c = Mat4.identity();
  c.set(0,3,x);
  c.set(1,3,y);
  c.set(2,3,z);
  return c;
}

Mat4.translateVec = function( vec ) {
  return Mat4.translate( vec.x, vec.y, vec.z );
}

Mat4.scale = function ( x, y, z ) {
  var c = Mat4.identity();
  c.set(0,0,x);
  c.set(1,1,y);
  c.set(2,2,z);
  return c;
}

Mat4.scaleVec = function ( vec ) {
  return Mat4.scale( vec.x, vec.y, vec.z );
}

Mat4.perspective = function(fov, aspect, zNear, zFar) {
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
