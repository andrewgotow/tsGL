class TSGLTextureElement extends HTMLElement {

  name : string;
  _texture : Texture;
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

  createdCallback () {
    var nameAttr = this.attributes.getNamedItem( "name" );
    if ( nameAttr != null ) {
      this.name = nameAttr.value;
    }
  }

}
