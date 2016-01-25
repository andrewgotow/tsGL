class TSGLSceneElement extends HTMLElement {

  buildScene () : Scene {
    var scene = new Scene();

    // iterate through child elements. Add them to the scene.
    var children = this.children;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof TSGLEntityElement )
        scene.addEntity( child.buildEntity() );
      if ( child instanceof TSGLSystemElement )
        scene.addSystem( child.system );
    }

    return scene;
  }

}
