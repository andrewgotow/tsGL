Camera.prototype = new Component();
Camera.prototype.constructor = Camera;
function Camera ( fov, resolution ) {
  checkTypes( [fov,resolution], ["number", "Vec3" ] );

  this.fieldOfView = fov;
  this.resolution = resolution;
  this.near = 0.1;
  this.far = 100;

  this._projection = null;

  this._fbo = null;
  this._colorAttachment = null;
  this._depthAttachment = null;

  this._buildFbo();
  this._buildProjection();
}

Camera.prototype._buildProjection = function () {
  this._projection = Mat4.makePerspective( this.fieldOfView, this.resolution.x / this.resolution.y, this.near, this.far );
}

Camera.prototype._buildFbo = function () {
  var width = Math.floor( this.resolution.x );
  var height = Math.floor( this.resolution.y );

  // build a framebuffer
  this._fbo = gl.createFramebuffer();
  gl.bindFramebuffer( gl.FRAMEBUFFER, this._fbo );

  // build render buffers.
  var color = this._colorAttachment = gl.createRenderbuffer();
  gl.bindRenderbuffer( gl.RENDERBUFFER, color );
  gl.renderbufferStorage( gl.RENDERBUFFER, gl.RGBA8, width, height );
  gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, color );

  var depth = this._depthAttachment = gl.createRenderbuffer();
  gl.bindRenderbuffer( gl.RENDERBUFFER, depth );
  gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );
  gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth );

  // enable what we need, and we should be set!
  gl.enable( gl.DEPTH_TEST );
}

Camera.prototype._destroyFbo = function () {
  gl.deleteFramebuffer( this._fbo );
  gl.deleteRenderbuffer( this._colorAttachment );
  gl.deleteRenderbuffer( this._depthAttachment );
}

Camera.prototype.useCamera = function () {
  gl.bindFramebuffer( gl.FRAMEBUFFER, this._fbo );
}

Camera.prototype.blitCamera = function ( windowWidth, windowHeight ) {
  gl.viewport( 0, 0, this.resolution.x, this.resolution.y );
  gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this._fbo );
  gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, null );
  gl.blitFramebuffer( 0, 0, this.resolution.x, this.resolution.y, 0, 0 , windowWidth, windowHeight, gl.COLOR_BUFFER_BIT, gl.NEAREST);
}
