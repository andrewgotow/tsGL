function Vec3 ( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vec3.prototype.add = function ( other ) {
  return new Vec3( this.x + other.x, this.y + other.y, this.z + other.z );
}

Vec3.prototype.sub = function ( other ) {
  return new Vec3( this.x - other.x, this.y - other.y, this.z - other.z );
}

Vec3.prototype.scale = function ( scalar ) {
  return new Vec3( this.x * scalar, this.y * scalar, this.z * scalar );
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
  return this.scale( 1 / this.magnitude() );
}

Vec3.dot = function ( other ) {
  return this.x * other.x + this.y * other.y + this.z * other.z;
}

Vec3.cross = function ( a, b ) {
  return new Vec3( a.y * b.z - a.z * b.y,
		               a.z * b.x - a.x * b.z,
		               a.x * b.y - a.y * b.x );
}

Vec3.prototype.zero = function () {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  return this;
}
