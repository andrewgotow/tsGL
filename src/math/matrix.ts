
class Mat4 {
  data: Float32Array;

  constructor ( data: number[] ) {
    this.data = new Float32Array( data );
  }

  // member functions
  get ( col: number, row: number ): number {
    return this.data[ 4 * row + col ];
  }

  set ( col: number, row: number, value: number ): Mat4 {
    this.data[ 4 * row + col ] = value;
    return this;
  }

  // static factories
  static makeZero (): Mat4 {
    return new Mat4([
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0
    ]);
  }

  static makeIdentity (): Mat4 {
    return new Mat4([
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]);
  }

  static makeTranslation ( vec: Vec3 ): Mat4 {
    var c = Mat4.makeIdentity();
    c.set(0,3,vec.x);
    c.set(1,3,vec.y);
    c.set(2,3,vec.z);
    return c;
  }

  static makeScale ( vec: Vec3 ): Mat4 {
    var c = Mat4.makeIdentity();
    c.set(0,0,vec.x);
    c.set(1,1,vec.y);
    c.set(2,2,vec.z);
    return c;
  }

  static makePerspective (fov: number, aspect: number, zNear: number, zFar: number): Mat4 {
    var fovRad = fov * 0.0174533;
    var top   = Math.tan(fovRad/2) * zNear;
    var right = top * aspect;

    var mat = Mat4.makeIdentity();
    mat.set(0,0, zNear/right);
    mat.set(1,1, zNear/top);
    mat.set(2,2, -(zFar+zNear)/(zFar-zNear));
    mat.set(2,3, -2.0*zFar*zNear/(zFar-zNear));
    mat.set(3,2, -1);
    return mat;
  }

  // static operators
  static mul ( m1: Mat4, m2: Mat4 ): Mat4 {
    var m = Mat4.makeZero();

    for ( var i = 0; i < 4; ++i ) {
      for ( var j = 0; j < 4; ++j ) {
        for ( var k = 0; k < 4; ++k ) {
          m.data[4*i+j] += m1.data[4*i+k] * m2.data[4*k+j];
        }
      }
    }

    return m;
  }

  static scale ( mat: Mat4, s: number ): Mat4 {
    var newMat = Mat4.makeIdentity();
    newMat.data = mat.data.map( function(n) { return n*s; } );
    return newMat;
  }

  static invert ( mat: Mat4 ): Mat4 {
      var m = mat.data;
      var inv = Array(16);

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

      var newMat = Mat4.makeZero();
      newMat.data = inv;
      return newMat;
  }

  // TODO: Expand matrix transpose to not rely on "GET"
  static transpose ( m: Mat4 ): Mat4 {
    return new Mat4([
      m.get(0,0), m.get(0,1), m.get(0,2), m.get(0,3),
      m.get(1,0), m.get(1,1), m.get(1,2), m.get(1,3),
      m.get(2,0), m.get(2,1), m.get(2,2), m.get(2,3),
      m.get(3,0), m.get(3,1), m.get(3,2), m.get(3,3)
    ]);
  }

}
