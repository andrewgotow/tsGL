class TSGLShaderElement extends HTMLElement {

  private _shader : Shader;
  get shader() : Shader {
    if ( this._shader == null )
      this.loadAsset();
    return this._shader;
  }

  loadAsset () {
    var vertSrcAttr = this.attributes.getNamedItem( "vert-src" );
    var fragSrcAttr = this.attributes.getNamedItem( "frag-src" );

    if ( vertSrcAttr != null && fragSrcAttr != null ) {
      this._shader = new Shader( "Hello", vertSrcAttr.value, fragSrcAttr.value );
    }
  }

}
