
class Shader extends Asset {
  name: string;
  vertUrl: string;
  fragUrl: string;
  attributes: { [name: string]: number };
  uniforms: { [name:string]: WebGLUniformLocation };
  private _program: WebGLProgram = null;

  constructor( name: string, vertUrl: string, fragUrl: string ) {
    super();
    this.name = name;
    this.vertUrl = vertUrl;
    this.fragUrl = fragUrl;

    // shader name / location maps.
    this.attributes = {};
    this.uniforms = {};

    // build the actual OpenGL shader object.
    this._program = null;
    this._buildShader();
  }

  private _buildShader () {
    // because we're entering an anonymous function, retain a reference to "this"
    // so we can set up member variables from within the closure.
    var shader = this;

    loadFiles([ shader.vertUrl, shader.fragUrl ], function (shaderText) {
        var vert = GL.context.createShader( GL.context.VERTEX_SHADER );
        GL.context.shaderSource( vert, shaderText[0] );
        GL.context.compileShader( vert );
        if (!GL.context.getShaderParameter( vert, GL.context.COMPILE_STATUS )) {
          console.error("GLSL error in \"" + shader.vertUrl + "\": " + GL.context.getShaderInfoLog(vert) );
          GL.context.deleteProgram( vert );
        }

        var frag = GL.context.createShader(GL.context.FRAGMENT_SHADER);
        GL.context.shaderSource( frag, shaderText[1] );
        GL.context.compileShader( frag );
        if ( !GL.context.getShaderParameter( frag, GL.context.COMPILE_STATUS )) {
          console.error("GLSL error in \"" + shader.fragUrl + "\": " + GL.context.getShaderInfoLog(frag) );
          GL.context.deleteProgram( frag );
        }

        var program = GL.context.createProgram();
        GL.context.attachShader( program, vert );
        GL.context.attachShader( program, frag );
        GL.context.linkProgram( program );

        // Check the link status
        if ( !GL.context.getProgramParameter( program, GL.context.LINK_STATUS)) {
          console.error("GLSL link error in \"" + shader.name + "\": " + GL.context.getProgramInfoLog( program ));
          GL.context.deleteProgram( program );
        }

        shader._program = program;
        shader._getUniforms();
        shader._getAttributes();

        shader.ready = true;
        shader.onReady( shader );

    }, function (url) {
        alert('Failed to download shader program "' + url + '"');
    });
  }

  useProgram () {
    GL.context.useProgram( this._program );
    GL.context.enableVertexAttribArray( this.attributes["vPosition"] );
    GL.context.enableVertexAttribArray( this.attributes["vNormal"] );
    GL.context.enableVertexAttribArray( this.attributes["vTexcoord"] );
  }

  private _getUniforms () {
    // introspect the shader program to fetch all supported Uniforms.
    var count = GL.context.getProgramParameter( this._program, GL.context.ACTIVE_UNIFORMS );
    for (var i = 0; i < count; i++) {
      var name = GL.context.getActiveUniform( this._program, i ).name;
      this.uniforms[name] = GL.context.getUniformLocation( this._program, name );
    }
  }

  private _getAttributes () {
    // introspect the shader program to fetch all supported Uniforms.
    var count = GL.context.getProgramParameter( this._program, GL.context.ACTIVE_ATTRIBUTES );
    for (var i = 0; i < count; i++) {
      var name = GL.context.getActiveAttrib( this._program, i ).name;
      this.attributes[name] = GL.context.getAttribLocation( this._program, name );
    }
  }

  setUniform ( key: string, value: any ) {
    if ( this._program == null )
      return;

    GL.context.useProgram( this._program );

    if ( key in this.uniforms ) {
      var loc: WebGLUniformLocation = this.uniforms[key];
      switch ( typeOf(value) ) {
          case "number":
            GL.context.uniform1f( loc, value );
            break;
          case "array":
            GL.context.uniform1fv( loc, new Float32Array(value) );
            break;
          case "Vec3":
            GL.context.uniform3f( loc, value.x, value.y, value.z );
            break;
          case "Mat4":
            GL.context.uniformMatrix4fv( loc, false, value.data );
            break;
          case "Texture":
            GL.context.activeTexture( GL.context.TEXTURE0 );
            GL.context.bindTexture( GL.context.TEXTURE_2D, value.getTextureId() );
            GL.context.uniform1i( loc, value.getTextureId() );
            break;
          case "Cubemap":
            GL.context.activeTexture( GL.context.TEXTURE1 );
            GL.context.bindTexture( GL.context.TEXTURE_CUBE_MAP, value.getTextureId() );
            GL.context.uniform1i( loc, value.getTextureId() );
            break;
          default:
            console.warn( "Attempting to assign unknown type to shader uniform \"" + key + "\", in shader \"" + this.name + "\"." );
      }
    }else{
      console.warn( "Attempting to assign unknown uniform of shader \"" + key + "\", in shader \"" + this.name + "\"." );
    }
  }

}
