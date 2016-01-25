class TSGLSystemElement extends HTMLElement {

  system : System;

  createdCallback () {
    var typeAttr = this.attributes.getNamedItem( "type" );
    if ( typeAttr != null ) {
      switch ( typeAttr.value ) {
        case "renderer":
          this.system = new Renderer();
          break;
        default:
          console.error( "Attempting to instantiate unknown system from DOM Element" );
      }
    }
  }

}
