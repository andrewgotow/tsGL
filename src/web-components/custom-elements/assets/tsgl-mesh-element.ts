class TSGLMeshElement extends HTMLElement {

  _mesh : Mesh;
  get mesh() : Mesh {
    if ( this._mesh == null )
      this.loadAsset();
    return this._mesh;
  }

  loadAsset () {
    var srcAttr = this.attributes.getNamedItem( "src" );
    if ( srcAttr != null ) {
      this._mesh = Mesh.fromFile( srcAttr.value );
    }
  }

}
