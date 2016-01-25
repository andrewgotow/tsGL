class TSGLPropertyElement extends HTMLElement {

  key : string;
  value : any;

  createdCallback () {
    var keyAttr = this.attributes.getNamedItem( "name" );
    var valueAttr = this.attributes.getNamedItem( "value" );

    if ( keyAttr != null && valueAttr != null ) {
      this.key = keyAttr.value;
      this.value = valueAttr.value;
    }
  }

}
