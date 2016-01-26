class TSGLComponentElement extends HTMLElement {

  buildComponent () : Component {
    var typeAttr = this.attributes.getNamedItem( "type" );
    if ( typeAttr != null ) {
      switch ( typeAttr.value ) {
        case "transform":
          var transform = new Transform();
          transform.position = new Vec3(
            Number( this.attributes.getNamedItem( "x" ).value ),
            Number( this.attributes.getNamedItem( "y" ).value ),
            Number( this.attributes.getNamedItem( "z" ).value )
          );
          return transform;
        case "renderable":
          var renderable = new Renderable();

          var meshAttr = this.attributes.getNamedItem( "mesh" );
          if ( meshAttr != null ) {
            var element = document.getElementById( meshAttr.value );
            if ( element instanceof TSGLMeshElement ) {
              renderable.mesh = element.mesh;
            }
          }

          var materialAttr = this.attributes.getNamedItem( "material" );
          if ( materialAttr != null ) {
            var element = document.getElementById( materialAttr.value );
            if ( element instanceof TSGLMaterialElement ) {
              renderable.material = element.material;
            }
          }

          return renderable;
        case "light":
          var color = Color.fromHex( this.attributes.getNamedItem( "color" ).value );
          var intensity = Number( this.attributes.getNamedItem( "intensity" ).value );
          var range = Number( this.attributes.getNamedItem("range").value );     
          return new Light( color, intensity, range );
        case "camera":
          return new Camera( 60, new Vec3(100.0, 100.0, 0) );
        default:
          console.error( "Attempting to instantiate unknown component from DOM Element" );
          return null;
      }
    }
  }

}
