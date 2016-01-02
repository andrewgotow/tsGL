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
      //camera.useCamera();
      var viewMat = Mat4.invert( (<Transform>camera.entity.getComponent("Transform")).getMatrix() );
      var projectionMat = camera.getProjection();

      GL.context.clearColor( 0.5, 0.5, 0.5, 1.0 );
      GL.context.clear( GL.context.COLOR_BUFFER_BIT | GL.context.DEPTH_BUFFER_BIT );

      // now, for every object in the scene,
      for ( var rendIndex = 0; rendIndex < this._renderables.length; rendIndex ++ ) {
        var renderable = this._renderables[rendIndex];

        // check that the object is complete.
        /*if ( renderable.material == null ) {
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
        */

        var modelMat = (<Transform>renderable.entity.getComponent("Transform")).getMatrix();
        var modelViewMat = Mat4.mul( modelMat, viewMat );
        // bind the transformation uniforms necessary to render this object.
        renderable.material.properties[ "uModelViewMatrix" ] = modelViewMat;
        renderable.material.properties[ "uProjection" ] = projectionMat;
        renderable.material.properties[ "uNormalMatrix" ] = Mat4.transpose( Mat4.invert( modelViewMat ) );

        // bind the material asset for drawing (also sets uniforms)
        renderable.material.useMaterial();

        // bind the renderable object's vertex buffers
        GL.context.bindBuffer( GL.context.ARRAY_BUFFER, renderable.mesh.getVbo() );
        GL.context.vertexAttribPointer( renderable.material.shader.attributes["vPosition"], 3, GL.context.FLOAT, false, 0, 0);
        GL.context.vertexAttribPointer( renderable.material.shader.attributes["vNormal"], 3, GL.context.FLOAT, true, 0, 4 * (renderable.mesh.positions.length)); // 4 bytes per float, 3 floats per vertex
        GL.context.vertexAttribPointer( renderable.material.shader.attributes["vTexcoord"], 2, GL.context.FLOAT, false, 0, 4 * (renderable.mesh.positions.length + renderable.mesh.normals.length) ); // 4 bytes per float, 3 floats per vertex

        GL.context.enableVertexAttribArray( renderable.material.shader.attributes["vPosition"] );
        GL.context.enableVertexAttribArray( renderable.material.shader.attributes["vNormal"] );
        GL.context.enableVertexAttribArray( renderable.material.shader.attributes["vTexcoord"] );

        // now bind the renderable object's index buffer, and draw.
        GL.context.bindBuffer( GL.context.ELEMENT_ARRAY_BUFFER, renderable.mesh.getEbo() );
        /*
        // sort the lights based on their calculated "importance"
        // TODO: This method of sorting may end up calculating importances multiple times.
        var lights = this._lights.sort( function (a : Light, b : Light ) : number {
          return a.importanceForEntity(renderable.entity) - b.importanceForEntity(renderable.entity);
        });
        // loop through each light, starting with the most important light, ending either on
        // the last light, or 3 lights. Whichever comes first.
        for ( var l = 0; l < lights.length && l < 3; l ++ ) {

        }
        */
        GL.context.drawElements( GL.context.TRIANGLES, renderable.mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0 );
      }
    }

    // lastly, blit the camera to the screen. this is temporary, because I'm not sure where to put it :P
    //camera.blitCamera( 200, 200 );
  }

}
