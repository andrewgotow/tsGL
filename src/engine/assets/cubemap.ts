class Cubemap extends Asset {
  urls : string[];
  private _texture : WebGLTexture;

  constructor () {
    super();
    this._texture = null;
  }

  static fromFiles ( urls: string[] ) : Cubemap {
    var tex = new Cubemap();
    tex.urls = urls;
    tex._texture = GL.context.createTexture();

    GL.context.bindTexture( GL.context.TEXTURE_CUBE_MAP, tex._texture );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR_MIPMAP_NEAREST );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_S, GL.context.REPEAT );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_T, GL.context.REPEAT );

    var numLoaded = 0;
    for ( var face = 0; face < Math.min( 6, urls.length ); face ++ ) {
      var img = new Image();
      img.onload = function() {
        GL.context.bindTexture( GL.context.TEXTURE_CUBE_MAP, tex._texture );
        GL.context.texImage2D( GL.context.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img );
        if ( ++ numLoaded == Math.min( 6, urls.length ) )
          tex.ready = true;
          tex.onReady( tex );
      }
      img.src = tex.urls[face];
    }

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
