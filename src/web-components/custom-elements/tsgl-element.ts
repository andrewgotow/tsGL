class TSGLElement extends HTMLElement {

  getProperties ( allowedTypes : string[] = null, excludedTypes : String[] = null ) : { [key: string]: any; } {
    var properties : { [key: string]: any; } = {};

    var elements = this.getElementsByTagName( "tsgl-property" );
    for ( var i = 0; i < elements.length; i ++ ) {
      var property = <TSGLPropertyElement>elements[i];
      var propertyType = property.type;
      if ( allowedTypes == null || allowedTypes.indexOf( propertyType ) > -1 ) {
        if ( excludedTypes == null || excludedTypes.indexOf( propertyType ) == -1 ) {
          properties[ property.key ] = property.getValue();
        }
      }
    }

    return properties;
  }

  static buildEntityHierarchy ( element: HTMLElement, parentTransform : Transform = null ) : Entity[] {
    var returnEntities : Entity[] = [];
    var transform : Transform = null;

    if ( element instanceof TSGLEntityElement ) {
      var entity = element.buildEntity();
      transform = <Transform>entity.getComponent("Transform");
      transform.parent = parentTransform;
      returnEntities.push( entity );
    }

    var children = element.childNodes;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof HTMLElement ) {
        var childEntities : Entity[] = TSGLElement.buildEntityHierarchy( child, transform );
        returnEntities = returnEntities.concat( childEntities );
      }
    }

    return returnEntities;
  }

}
