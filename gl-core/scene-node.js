function SceneNode () {
  this.parent = null;
  this.position = new Vec3( 0, 0, 0 );
  this.rotation = new Vec3( 0, 0, 0 );
  this.scale = new Vec3( 1, 1, 1 );
  this._transform = Mat4.identity();
}

SceneNode.prototype.draw = function ( viewMatrix, projection ) {
  console.log( "SceneNode.draw should be overridden in subclasses.");
}

SceneNode.prototype.getTransform = function () {
  this._transform = Mat4.multiply( Mat4.multiply( Mat4.translateVec(this.position), Mat4.rotateVec( this.rotation ) ), Mat4.scaleVec( this.scale ) );

  if ( this.parent != null ) {
    this._transform = Mat4.multiply( this.parent.getTransform(), this._transform );
  }
  return this._transform;
}
