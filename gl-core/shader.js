function Shader ( name ) {
  this.name = name;
  this.in_pos = this.in_normal = null;
  this.in_mvMat = this.in_proj = null;

  // Create the shader program
  this._program = gl.createProgram();

  // load our fragment and vertex programs from the DOM
  var frag = glHelpers.getShaderProgramFromDom( "shader-" + name + "-fs");
  var vert = glHelpers.getShaderProgramFromDom( "shader-" + name + "-vs");

  gl.attachShader(this._program, vert);
  gl.attachShader(this._program, frag);
  gl.linkProgram(this._program);

  // Check the link status
  var linked = gl.getProgramParameter(this._program, gl.LINK_STATUS);
  if (!linked) {

    // An error occurred while linking
    var lastError = gl.getProgramInfoLog(this._program);
    console.warn("Error in program linking:" + lastError);

    gl.deleteProgram(this._program);
    return null;
  }

  this._bindInputs();
}

Shader.prototype._bindInputs = function () {
  gl.useProgram( this._program );

  this.in_mvMat = gl.getUniformLocation( this._program, "uModelView");
  this.in_proj = gl.getUniformLocation( this._program, "uProjection");

  this.in_pos = gl.getAttribLocation( this._program, "vPosition");
  this.in_normal = gl.getAttribLocation( this._program, "vNormal");

  gl.enableVertexAttribArray( this.in_pos );
  gl.enableVertexAttribArray( this.in_normal );

  gl.useProgram(null);
}
/*
Shader.prototype._bindOutputs = function () {
  this.bindProgram();
  gl.bindFragDataLocation( this._program, 0, "fColor0" );
  gl.useProgram(null);
}
*/
Shader.prototype.bindProgram = function () {
  gl.useProgram( this._program );
}
