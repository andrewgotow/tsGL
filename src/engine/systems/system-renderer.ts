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

      GL.context.clearColor( 0.2, 0.2, 0.2, 1.0 );
      GL.context.clear( GL.context.COLOR_BUFFER_BIT | GL.context.DEPTH_BUFFER_BIT );

      // now, for every object in the scene,
      for ( var rendIndex = 0; rendIndex < this._renderables.length; rendIndex ++ ) {
        this.drawRenderable( this._renderables[rendIndex], viewMat, projectionMat );
      }
    }

    // lastly, blit the camera to the screen. this is temporary, because I'm not sure where to put it :P
    //camera.blitCamera( 200, 200 );
  }

  private drawRenderable ( renderable : Renderable, viewMat : Mat4, projectionMat : Mat4 ) {
    // check that the object is complete.
    if ( renderable.material == null )
      return console.warn( "Renderable component has no material assigned" );
    if ( renderable.mesh == null )
      return console.warn( "Renderable component has no mesh assigned" );

    var modelMat = (<Transform>renderable.entity.getComponent("Transform")).getMatrix();
    var modelViewMat = Mat4.mul( modelMat, viewMat );

    // bind the transformation uniforms necessary to render this object.
    renderable.material.properties[ "uModelViewMatrix" ] = modelViewMat;
    renderable.material.properties[ "uProjection" ] = projectionMat;
    renderable.material.properties[ "uNormalMatrix" ] = Mat4.transpose( Mat4.invert( modelViewMat ) );
    renderable.material.properties[ "uLightMatrix" ] = Mat4.makeZero();
    // bind the material asset for drawing (also sets uniforms)
    renderable.material.useMaterial();

    // Bind the renderable's buffers.
    renderable.prepareForDrawing();

    GL.context.blendFunc( GL.context.SRC_ALPHA, GL.context.ONE_MINUS_SRC_ALPHA );
    GL.context.drawElements( GL.context.TRIANGLES, renderable.mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0 );
    GL.context.blendFunc( GL.context.SRC_ALPHA, GL.context.ONE );

    // sort the lights based on their calculated "importance"
    // TODO: This method of sorting may end up calculating importances multiple times.
    var lights = this._lights.sort( function (a : Light, b : Light ) : number {
      return a.importanceForEntity(renderable.entity) - b.importanceForEntity(renderable.entity);
    });
    // loop through each light, starting with the most important light, ending either on
    // the last light, or 3 lights. Whichever comes first.
    for ( var i = 0; i < Math.min( lights.length, 4 ); i ++ ) {
      renderable.material.properties[ "uLightMatrix" ] = lights[i].getMatrix();
      renderable.material.useMaterial();
      GL.context.drawElements( GL.context.TRIANGLES, renderable.mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0 );
    }

    GL.context.finish();
  }

}
