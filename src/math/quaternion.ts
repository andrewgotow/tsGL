/* Quaternion Class Declaration
 * The Quaternion class represents a Quaternion, a method of representing rotations
 * in space. Quaternions are essentially 4 component, complex vectors, and are
 * extremely useful for representing orientation without gimbal-lock.
 *
 * Here, the set of operations that can be performed is quite limited, but is
 * represented as static member functions, and do not modify the original type.
 */
class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor( x: number, y: number, z: number, w: number ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  // member functions
  normalized (): Quaternion {
    var invMag = 1 / Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
    return new Quaternion( this.x * invMag, this.y * invMag, this.z * invMag, this.w * invMag );
  }

  getMatrix (): Mat4 {
    var q = this.normalized();

    var x2 = q.x + q.x;
    var y2 = q.y + q.y;
    var z2 = q.z + q.z;
    var yy2 = q.y * y2;
    var xy2 = q.x * y2;
    var xz2 = q.x * z2;
    var yz2 = q.y * z2;
    var zz2 = q.z * z2;
    var wz2 = q.w * z2;
    var wy2 = q.w * y2;
    var wx2 = q.w * x2;
    var xx2 = q.x * x2;

    return new Mat4([
      - yy2 - zz2 + 1,       xy2 + wz2,         xz2 - wy2,        0,
        xy2 - wz2,         - xx2 - zz2 + 1,     yz2 + wx2,        0,
        xz2 + wy2,           yz2 - wx2,       - xx2 - yy2 + 1,    0,
        0,                   0,                 0,                1
    ]);
  }

  // static factories
  static makeIdentity (): Quaternion {
    return new Quaternion(0,0,0,1);
  }

  static makeAngleAxis ( angle: number, axis: Vec3 ): Quaternion {
    // convert angle to radians
    var radAngle = angle * (3.141/180.0) * 0.5;
    var sinAngle = Math.sin( radAngle );
    var cosAngle = Math.cos( radAngle );
    // Normallize the vector
    var nAxis = axis.normalized();

    return new Quaternion(
      nAxis.x * sinAngle,
      nAxis.y * sinAngle,
      nAxis.z * sinAngle,
      cosAngle );
  }

  // static operators
  static mul ( q1: Quaternion, q2: Quaternion ): Quaternion {
    return new Quaternion(
      q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
      q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z,
      q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x,
      q1.w * q2.w - q1.x * q2.z - q1.y * q2.y - q1.z * q2.z );
  }

}
