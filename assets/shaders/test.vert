#version 100
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjection;
uniform mat4 uNormalMatrix;
uniform mat4 uLightMatrix;

uniform sampler2D uMainTex;

attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexcoord;

varying vec3 fNormal;
varying vec2 fTexcoord;
varying vec3 fPosition;

void main() {
  fNormal = (uNormalMatrix * vec4(vNormal,0)).xyz;
  fTexcoord = vTexcoord;
  fPosition = (uModelViewMatrix * vec4(vPosition,1.0)).xyz;

  gl_Position = uProjection * uModelViewMatrix * vec4(vPosition,1.0);
}
