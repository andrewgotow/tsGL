function Quaternion ( x, y, z, w ) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
}

Quaternion.identity = function () {
  return new Quaternion(0,0,0,1);
}

Quaternion.mult = function ( a, b ) {
  var c = new Quaternion();
    c.x = a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y;
    c.y = a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z;
    c.z = a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x;
    c.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
  return c;
}

Quaternion.makeAngleAxis = function ( a, axis ) {
  var q = new Quaternion();

  // convert angle to radians
  var angle = a * (3.141/180.0);
  var sinAngle = Math.sin( 0.5 * angle );
  var cosAngle = Math.cos( 0.5 * angle );

  // Normallize the vector
  var nAxis = axis.normalized();

  q.x = nAxis.x * sinAngle;
  q.y = nAxis.y * sinAngle;
  q.z = nAxis.z * sinAngle;
  q.w = cosAngle;

  return q;
}

Quaternion.prototype.normalized = function () {
  var invMag = 1 / Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
  return new Quaternion( this.x * invMag, this.y * invMag, this.z * invMag, this.w * invMag );
}

Quaternion.prototype.getMatrix = function () {
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
