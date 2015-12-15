Camera.prototype = new SceneNode();
Camera.prototype.constructor=Camera;
function Camera () {
  this.projection = Mat4.identity();
  this.viewMatrix = Mat4.identity();
}

Camera.prototype.draw = function ( viewMatrix, projection  ) {
  // cameras do not do anything when draw is called.
}

Camera.prototype.getViewMatrix = function () {
  this.viewMatrix = Mat4.multiply( Mat4.translateVec( this.position.inverse() ), Mat4.rotateVec( this.rotation.inverse() ) );
  return this.viewMatrix;
}

Camera.prototype.getProjection = function () {
  return this.projection;
}
