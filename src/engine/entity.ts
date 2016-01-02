
class Entity {
  id : number;
  components : { [type : string] : Component };

  constructor () {
    this.id = uid();
    this.components = {};
    this.addComponent( new Transform() );  // entities will always have a transform.
  }

  getComponent ( type : string ) : Component {
    if ( this.components.hasOwnProperty(type) )
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
}
