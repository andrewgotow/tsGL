class GL {

  static context : WebGLRenderingContext;

  static init( canvas: HTMLCanvasElement ) {

    try {
      GL.context = <WebGLRenderingContext>canvas.getContext("webgl");
    }
    catch(e) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    if (GL.context) {
      GL.context.enable( GL.context.DEPTH_TEST );
      GL.context.depthFunc( GL.context.LEQUAL );
      GL.context.viewport( 0, 0, canvas.width, canvas.height );
    }
  }

}
