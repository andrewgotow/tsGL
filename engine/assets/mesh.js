Mesh.prototype = new Asset();
Mesh.prototype.constructor = Mesh;
function Mesh ( url ) {
  this.url = url;

  this.vertices = new Float32Array();
  this.normals = new Float32Array();
  this.uvs = new Float32Array();
  this.triangles = new Int16Array();

  this._vbo = null; // vertex buffer object
  this._ebo = null; // element buffer object (used for triangles)

  this._load();
}

Mesh.prototype._load = function () {
  var mesh = this;
  // import a file.
  loadFile( this.url, this.url, function ( text, url ) {
    // parse through the mesh file to get our Mesh data.
    // TODO: Regex parsing of OBJ file.
    mesh._buildVbo();
    mesh._buildEbo();
  }, function ( url ) {
    console.error( "Could not download Mesh file, \"" + url + "\"" );
  });
}

Mesh.prototype._buildVbo = function () {
  // if our buffer doesn't exist, create one
  if ( this._vbo == null )
    this._vbo = gl.createBuffer();
  // then bind our new buffer, and allocate memory equal to the size of all our
  // data (floats are 4 bytes).
  gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
  gl.bufferData( gl.ARRAY_BUFFER, 4 * (this.vertices.length + this.normals.length + this.uvs.length), gl.STATIC_DRAW );
  // then, copy our vertex data into chunks of the buffer. Attributes are sequential. |VVVNNNUUU|
  gl.bufferSubData( gl.ARRAY_BUFFER, 0, this.vertices );
  gl.bufferSubData( gl.ARRAY_BUFFER, 4 * this.vertices.length, this.normals );
  gl.bufferSubData( gl.ARRAY_BUFFER, 4 * (this.vertices.length + this.normals.length), this.uvs );
}

Mesh.prototype._buildEbo = function () {
  // if our EBO doesn't exist yet, create one.
  if ( this._ebo == null )
    this._ebo = gl.createBuffer();
  // now, bind our buffer and pack it with our triangle array.
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._ebo );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, Int16Array(this.triangles), gl.STATIC_DRAW );
}

Mesh.prototype._destroyBuffers = function () {
  gl.deleteBuffer( this._vbo );
  gl.deleteBuffer( this._ebo );
}

Mesh.prototype.getVbo = function () {
  if ( this._vbo == null )
    console.error( "Attempting to access VBO of Mesh asset before it has been created.");
  return this._vbo;
}

Mesh.prototype.getEbo = function () {
  if ( this._ebo == null )
    console.error( "Attempting to access EBO of Mesh asset before it has been created.");
  return this._ebo;
}

Mesh.prototype.ready = function () {
  if (this._vbo == null) return false;
  if (this._ebo == null) return false;
  return true;
}
