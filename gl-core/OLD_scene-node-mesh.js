Mesh.prototype = new SceneNode();
Mesh.prototype.constructor=Mesh;
function Mesh ( verts, shader ) {
  this.data_vertices = new Float32Array( verts );
  this._vbo = this._generateVbo();

  this.shader = shader;
}

// This builds a VBO for our mesh. VBOs contain a chunk of data, and can be
// thought of as normal arrays, but stored in graphics memory, rather than
// CPU memory. This makes them much faster for repeated drawing.
Mesh.prototype._generateVbo = function () {
    var vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbo );
    gl.bufferData( gl.ARRAY_BUFFER, this.data_vertices, gl.STATIC_DRAW );
    return vbo;
}

Mesh.prototype.draw = function ( viewMatrix, projection ) {
  this.shader.bindProgram();

  gl.uniformMatrix4fv( this.shader.in_mvMat, false, Mat4.multiply( this.getTransform(), viewMatrix ).data );
  gl.uniformMatrix4fv( this.shader.in_proj, false, projection.data );

  gl.vertexAttribPointer( this.shader.in_pos, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays( gl.TRIANGLES, 0, this.data_vertices.length / 3 );
}
