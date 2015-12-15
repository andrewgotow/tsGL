Cloth.prototype = new SceneNode();
Cloth.prototype.constructor=Cloth;
function Cloth ( width, height, resX, resY, shader ) {
  this.points = new Array();
  this.constraints = new Array();
  this.resolutionX = resX;
  this.resolutionY = resY;
  this.numIterations = 32;
  this.windSpeed = new Vec3( 1.0, 0, 0.0 );

  for ( y = 0; y < this.resolutionY; y ++) {
    for ( x = 0; x < this.resolutionX; x ++ ) {
      var p = new Particle( new Vec3( (x / this.resolutionX - 0.5) * width, -(y / this.resolutionY - 0.5) * height, 0 ) );

      if ( x > 0 )
        this.constraints.push( new Constraint( p, this.points[ y * this.resolutionX + (x-1) ] ) );
      if ( y > 0 )
        this.constraints.push( new Constraint( p, this.points[ (y-1) * this.resolutionX + x ] ) );
      /*
      if ( x > 0 && y > 0 )
        this.constraints.push( new Constraint( p, this.points[ (y-1) * this.resolutionX + (x-1) ] ) );
      if ( x < this.resolutionX-1 && y > 0 )
        this.constraints.push( new Constraint( p, this.points[ (y-1) * this.resolutionX + (x+1) ] ) );
      */
      this.points.push( p );
    }
  }

  this.points[0].active = false;
  //this.points[ Math.floor(this.resolutionX/2) ].active = false;
  this.points[ this.resolutionX-1 ].active = false;

  // allocate the parent class's mesh data
  this.data_vertices = new Float32Array( this.points.length * 3 * 2 );
  this.data_indices = new Int16Array( this.resolutionX * this.resolutionY * 6 );

  this._vbo = this._generateVbo();
  this._indexBuffer = this._generateIndexBuffer();
  this.shader = shader;
}

Cloth.prototype.buildVertexArray = function () {
  // set vertex positions for the vertices
  for ( i = 0; i < this.points.length; i ++ ) {
    this.data_vertices[ i * 6 + 0 ] = this.points[ i ].previousPosition.x;
    this.data_vertices[ i * 6 + 1 ] = this.points[ i ].previousPosition.y;
    this.data_vertices[ i * 6 + 2 ] = this.points[ i ].previousPosition.z;
  }

  // set vertex normals for the vertices.
  for ( y = 1; y < this.resolutionY; y ++) {
    for ( x = 1; x < this.resolutionX; x ++ ) {

      // squares of triangles are built like this.
      // 4 -- 3  // tri1: 1 2 3
      // |  / |  // tri2: 3 2 4
      // | /  |
      // 2 -- 1

      var i1 = y * this.resolutionX + x;
      var i2 = y * this.resolutionX + (x-1);
      var i3 = (y-1) * this.resolutionX + x;
      var i4 = (y-1) * this.resolutionX + (x-1);

      var v1 = this.points[ i1 ].previousPosition;
      var v2 = this.points[ i2 ].previousPosition;
      var v3 = this.points[ i3 ].previousPosition;
      var v4 = this.points[ i4 ].previousPosition;

      var n1 = Vec3.cross( v3.sub(v1), v2.sub(v1) );
      var n2 = Vec3.cross( v2.sub(v4), v3.sub(v4) );

      this.data_vertices[ i1 * 6 + 3 ] += n1.x;
      this.data_vertices[ i1 * 6 + 4 ] += n1.y;
      this.data_vertices[ i1 * 6 + 5 ] += n1.z;

      this.data_vertices[ i2 * 6 + 3 ] += n1.x;
      this.data_vertices[ i2 * 6 + 4 ] += n1.y;
      this.data_vertices[ i2 * 6 + 5 ] += n1.z;

      this.data_vertices[ i3 * 6 + 3 ] += n1.x;
      this.data_vertices[ i3 * 6 + 4 ] += n1.y;
      this.data_vertices[ i3 * 6 + 5 ] += n1.z;

      this.data_vertices[ i3 * 6 + 3 ] += n2.x;
      this.data_vertices[ i3 * 6 + 4 ] += n2.y;
      this.data_vertices[ i3 * 6 + 5 ] += n2.z;

      this.data_vertices[ i2 * 6 + 3 ] += n2.x;
      this.data_vertices[ i2 * 6 + 4 ] += n2.y;
      this.data_vertices[ i2 * 6 + 5 ] += n2.z;

      this.data_vertices[ i4 * 6 + 3 ] += n2.x;
      this.data_vertices[ i4 * 6 + 4 ] += n2.y;
      this.data_vertices[ i4 * 6 + 5 ] += n2.z;
    }
  }


  gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
  gl.bufferData( gl.ARRAY_BUFFER, this.data_vertices, gl.STATIC_DRAW );
}

var time = 0;
Cloth.prototype.step = function ( dt ) {
  // add wind
  // iterate through each triangle
  /*for ( i = 0; i < this.data_indices.length; i += 3 ) {
    var i0 = this.data_indices[ i + 0 ];
    var i1 = this.data_indices[ i + 1 ];
    var i2 = this.data_indices[ i + 2 ];

    // calculate the area of the triangle.
    var cross = Vec3.cross( this.points[i2].position.sub(this.points[i0].position), this.points[i1].position.sub(this.points[i0].position) );
    var normalTri = cross.normalized();

    var triVel = this.points[i0].velocity(dt).add( this.points[i1].velocity(dt) ).add( this.points[i2].velocity(dt) ).scale( 1 / 3 );
    var relativeVel = triVel.sub( this.windSpeed );

    var totalArea = 0.5 * cross.magnitude();
    if ( triVel.sqrMagnitude() > 0 ) {
      var effectiveArea = totalArea * Vec3.dot( relativeVel, normalTri ) / triVel.magnitude();
    }else{
      effectiveArea = 0;
    }
    var force = normalTri.scale( -0.5 * effectiveArea * triVel.sqrMagnitude() ).scale( 1/3 );
    this.points[ this.data_indices[ i + 0 ] ].accelerate( force.scale(dt) );
    this.points[ this.data_indices[ i + 1 ] ].accelerate( force.scale(dt) );
    this.points[ this.data_indices[ i + 2 ] ].accelerate( force.scale(dt) );
  }*/

  // update particles
  this.points.forEach( function (point, index, array) {
    point.simulate( dt );
    point.accelerate( new Vec3( 0, -9.81, 0 ) );
  });

  // resolve constraints
  for ( i = 0; i < this.numIterations; i ++ ) {
    this.constraints.forEach( function (constraint, index, array) {
      constraint.simulate( dt );
    });
  }

  this.buildVertexArray();
}


// This builds a VBO for our mesh. VBOs contain a chunk of data, and can be
// thought of as normal arrays, but stored in graphics memory, rather than
// CPU memory. This makes them much faster for repeated drawing.
Cloth.prototype._generateVbo = function () {
    var vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbo );
    gl.bufferData( gl.ARRAY_BUFFER, this.data_vertices, gl.STATIC_DRAW );
    return vbo;
}

Cloth.prototype._generateIndexBuffer = function () {
  var data = new Array();
  for ( y = 1; y < this.resolutionY; y ++) {
    for ( x = 1; x < this.resolutionX; x ++ ) {

      // squares of triangles are built like this.
      // 4 -- 3  // tri1: 1 2 3
      // |  / |  // tri2: 3 2 4
      // | /  |
      // 2 -- 1

      var i1 = y * this.resolutionX + x;
      var i2 = y * this.resolutionX + (x-1);
      var i3 = (y-1) * this.resolutionX + x;
      var i4 = (y-1) * this.resolutionX + (x-1);

      data.push( i1 );
      data.push( i2 );
      data.push( i3 );
      data.push( i3 );
      data.push( i2 );
      data.push( i4 );
    }
  }

  this.data_indices = new Int16Array( data );

  var vbo = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vbo );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.data_indices, gl.STATIC_DRAW );
  return vbo;
}

Cloth.prototype.draw = function ( viewMatrix, projection ) {
  this.shader.bindProgram();

  gl.uniformMatrix4fv( this.shader.in_mvMat, false, Mat4.multiply( this.getTransform(), viewMatrix ).data );
  gl.uniformMatrix4fv( this.shader.in_proj, false, projection.data );

  gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
  gl.vertexAttribPointer( this.shader.in_pos, 3, gl.FLOAT, false, 24, 0); // 4 bytes per float, 3 floats per vertex
  gl.vertexAttribPointer( this.shader.in_normal, 3, gl.FLOAT, true, 24, 12);

  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer );
  gl.drawElements(gl.TRIANGLES, this.data_indices.length, gl.UNSIGNED_SHORT, 0);

  //gl.drawArrays( gl.TRIANGLES, 0, this.data_vertices.length / 6 );
}
