class Renderer extends System {
  private _renderables : Renderable[];
  private _cameras : Camera[];
  private _lights : Light[];

  constructor () {
    super();
    this._renderables = [];
    this._cameras = [];
    this._lights = [];
  }

  tryRegisterComponent ( component : Component ) : boolean {
    if ( component instanceof Camera ) {
      this._cameras.push( <Camera>component );
      return true;
    }else if ( component instanceof Renderable ) {
      this._renderables.push( <Renderable>component );
      return true;
    }else if ( component instanceof Light ) {
      this._lights.push( <Light>component );
      return true;
    }
    return false;
  }

  update ( deltaTime : number ) {
    // for every camera in the scene, bind our camera and prepare to render into it.
    for ( var camIndex = 0; camIndex < this._cameras.length; camIndex ++ ) {
      var camera = this._cameras[camIndex];

      var viewMat = Mat4.invert( (<Transform>camera.entity.getComponent("Transform")).getMatrix() );
      var projectionMat = camera.getProjection();

      GL.context.clearColor( 0.1, 0.1, 0.1, 0.0 );
      GL.context.clear( GL.context.COLOR_BUFFER_BIT | GL.context.DEPTH_BUFFER_BIT );

      // now, for every object in the scene,
      for ( var rendIndex = 0; rendIndex < this._renderables.length; rendIndex ++ ) {
        //try {
          this._drawRenderable( this._renderables[rendIndex], viewMat, projectionMat );
        //}catch(e) {
        //  console.warn( "Failed to draw renderable entity." );
        //}
      }
    }

    GL.context.flush();
  }

  private _drawRenderable ( renderable : Renderable, viewMat : Mat4, projectionMat : Mat4 ) {
    var mesh = renderable.mesh;
    var material = renderable.material;

    // make sure both our mesh and material work.
    if ( !mesh.ready || !material.ready ) {
      console.warn( "Renderable is not ready for display, but you are drawing it anyway." );
      return;
    }

    // calculate the model matrix, and the view matrix.
    var modelMat = (<Transform>renderable.entity.getComponent("Transform")).getMatrix();
    var modelViewMat = Mat4.mul( modelMat, viewMat );

    // bind the transformation uniforms necessary to render this object.
    material.properties[ "uModelViewMatrix" ] = modelViewMat;
    material.properties[ "uProjection" ] = projectionMat;
    material.properties[ "uNormalMatrix" ] = Mat4.transpose( Mat4.invert( modelViewMat ) );
    material.properties[ "uLightMatrix" ] = Mat4.makeZero();

    // bind the material asset for drawing (also sets uniforms)
    renderable.material.useMaterial();

    // Bind the renderable's buffers.
    GL.context.bindBuffer( GL.context.ARRAY_BUFFER, mesh.getVbo() );
    GL.context.vertexAttribPointer( material.shader.attributes["vPosition"], 3, GL.context.FLOAT, false, 0, 0);
    GL.context.vertexAttribPointer( material.shader.attributes["vNormal"], 3, GL.context.FLOAT, true, 0, 4 * (mesh.positions.length)); // 4 bytes per float, 3 floats per vertex
    GL.context.vertexAttribPointer( material.shader.attributes["vTexcoord"], 2, GL.context.FLOAT, false, 0, 4 * (mesh.positions.length + mesh.normals.length) ); // 4 bytes per float, 3 floats per vertex

    // now bind the renderable object's index buffer, and draw.
    GL.context.bindBuffer( GL.context.ELEMENT_ARRAY_BUFFER, mesh.getEbo() );

    // set our blend mode to opaque, and draw the unlit base pass.
    GL.context.blendFunc( GL.context.SRC_ALPHA, GL.context.ONE_MINUS_SRC_ALPHA );
    GL.context.drawElements( GL.context.TRIANGLES, mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0 );

    // now set our blend mode to additive, and begin to apply our lighting in multiple passes.
    GL.context.blendFunc( GL.context.SRC_ALPHA, GL.context.ONE );

    // sort the lights based on their calculated "importance"
    var lights = this._lights.sort( function (a : Light, b : Light ) : number {
      return a.importanceForEntity(renderable.entity) - b.importanceForEntity(renderable.entity);
    });

    // loop through each light, starting with the most important light, ending either on
    // the last light, or 4 lights. Whichever comes first.
    for ( var i = 0; i < Math.min( lights.length, 4 ); i ++ ) {
      material.shader.setUniform( "uLightMatrix", lights[i].getMatrix() );
      GL.context.drawElements( GL.context.TRIANGLES, mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0 );
    }
  }

}
