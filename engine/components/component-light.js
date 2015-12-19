Light.prototype = new Component();
Light.prototype.constructor = Light;
function Light ( color, intensity, range ) {
  checkTypes( [color,intensity], ["Color", "number", "number" ] );
  this.color = color;
  this.intensity = intensity;
  this.type = Light.POINT_TYPE;
  this.range = range;
}

Light.POINT = 1;
Light.DIRECTIONAL = 1;

Light.prototype.getImportanceForMesh = function ( mesh ) {
  switch (this.type) {
    case Light.DIRECTIONAL:
      return this.intensity;
    case Light.POINT:
    // TODO: Implement attenuation calculations for light importance.
      return this.intensity;
    default:
      return 0;
  }
}

// pack lighting information into a matrix
Light.prototype.getMatrix = function ( mesh ) {
  var position = this.entity.getComponent("Transform").position;
  return mat4([
    this.color.r,	  0, 0, position.x,
    this.color.g,   0, 0, position.y,
    this.color.b,   0, 0, position.z,
    this.intensity, 0, 0, this.range
  ]);
}
