#version 100
precision mediump float;

uniform mat4 uModelView;
uniform mat4 uProjection;

varying vec3 normal;

void main() {
  //float dPow = abs( dot( normalize(normal), normalize(vec3( 1, 1, 1 )) ) );
  gl_FragColor = vec4( (normalize(normal)+1.0)*0.5, 1.0); //dPow * vec4(0.5,0.5,0.5,1.0);
}
