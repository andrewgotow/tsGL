class Texture extends Asset {
  url : string;
  private _texture : WebGLTexture;

  constructor () {
    super();
    this._texture = null;
  }

  static fromFile ( url: string ) : Texture {
    var tex = new Texture();
    tex.url = url;
    tex._texture = GL.context.createTexture();

    var img = new Image();
    img.onload = function() {
      GL.context.bindTexture( GL.context.TEXTURE_2D, tex._texture );
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
    img.src = tex.url;
    return tex;
  }

  private _unload () {
    GL.context.deleteTexture( this._texture );
  }

  getTextureId () : WebGLTexture {
    if ( this._texture == null )
      console.error( "Attempting to use Texture asset before it has been loaded.")
    return this._texture;
  }

}
