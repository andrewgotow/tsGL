/*
Referenced External Functions
NAME:         USAGE:                        LOCATION:
checkTypes:   verify parameter types.       imported from "core-helpers.js"
*/

function Entity () {
  this.id = uid();
  this.components = {};

  this.addComponent( new Transform() );  // entities will always have a transform.
}

Entity.prototype.getComponent = function ( type ) {
  checkTypes( [type], ["string"] );
  if ( this.components.hasOwnProperty(type) )
    return this.components[ type ];
  return null;
}

Entity.prototype.addComponent = function ( component ) {
  //checkTypes( [component], ["Component"] );
  component.entity = this;
  this.components[ typeOf(component) ] = component;
  return this;
}

Entity.prototype.removeComponent = function ( component ) {
  //checkTypes( [component], ["Component"] );
  component.entity = null;
  delete this.components[ typeOf(component) ];
  return this;
}
