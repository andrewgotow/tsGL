/// <reference path="../tsgl-element.ts"/>

class TSGLEntityElement extends TSGLElement {

  entity : Entity = null;

  buildEntity () : Entity {
    this.entity = new Entity();

    // iterate through child elements. Add them to the scene.
    var children = this.children;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof TSGLComponentElement )
        this.entity.addComponent( child.buildComponent() );
    }

    return this.entity;
  }

}
