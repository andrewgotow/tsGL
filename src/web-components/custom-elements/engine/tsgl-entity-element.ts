class TSGLEntityElement extends HTMLElement {

  buildEntity () : Entity {
    var entity = new Entity();

    // iterate through child elements. Add them to the scene.
    var children = this.children;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof TSGLComponentElement )
        entity.addComponent( child.buildComponent() );

      // Special case for child entities. Set their transform's parent.
      //if ( child instanceof TSGLEntityElement ) {
      //  var childEntity = child.buildEntity();
      //  (<Transform>childEntity.getComponent("Transform")).parent = <Transform>entity.getComponent("Transform");
      //}
    }

    return entity;
  }

}
