Renderer.prototype = new System();
Renderer.prototype.constructor = Renderer;
function Renderer () {
  this._renderables = new Array();
  this._cameras = new Array();
}

Renderer.prototype.tryRegisterComponent = function ( component ) {
  //checkTypes( [component], ["Component"] );
  switch ( typeOf(component) ) {
    case "Camera":
      this._cameras.push( component );
      break;
    case "Renderable":
      this._renderables.push( component );
      break;
    default:
      break;
  }
}


Renderer.prototype.update = function ( dt ) {
  // for every camera in the scene, bind our camera and prepare to render into it.
  for ( var camIndex = 0; camIndex < this._cameras.length; camIndex ++ ) {
    var camera = this._cameras[camIndex];
    camera.useCamera();
    var viewMat = Mat4.invert( camera.entity.getComponent("Transform").getMatrix() );
    var projectionMat = camera.getProjection();

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    // now, for every object in the scene,
    for ( var rendIndex = 0; rendIndex < this._renderables.length; rendIndex ++ ) {
      var renderable = this._renderables[rendIndex];

      // check that the object is complete.
      if ( renderable.material == null ) {
        console.warn( "Renderable component has no material assigned" );
        continue;
      }
      if ( renderable.material.ready() == false ) {
        console.warn( "Renderable component has no material assigned" );
        continue;
      }
      if ( renderable.mesh == null ) {
        console.warn( "Renderable component has no mesh assigned" );
        continue;
      }
      if ( renderable.mesh.ready() == false ) {
        console.warn( "Mesh provided to renderable component is not ready to be displayed." );
        continue;
      }

      var modelMat = renderable.entity.getComponent("Transform").getMatrix();
      var modelViewMat = Mat4.multiply( modelMat, viewMat );
      // bind the transformation uniforms necessary to render this object.
      renderable.material.properties[ "uModelViewMatrix" ] = modelViewMat;
      renderable.material.properties[ "uProjection" ] = projectionMat;
      renderable.material.properties[ "uNormalMatrix" ] = Mat4.transpose( Mat4.invert( modelViewMat ) );

      // bind the material asset for drawing (also sets uniforms)
      renderable.material.useMaterial();

      // bind the renderable object's vertex buffers
      gl.bindBuffer( gl.ARRAY_BUFFER, renderable.mesh.getVbo() );
      gl.vertexAttribPointer( renderable.material.shader.attributes["vPosition"], 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer( renderable.material.shader.attributes["vNormal"], 3, gl.FLOAT, true, 0, 4 * (renderable.mesh.positions.length)); // 4 bytes per float, 3 floats per vertex
      gl.vertexAttribPointer( renderable.material.shader.attributes["vTexcoord"], 2, gl.FLOAT, false, 0, 4 * (renderable.mesh.positions.length + renderable.mesh.normals.length) ); // 4 bytes per float, 3 floats per vertex

      gl.enableVertexAttribArray( renderable.material.shader.attributes["vPosition"] );
      gl.enableVertexAttribArray( renderable.material.shader.attributes["vNormal"] );
      gl.enableVertexAttribArray( renderable.material.shader.attributes["vTexcoord"] );

      // now bind the renderable object's index buffer, and draw.
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, renderable.mesh.getEbo() );
      gl.drawElements(gl.TRIANGLES, renderable.mesh.triangles.length, gl.UNSIGNED_SHORT, 0);
    }
  }

  // lastly, blit the camera to the screen. this is temporary, because I'm not sure where to put it :P
  camera.blitCamera( 200, 200 );
}
