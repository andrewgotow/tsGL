class Scene {

  private static _currentScene : Scene; // there can only be a singl scene loaded at any time.
  private _updateInterval : number;

  entities : { [ id : number ] : Entity };
  systems : System[];

  constructor () {
    this.entities = {};
    this.systems = [];
  }

  addEntity ( entity : Entity ) : Scene {
    this.entities[ entity.id ] = entity;
    this.systems.forEach( function (system : System, index : number, array : [ System ] ) {
      system.registerComponentsOfEntity( entity );
    });
    return this;
  }

  removeEntity ( entity : Entity ) : Scene {
    delete this.entities[ entity.id ];
    return this;
  }

  addSystem ( system : System ) : Scene {
    this.systems.push( system );

    for ( var id in this.entities ) {
      if ( this.entities.hasOwnProperty(id) ) {
        system.registerComponentsOfEntity( this.entities[id] );
      }
    }

    return this;
  }

  startup () : Scene {
    this.systems.forEach( function (system, index, array) {
      system.startup();
    });

    var scene = this;
    this._updateInterval = setInterval( function(){scene.update(0.03)}, 30 );

    // bump the frame-rate down because I'm in a coffee shop and my battery's about to die.
    //this._updateInterval = setInterval( function(){scene.update(0.1)}, 100 );

    return this;
  }

  update ( deltaTime : number ) : Scene {
    this.systems.forEach( function (system, index, array) {
      system.update( deltaTime );
    });
    return this;
  }

  shutdown () : Scene {
    clearInterval( this._updateInterval );
    this.systems.forEach( function (system, index, array) {
      system.shutdown();
    });
    return this;
  }

  // Only one scene should be displayed at any given time. Here, we shutdown
  // the current scene if it exists, and then load the newly given scene.
  static loadScene ( scene : Scene ) {
    // shutdown the existing scene if it exists.
    if ( Scene._currentScene != null ) {
      Scene._currentScene.shutdown();
    }

    // replace it, and use the new scene.
    Scene._currentScene = scene;
    Scene._currentScene.startup();
  }

  static loadSceneWithId ( id : string ) {
    var element = document.getElementById( id );
    if ( element instanceof TSGLSceneElement ) {
      Scene.loadScene( element.buildScene() );
    }
  }

}
