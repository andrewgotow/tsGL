class TSGLMaterialElement extends HTMLElement {

  _material : Material;
  get material():Material {
    if ( this._material == null )
      this.loadAsset();
    return this._material;
  }

  loadAsset () {
    var shaderAttr = this.attributes.getNamedItem( "shader" );
    if ( shaderAttr != null ) {
      var shaderElement = document.getElementById( shaderAttr.value );
      if ( shaderElement instanceof TSGLShaderElement ) {
        this._material = new Material( shaderElement.shader );

        // load child property elements.
        var children = this.children;
        for ( var i = 0; i < children.length; i ++ ) {
          var child = children[i];
          if ( child instanceof TSGLPropertyElement )
            this._material.properties[ child.key ] = child.value;
          if ( child instanceof TSGLTextureElement )
            this._material.properties[ child.name ] = child.texture;
        }
      }
    }
  }

  /*
  createdCallback () {

  }
  */
}
