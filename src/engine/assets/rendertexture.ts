class RenderTexture extends Asset {

  width : number;
  height : number;

  framebufferId : WebGLFramebuffer;
  colorTexture : Texture;
  depthTexture : Texture;

  constructor ( width: number, height: number ) {
    super();
    this.width = width;
    this.height = height;

    this.framebufferId = null;
    this.colorTexture = null;
    this.depthTexture = null;

    this._buildFbo();
  }

  private _buildFbo () {
    // build a framebuffer
    this.framebufferId = GL.context.createFramebuffer();
    GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, this.framebufferId );

    // build render buffers.
    this.colorTexture = new Texture();
    this.colorTexture.textureId = GL.context.createTexture();
    GL.context.bindTexture( GL.context.TEXTURE_2D, this.colorTexture.textureId );
    GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, GL.context.NEAREST);
    GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, GL.context.NEAREST);
    GL.context.texImage2D( GL.context.TEXTURE_2D, 0, GL.context.RGBA, this.width, this.height, 0, GL.context.RGBA, GL.context.UNSIGNED_BYTE, null);
    GL.context.framebufferTexture2D( GL.context.FRAMEBUFFER, GL.context.COLOR_ATTACHMENT0, GL.context.TEXTURE_2D, this.colorTexture.textureId, 0);

    this.colorTexture.ready = true;
    this.colorTexture.onReady( this.colorTexture );

    this.ready = true;
    this.onReady( this );

    //var depth = this._depthAttachment = gl.createRenderbuffer();
    //gl.bindRenderbuffer( gl.RENDERBUFFER, depth );
    //gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );
    //gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth );
  }

  private _destroyFbo () {
    GL.context.bindFramebuffer( GL.context.FRAMEBUFFER, null );
    GL.context.deleteFramebuffer( this.framebufferId );

    //gl.deleteRenderbuffer( this._colorAttachment );
    //gl.deleteRenderbuffer( this._depthAttachment );
  }

}
