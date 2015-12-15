var glHelpers = {

  // this function loads a GLSL shader from the content of a DOM element.
  // define a <script> with a type of "x-shader/x-fragment" or "x-shader/x-vertex",
  // and use its id attribute to reference it.
  getShaderProgramFromDom: function (id) {
    var script = document.getElementById(id);
    if (!script) {
      return null;
    }

    var source = script.text;

    var shader;
    if (script.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (script.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null; // Unknown shader type
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
  }

}
