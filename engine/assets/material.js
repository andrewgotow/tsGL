Material.prototype = new Asset();
Material.prototype.constructor = Material;
function Material ( shader ) {
  this.shader = shader;
  this.properties = {}; // map of uniform values to be bound when drawing.
}

Material.prototype.useMaterial = function () {
  if (this.shader != null) {
    this.shader.useProgram();

    // bind uniforms from material to match shaders parameters
    for ( var key in this.properties ) {
      if ( this.properties.hasOwnProperty(key) ) {
        this.shader.setUniform( name, this.properties[key] );
      }
    }
  }
}

Material.prototype.ready = function () {
  return this.shader != null;
}
