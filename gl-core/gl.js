var gl = null; // A global variable for the WebGL context

// initialize webGL on our canvas. This is called in the document "OnLoad" block,
// and should build the openGL context.
function webGLStart () {
  var canvas = document.getElementById( "glcanvas" );

  gl = initWebGL(canvas);

  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.TEXTURE_2D);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

function initWebGL(canvas) {
  var gl = null;

  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;
}
