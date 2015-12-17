/*
Referenced External Functions
NAME:         USAGE:                        LOCATION:
checkTypes:   verify parameter types.       imported from "core-helpers.js"
*/

function Vec3 ( x, y, z ) {
  checkTypes( [x,y,z], ["number","number","number"] );
  this.x = x;
  this.y = y;
  this.z = z;
}

Vec3.one = function () {
  return new Vec3( 1, 1, 1 );
}

Vec3.zero = function () {
  return new Vec3( 0, 0, 0 );
}

Vec3.add = function ( a, b ) {
  checkTypes( [a,b], ["Vec3","Vec3"] );
  return new Vec3( a.x + b.x, a.y + b.y, a.z + b.z );
}

Vec3.sub = function ( a, b ) {
  checkTypes( [a,b], ["Vec3","Vec3"] );
  return new Vec3( a.x - b.x, a.y - b.y, a.z - b.z );
}

Vec3.scale = function ( v, s ) {
  checkTypes( [v,s], ["Vec3","number"] );
  return new Vec3( v.x * s, v.y * s, v.z * s );
}

Vec3.dot = function ( a, b ) {
  checkTypes( [a,b], ["Vec3","Vec3"] );
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

Vec3.cross = function ( a, b ) {
  checkTypes( [a,b], ["Vec3","Vec3"] );
  return new Vec3( a.y * b.z - a.z * b.y,
		               a.z * b.x - a.x * b.z,
		               a.x * b.y - a.y * b.x );
}

Vec3.prototype.inverse = function () {
  return new Vec3( -this.x, -this.y, -this.z );
}

Vec3.prototype.sqrMagnitude = function () {
  return this.x * this.x + this.y * this.y + this.z * this.z;
}

Vec3.prototype.magnitude = function () {
  return Math.sqrt( this.sqrMagnitude() );
}

Vec3.prototype.normalized = function () {
  return Vec3.scale( this, 1 / this.magnitude() );
}
