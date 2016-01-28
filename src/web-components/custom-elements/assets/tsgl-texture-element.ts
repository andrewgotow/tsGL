class TSGLTextureElement extends HTMLElement {

  private _texture : Texture;
  get texture() : Texture {
    if ( this._texture == null )
      this.loadAsset();
    return this._texture;
  }

  loadAsset () {
    var srcAttr = this.attributes.getNamedItem( "src" );

    if ( srcAttr != null ) {
      this._texture = Texture.fromFile( srcAttr.value );
    }
  }

}
