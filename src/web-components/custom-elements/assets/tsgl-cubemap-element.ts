class TSGLCubemapElement extends HTMLElement {

  private _cubemap : Cubemap;
  get cubemap() : Cubemap {
    if ( this._cubemap == null )
      this.loadAsset();
    return this._cubemap;
  }

  loadAsset () {
    var leftSrcAttr = this.attributes.getNamedItem( "left-src" );
    var rightSrcAttr = this.attributes.getNamedItem( "right-src" );
    var topSrcAttr = this.attributes.getNamedItem( "top-src" );
    var bottomSrcAttr = this.attributes.getNamedItem( "bottom-src" );
    var frontSrcAttr = this.attributes.getNamedItem( "front-src" );
    var backSrcAttr = this.attributes.getNamedItem( "back-src" );

    var urls : string[] = [];

    if (  leftSrcAttr != null &&
          rightSrcAttr != null &&
          topSrcAttr != null &&
          bottomSrcAttr != null &&
          frontSrcAttr != null &&
          backSrcAttr != null ) {

      var urls = [ leftSrcAttr.value, rightSrcAttr.value, topSrcAttr.value, bottomSrcAttr.value, frontSrcAttr.value, backSrcAttr.value ];
      this._cubemap = Cubemap.fromFiles( urls );
    }
  }

}
