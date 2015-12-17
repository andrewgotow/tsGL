#version 100
precision mediump float;

uniform mat4 uModelView;
uniform mat4 uProjection;

attribute vec3 vNormal;
attribute vec3 vPosition;
attribute vec2 vUV;

varying vec3 normal;

void main() {
  normal = vNormal;
  gl_Position = uProjection * uModelView * vec4(vPosition,1.0);
}
