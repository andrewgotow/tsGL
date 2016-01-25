abstract class System {

  constructor () {}

  tryRegisterComponent ( component : Component ) : boolean {
    return false;
  }

  registerComponentsOfEntity ( entity : Entity ) {
    for (var key in entity.components) {
      if ( entity.components.hasOwnProperty(key) ) {
        this.tryRegisterComponent( entity.components[key] );
      }
    }
  }

  startup () {}

  update ( deltaTime : number ) {}

  shutdown () {}

}
