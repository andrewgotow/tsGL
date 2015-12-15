function Scene () {
  this.nodes = new Array();
  this.camera = new Camera();
}

Scene.prototype.draw = function () {
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  for (i = 0; i < this.nodes.length; i ++) {
    this.nodes[i].draw( this.camera.getViewMatrix(), this.camera.getProjection() );
  }
}
