class TSGLSceneElement extends HTMLElement {

  scene : Scene = null;

  buildScene () : Scene {
    this.scene = new Scene();

    // iterate through child elements. Add them to the scene.
    var children = this.children;
    for ( var i = 0; i < children.length; i ++ ) {
      var child = children[i];
      if ( child instanceof TSGLEntityElement )
        this.scene.addEntity( child.buildEntity() );
      if ( child instanceof TSGLSystemElement )
        this.scene.addSystem( child.system );
    }

    return this.scene;
  }

}
