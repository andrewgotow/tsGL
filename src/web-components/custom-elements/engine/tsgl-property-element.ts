class TSGLPropertyElement extends HTMLElement {

  type : string = null;
  key : string = null;
  value : any = null;

  createdCallback () {
    var typeAttr = this.attributes.getNamedItem( "type" );
    if ( typeAttr != null )
      this.type = typeAttr.value;

    var keyAttr = this.attributes.getNamedItem( "name" );
    if ( keyAttr != null )
      this.key = keyAttr.value;
  }

  getValue () : any {
    if ( this.value != null )
      return this.value;

    var valueAttr = this.attributes.getNamedItem( "value" );
    if ( valueAttr != null ) {
      switch ( this.type ) {
        case "number":
          this.value = Number( valueAttr.value );
          break;
        case "vector":
          var components = valueAttr.value.split( /[,\s]/ );
          this.value = new Vec3(
            Number(components[0]),
            Number(components[1]),
            Number(components[2]));
          break;
        case "color":
          this.value = Color.fromHex( valueAttr.value );
          break;
        case "material":
          var element = document.getElementById( valueAttr.value );
          if ( element instanceof TSGLMaterialElement )
            this.value = element.material;
          break;
        case "mesh":
          var element = document.getElementById( valueAttr.value );
          if ( element instanceof TSGLMeshElement )
            this.value = element.mesh;
          break;
        case "texture":
          var element = document.getElementById( valueAttr.value );
          if ( element instanceof TSGLTextureElement )
            this.value = element.texture;
          break;
        case "cubemap":
          var element = document.getElementById( valueAttr.value );
          if ( element instanceof TSGLCubemapElement )
            this.value = element.cubemap;
          break;
        default:
          console.warn( "tsgl-property element defined with unknown type: " + this.type );
      }
      return this.value;
    }
  }

}
