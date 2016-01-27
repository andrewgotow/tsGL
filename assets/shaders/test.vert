#version 100
precision mediump float;

// Transform matrices. These are used to convert verts into the correct
// space before lighting and rendering.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjection;
uniform mat4 uNormalMatrix;

// Light data is passed through as a light matrix, in the following way.
/* Light Matrix
  r, 0, 0, x,
  g, 0, 0, y,
  b, 0, 0, z,
  i, 0, 0, r
*/
uniform mat4 uLightMatrix;

// main texture sampler.
uniform sampler2D uMainTex;
//uniform samplerCube uEnvTex;

// vertex attributes
attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexcoord;

// varying quantities passed by the vertex shader.
varying vec3 fNormal;
varying vec2 fTexcoord;
varying vec3 fPosition;
varying vec3 fLightDir; // the interpolated light direction for this fragment. (normalized)
varying float fLightAtten; // the attenuation of this light, used as a multiplier for brightness.

void main() {
  fNormal = (uNormalMatrix * vec4(vNormal,0)).xyz;
  fTexcoord = vTexcoord;
  fPosition = (uModelViewMatrix * vec4(vPosition,1.0)).xyz;

  vec3 lightPos = vec3( uLightMatrix[0][3], uLightMatrix[1][3], uLightMatrix[2][3] );
  fLightDir = lightPos - fPosition;
  float lightDist = length( fLightDir );

  fLightDir /= lightDist;
  fLightAtten = 1.0 / pow( 1.0 + lightDist / uLightMatrix[3][3], 2.0 );

  gl_Position = uProjection * uModelViewMatrix * vec4(vPosition,1.0);
}
