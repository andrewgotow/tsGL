Shader.prototype = new Asset();
Shader.prototype.constructor = Shader;
function Shader ( name, vertUrl, fragUrl ) {
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

Shader.prototype._buildShader = function () {
  // because we're entering an anonymous function, retain a reference to "this"
  // so we can set up member variables from within the closure.
  var shader = this;

  loadFiles([ shader.vertUrl, shader.fragUrl ], function (shaderText) {
      var vert = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource( vert, shaderText[0] );
      gl.compileShader( vert );
      if (!gl.getShaderParameter( vert, gl.COMPILE_STATUS )) {
        console.error("GLSL error in \"" + shader.vertUrl + "\": " + gl.getShaderInfoLog(vert) );
        gl.deleteProgram( vert );
      }

      var frag = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource( frag, shaderText[1] );
      gl.compileShader( frag );
      if (!gl.getShaderParameter( frag, gl.COMPILE_STATUS )) {
        console.error("GLSL error in \"" + shader.fragUrl + "\": " + gl.getShaderInfoLog(frag) );
        gl.deleteProgram( frag );
      }

      var program = gl.createProgram();
      gl.attachShader( program, vert );
      gl.attachShader( program, frag );
      gl.linkProgram( program );

      // Check the link status
      if (!gl.getProgramParameter( program, gl.LINK_STATUS)) {
        console.error("GLSL link error in \"" + shader.name + "\": " + gl.getProgramInfoLog( program ));
        gl.deleteProgram( program );
      }

      shader._program = program;
      shader._getUniforms();
      shader._getAttributes();

  }, function (url) {
      alert('Failed to download shader program "' + url + '"');
  });

}

Shader.prototype._bindProgramInputs = function () {
  gl.useProgram( this._program );

  //this.in_mvMat = gl.getUniformLocation( this._program, "uModelView");
  //this.in_proj = gl.getUniformLocation( this._program, "uProjection");

  this.in_pos = gl.getAttribLocation( this._program, "vPosition");
  this.in_normal = gl.getAttribLocation( this._program, "vNormal");

  gl.enableVertexAttribArray( this.in_pos );
  gl.enableVertexAttribArray( this.in_normal );

  gl.useProgram(null);
}

Shader.prototype.useProgram = function () {
  gl.useProgram( this._program );
}

Shader.prototype._getUniforms = function () {
  // introspect the shader program to fetch all supported Uniforms.
  var count = gl.getProgramParameter( this._program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; i++) {
    var name = gl.getActiveUniform( this._program, i ).name;
    this.uniforms[name] = gl.getUniformLocation(this._program, name);
  }
}

Shader.prototype._getAttributes = function () {
  // introspect the shader program to fetch all supported Uniforms.
  var count = gl.getProgramParameter( this._program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < count; i++) {
    var name = gl.getActiveAttrib( this._program, i ).name;
    this.attributes[name] = gl.getAttribLocation(this._program, name);
  }
}

Shader.prototype.setUniform = function ( key, value ) {
  if ( key in this.uniforms ) {
    var loc = this.uniforms[key];
    switch ( typeOf(value) ) {
        case "number":
          gl.uniform1f( loc, value );
          break;
        case "array":
          gl.uniform1fv( loc, value.length, new Float32Array(value) );
          break;
        case "Vec3":
          gl.uniform3f( loc, value.x, value.y, value.z );
          break;
        case "Mat4":
          gl.uniformMatrix4fv( loc, 1, false, value.data );
          break;
        case "Texture":
          gl.uniform1i( loc, value.getTextureId() );
          break;
        default:
          console.error( "Attempting to assign unknown type to shader uniform \"" + key + "\", in shader \"" + this.name + "\"." );
    }
  }else{
    console.error( "Attempting to assign unknown uniform to shader \"" + key + "\", in shader \"" + this.name + "\"." );
  }
}


Shader.prototype.ready = function () {
  return this._program != null;
}
