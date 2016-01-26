
class Mesh extends Asset {
  positions : Float32Array;
  normals : Float32Array;
  texcoords : Float32Array;
  triangles : Int32Array;
  _vbo : WebGLBuffer; // vertex buffer object
  _ebo : WebGLBuffer; // element buffer object (used for triangles)

  constructor () {
    super()

    this._vbo = null;
    this._ebo = null;
  }

  static fromFile ( url: string ): Mesh {
    var mesh = new Mesh();

    // import a file.
    loadFile( url, url, function ( text, url ) {
      var tmp_positions = new Array();
      var tmp_normals = new Array();
      var tmp_texcoords = new Array();

      var match : RegExpMatchArray;

      // this regular expression matches vertex definitions in an OBJ file. "v 0.1 -0.5, 4.0"
      var vertRe = /v (-?[\d\.]+) (-?[\d\.]+) (-?[\d\.]+)/g
      do {
          match = vertRe.exec(text);
          if (match) tmp_positions.push( Number(match[1]), Number(match[2]), Number(match[3]) );
      } while (match);

      // now do the same, but this time, match normals "vn 0.1 -0.5, 4.0"
      var normRe = /vn (-?[\d\.]+) (-?[\d\.]+) (-?[\d\.]+)/g
      do {
          match = normRe.exec(text);
          if (match) tmp_normals.push( Number(match[1]), Number(match[2]), Number(match[3]) );
      } while (match);

      // and match UVs "vt 0.5, 1.0"
      var texRe = /vt (-?[\d\.]+) (-?[\d\.]+)/g
      do {
          match = texRe.exec(text);
          if (match) tmp_texcoords.push( Number(match[1]), 1.0 - Number(match[2]) );
      } while (match);

      // now, OBJs will re-use normal and uv data to save on file size. We need
      // to expand that into a single data set, so start parsing triangles, and build
      // the real vertex data out from there.
      var assembledPositions = new Array();
      var assembledNormals = new Array();
      var assembledTexcoords = new Array();
      var assembledElements = new Array();

      // The OBJ file format allows independent indices for each vertex attributes, I.E.
      // a vert can be made of position 1, tex coord 7, and normal 3. This is not possible
      // in OpenGL. To get around this, build a map, where the key is "vertIndex-normalIndex-uvIndex",
      // and whose value is the index in our newly "reconstructed" arrays. If a vertex has already
      // been referenced, we can safely re-use it, and add it into the openGL buffer. Otherwise, we'll
      // need to add the index to the openGL index buffer independently.
      var vertexIndexMap = {};
      var uniqueVertexCount = 0;

      var triRe = /f (\d+)\/(\d+)\/(\d+) (\d+)\/(\d+)\/(\d+) (\d+)\/(\d+)\/(\d+)/g
      do {
          match = triRe.exec(text);
          if (match) {
            // for each vertex in the OBJ triangle.
            for ( var vert = 0; vert < 3; vert ++ ) {
              // get the vertex, normal, and texcoord OBJ index for this triangle's vertex.
              var vi = Number(match[vert*3+1])-1;
              var ti = Number(match[vert*3+2])-1;
              var ni = Number(match[vert*3+3])-1;
              var key = vi + "-" + ni + "-" + ti;
              // now check our vertex index map for the ky.
              if ( !(key in vertexIndexMap) ) {
                // otherwise, construct a new vertex, and insert it into the map.
                assembledPositions.push( tmp_positions[vi*3+0], tmp_positions[vi*3+1], tmp_positions[vi*3+2] );
                assembledNormals.push( tmp_normals[ni*3+0], tmp_normals[ni*3+1], tmp_normals[ni*3+2] );
                assembledTexcoords.push( tmp_texcoords[ti*2+0], tmp_texcoords[ti*2+1] );
                // add it to the vertex index map in case it's used again.
                vertexIndexMap[key] = uniqueVertexCount++;
              }
              assembledElements.push( vertexIndexMap[key] );
            }
          }
      } while (match);

      // now, we've got our reassembled data. Copy it into our main buffers, and we should be good to go!
      mesh.positions = new Float32Array( assembledPositions );
      mesh.normals = new Float32Array( assembledNormals );
      mesh.texcoords = new Float32Array( assembledTexcoords );
      mesh.triangles = new Int16Array( assembledElements );

      //console.log( "Finished importing mesh \"" + url + "\"");

      mesh._buildVbo();
      mesh._buildEbo();
      mesh.onReady();
    }, function ( url: string ) {
      console.error( "Could not download Mesh file, \"" + url + "\"" );
    });

    // return our mesh object immediately. It may not be complete yet, but we
    // need an immediate handle. Set the OnLoad callback if you need to know exactly
    // when an asset is ready.
    return mesh;
  }

  private _buildVbo () {
    // if our buffer doesn't exist, create one
    if ( this._vbo == null )
      this._vbo = GL.context.createBuffer();
    // then bind our new buffer, and allocate memory equal to the size of all our
    // data (floats are 4 bytes).
    GL.context.bindBuffer( GL.context.ARRAY_BUFFER, this._vbo );
    GL.context.bufferData( GL.context.ARRAY_BUFFER, 4 * (this.positions.length + this.normals.length + this.texcoords.length), GL.context.STATIC_DRAW );
    // then, copy our vertex data into chunks of the buffer. Attributes are sequential. |VVVNNNUUU|
    GL.context.bufferSubData( GL.context.ARRAY_BUFFER, 0, this.positions );
    GL.context.bufferSubData( GL.context.ARRAY_BUFFER, 4 * this.positions.length, this.normals );
    GL.context.bufferSubData( GL.context.ARRAY_BUFFER, 4 * (this.positions.length + this.normals.length), this.texcoords );
  }

  private _buildEbo () {
    // if our EBO doesn't exist yet, create one.
    if ( this._ebo == null )
      this._ebo = GL.context.createBuffer();
    // now, bind our buffer and pack it with our triangle array.
    GL.context.bindBuffer( GL.context.ELEMENT_ARRAY_BUFFER, this._ebo );
    GL.context.bufferData( GL.context.ELEMENT_ARRAY_BUFFER, this.triangles, GL.context.STATIC_DRAW );
  }

  private _destroyBuffers () {
    GL.context.deleteBuffer( this._vbo );
    GL.context.deleteBuffer( this._ebo );
  }

  getVbo () : WebGLBuffer {
    if ( this._vbo == null )
      console.error( "Attempting to access VBO of Mesh asset before it has been created.");
    return this._vbo;
  }

  getEbo () : WebGLBuffer {
    if ( this._ebo == null )
      console.error( "Attempting to access EBO of Mesh asset before it has been created.");
    return this._ebo;
  }

}
/*
Mesh.prototype.ready = function () {
  if (this._vbo == null) return false;
  if (this._ebo == null) return false;
  return true;
}
*/
