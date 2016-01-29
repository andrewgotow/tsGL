class Material extends Asset {
  shader: Shader;
  properties: { [key: string]: any; }
  textures: { [key: string]: Texture; };

  constructor( shader: Shader ) {
    super();
    this.shader = shader;
    this.properties = {};
    this.textures = {};

    this.ready = true;
    this.onReady( this );
  }

  useMaterial () {
    if (this.shader != null) {
      this.shader.useProgram();

      // bind uniforms from material to match shaders parameters
      for ( var key in this.properties ) {
        if ( this.properties.hasOwnProperty(key) ) {
          this.shader.setUniform( key, this.properties[key] );
        }
      }

      var texIndex = 0;
      for ( var key in this.textures ) {
        if ( this.textures.hasOwnProperty(key) ) {
          this.shader.setTexture( key, this.textures[key], texIndex++ );
        }
      }
    }
  }

}
