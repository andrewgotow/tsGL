
class Entity {
  id : number;
  components : { [type : string] : Component };

  constructor () {
    this.id = uid();
    this.components = {};
    // entities will always have a transform.
    this.addComponent( new Transform() );
  }

  // TODO: Replace this with a generic implementation which returns already
  // typecasted components.
  getComponent ( type: string ) : Component {
    if ( this.components.hasOwnProperty( type ) )
      return this.components[ type ];
    return null;
  }

  addComponent ( component : Component ) : Entity {
    component.entity = this;
    this.components[ typeOf(component) ] = component;
    return this;
  }

  removeComponent ( component : Component ) : Entity {
    component.entity = null;
    delete this.components[ typeOf(component) ];
    return this;
  }

  static entityWithId ( id : string ) : Entity {
    var element = document.getElementById( id );
    if ( element instanceof TSGLEntityElement ) {
      return element.entity;
    }
  }

}
