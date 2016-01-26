
class Renderable extends Component {
  material : Material;
  mesh : Mesh;

  constructor () {
    super();
    this.material = null;
    this.mesh = null;
  }

  prepareForDrawing () {
    // bind the renderable object's vertex buffers
    GL.context.bindBuffer( GL.context.ARRAY_BUFFER, this.mesh.getVbo() );
    GL.context.vertexAttribPointer( this.material.shader.attributes["vPosition"], 3, GL.context.FLOAT, false, 0, 0);
    GL.context.vertexAttribPointer( this.material.shader.attributes["vNormal"], 3, GL.context.FLOAT, true, 0, 4 * (this.mesh.positions.length)); // 4 bytes per float, 3 floats per vertex
    GL.context.vertexAttribPointer( this.material.shader.attributes["vTexcoord"], 2, GL.context.FLOAT, false, 0, 4 * (this.mesh.positions.length + this.mesh.normals.length) ); // 4 bytes per float, 3 floats per vertex

    GL.context.enableVertexAttribArray( this.material.shader.attributes["vPosition"] );
    GL.context.enableVertexAttribArray( this.material.shader.attributes["vNormal"] );
    GL.context.enableVertexAttribArray( this.material.shader.attributes["vTexcoord"] );

    // now bind the renderable object's index buffer, and draw.
    GL.context.bindBuffer( GL.context.ELEMENT_ARRAY_BUFFER, this.mesh.getEbo() );
  }

}
