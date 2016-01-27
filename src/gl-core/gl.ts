class GL {

  static context : WebGLRenderingContext;

  static init( canvas: HTMLCanvasElement ) {

    try {
      // initialize our openGL context on the canvas
      GL.context = <WebGLRenderingContext>canvas.getContext("webgl");

      // now, enable and set up verything.
      GL.context.enable( GL.context.BLEND );
      GL.context.enable( GL.context.DEPTH_TEST );
      GL.context.depthFunc( GL.context.LEQUAL );

      GL.context.viewport( 0, 0, canvas.width, canvas.height );
    }
    catch(e) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }

  }

}
