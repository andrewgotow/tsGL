/// <reference path="../tsgl-element.ts"/>

class TSGLSceneElement extends TSGLElement {

  scene : Scene = null;

  buildScene () : Scene {
    this.scene = new Scene();

    // iterate through child elements. Add them to the scene.
    var children = this.children;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof TSGLSystemElement )
        this.scene.addSystem( child.system );
    }

    var entities = TSGLElement.buildEntityHierarchy( this );
    for ( var i = 0; i < entities.length; i ++ ) {
      this.scene.addEntity( entities[i] );
    }

    return this.scene;
  }

}
