class Texture extends Asset {
  textureId : WebGLTexture;

  constructor () {
    super();
    this.textureId = null;
  }

  static fromFile ( url: string ) : Texture {
    var tex = new Texture();
    tex.textureId = GL.context.createTexture();

    var img = new Image();
    img.onload = function() {
      GL.context.bindTexture( GL.context.TEXTURE_2D, tex.textureId );
      GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR );
      GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR_MIPMAP_NEAREST );
      GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_S, GL.context.REPEAT );
      GL.context.texParameteri( GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_T, GL.context.REPEAT );
      GL.context.texImage2D( GL.context.TEXTURE_2D, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img );
      GL.context.generateMipmap( GL.context.TEXTURE_2D );
      GL.context.bindTexture( GL.context.TEXTURE_2D, null );

      tex.ready = true;
      tex.onReady( tex );
    }
    img.src = url;
    return tex;
  }
  
  private _unload () {
    GL.context.deleteTexture( this.textureId );
  }

}
