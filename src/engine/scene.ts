class Scene {
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
    return this;
  }

  startup () : Scene {
    this.systems.forEach( function (system, index, array) {
      system.startup();
    });
    return this;
  }

  update ( deltaTime : number ) : Scene {
    this.systems.forEach( function (system, index, array) {
      system.update( deltaTime );
    });
    return this;
  }

  shutdown () : Scene {
    this.systems.forEach( function (system, index, array) {
      system.shutdown();
    });
    return this;
  }
}
