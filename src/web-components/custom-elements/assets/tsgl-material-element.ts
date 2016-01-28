/// <reference path="../tsgl-element.ts"/>

class TSGLMaterialElement extends TSGLElement {

  private _material : Material;
  get material():Material {
    if ( this._material == null )
      this.loadAsset();
    return this._material;
  }

  loadAsset () {
    var shaderAttr = this.attributes.getNamedItem( "shader" );
    if ( shaderAttr != null ) {
      var element = document.getElementById( shaderAttr.value );
      if ( element instanceof TSGLShaderElement ) {
        this._material = new Material( element.shader );

        var properties = this.getProperties();
        this._material.properties = properties;
      }
    }
  }

}
