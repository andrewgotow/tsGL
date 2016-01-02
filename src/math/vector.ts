/* Vec3 Class Declaration
 * The Vec3 class is designed to represent a 3 dimensional vector type, containing
 * an X, Y, and Z coordinate, and providing functions for performing simple vector
 * operations.
 *
 * All operation are performed via static methods, i.e. Vec3.add( a, b ), and are
 * do not modify the original inputs.
 */
class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor( x: number, y: number, z: number ) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Member Functions
  inverse (): Vec3 {
    return new Vec3( -this.x, -this.y, -this.z );
  }

  sqrMagnitude (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  magnitude (): number {
    return Math.sqrt( this.sqrMagnitude() );
  }

  normalized (): Vec3 {
    return Vec3.scale( this, 1 / this.magnitude() );
  }

  // Static factories
  static one (): Vec3 {
    return new Vec3(1,1,1);
  }

  static zero (): Vec3 {
    return new Vec3(0,0,0);
  }

  // Static operators
  static add ( v1: Vec3, v2: Vec3 ): Vec3 {
    return new Vec3( v1.x + v2.x, v1.y + v2.y, v1.z + v2.z );
  }

  static sub ( v1: Vec3, v2: Vec3 ): Vec3 {
    return new Vec3( v1.x - v2.x, v1.y - v2.y, v1.z - v2.z );
  }

  static scale ( v: Vec3, s: number ):Vec3 {
    return new Vec3( v.x * s, v.y * s, v.z * s );
  }

  static dot ( v1: Vec3, v2: Vec3 ): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static cross ( v1: Vec3, v2: Vec3 ): Vec3 {
    return new Vec3( v1.y * v2.z - v1.z * v2.y,
  		               v1.z * v2.x - v1.x * v2.z,
  		               v1.x * v2.y - v1.y * v2.x );
  }
}
