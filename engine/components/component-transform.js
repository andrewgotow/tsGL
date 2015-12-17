Transform.prototype = new Component();
Transform.prototype.constructor = Transform;
function Transform () {
  this.position = Vec3.zero();
  this.rotation = Quaternion.identity();
  this.scale = Vec3.one();
  this.parent = null;
}

// TODO: Cache transformation matrix so that querying the child doesn't need
// to rebuild the parent matrix.
Transform.prototype.getMatrix = function () {
  var p = Mat4.identity();
  if ( this.parent != null )
      p = this.parent.getMatrix();

  var t = Mat4.makeTranslation( this.position );
  var r = this.rotation.getMatrix();
  var s = Mat4.makeScale( this.scale );
  return Mat4.mult( Mat4.mult( Mat4.mult( p, t ), r ), s );
}
