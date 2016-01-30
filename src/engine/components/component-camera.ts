class Camera extends Component {

  // All camera properties are defined as private members with publicly exposed
  // getters and setters. This allows us to quickly invalidate the projection matrix
  // whenever one of the important attributes is changed.
  private _fieldOfView : number;
  get fieldOfView() : number {
    return this._fieldOfView;
  }
  set fieldOfView( value : number ) {
    this._fieldOfView = value;
    this._projection = null;
  }

  // aspect ratio of the camera. this is used when building the projection matrix
  // to ensure that objects appear correctly when converted to normalized view-space.
  private _aspect : number;
  get aspect() : number {
    return this._aspect;
  }
  set aspect( value : number ) {
    this._aspect = value;
    this._projection = null;
  }

  // near clipping plane, the minimum distance of an object before it is culled
  private _near : number;
  get near() : number {
    return this._near;
  }
  set near( value : number ) {
    this._near = value;
    this._projection = null;
  }

  // far clipping plane, the maximum distance of an object before it is culled.
  private _far : number;
  get far() : number {
    return this._far;
  }
  set far( value : number ) {
    this._far = value;
    this._projection = null;
  }

  // projection matrix. This is computed once, and stored, as it shouldn't changed
  // unless something like Field of View changes. This matrix is set to null whenever
  // one of these variables is changed, and is recalculated when requested.
  private _projection : Mat4;

  renderTexture : RenderTexture;

  //private _fbo : WebGLFramebuffer;
  //private _colorTexture : Texture;
  //private _depthTexture : Texture;

  constructor ( fov : number, aspect : number ) {
    super();
    this.fieldOfView = fov;
    this.aspect = aspect;
    this.near = 0.1;
    this.far = 100;

    this._projection = null;

    this.renderTexture = null;

    //this._fbo = null;
    //this._colorTexture = null;
    //this._depthTexture = null;

    //this._buildFbo();
  }

  getProjection () : Mat4 {
    if ( this._projection == null )
      this._projection = Mat4.makePerspective( this.fieldOfView, this.aspect, this.near, this.far );
    return this._projection;
  }
  /*
  private _buildFbo () {
    var width = Math.floor( this.resolution.x );
    var height = Math.floor( this.resolution.y );

    // build a framebuffer
    this._fbo = GL.context.createFramebuffer();
    GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, this._fbo );

    // build render buffers.
    var colorTex = new Texture();
    colorTex.textureId = GL.context.createTexture();
    GL.context.bindTexture( GL.context.TEXTURE_2D, colorTex.textureId );
    GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, GL.context.NEAREST);
    GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, GL.context.NEAREST);
    GL.context.texImage2D( GL.context.TEXTURE_2D, 0, GL.context.RGBA, width, height, 0, GL.context.RGBA, GL.context.UNSIGNED_BYTE, null);
    GL.context.framebufferTexture2D( GL.context.FRAMEBUFFER, GL.context.COLOR_ATTACHMENT0, GL.context.TEXTURE_2D, colorTex.textureId, 0);

    colorTex.ready = true;
    colorTex.onReady( colorTex );

    //var depth = this._depthAttachment = gl.createRenderbuffer();
    //gl.bindRenderbuffer( gl.RENDERBUFFER, depth );
    //gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );
    //gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth );
  }

  private _destroyFbo () {
    GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, null );
    GL.context.deleteFramebuffer( this._fbo );

    //gl.deleteRenderbuffer( this._colorAttachment );
    //gl.deleteRenderbuffer( this._depthAttachment );
  }
  */
  useCamera () {
    if ( this.renderTexture != null ) {
      GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, this.renderTexture.framebufferId );
    }else{
      GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, null );
    }
  }

}


/*
Camera.prototype.blitCamera = function ( windowWidth, windowHeight ) {
  //console.warn( "Blitting camera to main display buffer does not work. Instead, we will need to render to a texture, and draw a fullscreen quad.")
  //gl.viewport( 0, 0, this.resolution.x, this.resolution.y );
  //gl.bindFramebuffer( gl.READ_FRAMEBUFFER, this._fbo );
  //gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, null );
  //gl.blitFramebuffer( 0, 0, this.resolution.x, this.resolution.y, 0, 0 , windowWidth, windowHeight, gl.COLOR_BUFFER_BIT, gl.NEAREST);
}*/
