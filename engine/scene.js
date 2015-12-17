/*
Referenced External Functions
NAME:         USAGE:                        LOCATION:
checkTypes:   verify parameter types.       imported from "core-helpers.js"
*/

function Scene () {
  this.entities = {};
  this.systems = new Array();
}

Scene.prototype.addEntity = function ( entity ) {
  //checkTypes( [entity], ["Entity"] );
  this.entities[ entity.id ] = entity;
  this.systems.forEach( function (system, index, array) {
    system.registerComponentsOfEntity( entity );
  });
  return this;
}

Scene.prototype.removeEntity = function ( entity ) {
  delete this.entities[ entity.id ];
  return this;
}

Scene.prototype.addSystem = function ( system ) {
  //checkTypes( [system], ["System"] );
  this.systems.push( system );
  return this;
}

Scene.prototype.startup = function () {
  this.systems.forEach( function (system, index, array) {
    system.startup();
  });
  return this;
}

Scene.prototype.update = function ( dt ) {
  checkTypes( [dt], ["number"] );
  this.systems.forEach( function (system, index, array) {
    system.update(dt);
  });
  return this;
}

Scene.prototype.shutdown = function () {
  this.systems.forEach( function (system, index, array) {
    system.shutdown();
  });
  return this;
}
