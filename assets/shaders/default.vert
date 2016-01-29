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
// Defines thrown in to make unpacking light values clearer.
#define lightColor vec4( uLightMatrix[0][0], uLightMatrix[1][0], uLightMatrix[2][0], 1.0 )
#define lightIntensity uLightMatrix[3][0]
#define lightPosition vec3( uLightMatrix[0][3], uLightMatrix[1][3], uLightMatrix[2][3] )
#define lightRange uLightMatrix[3][3]

// main texture sampler.
uniform sampler2D uMainTex;
uniform sampler2D uSmoothTex;
uniform samplerCube uEnvTex;

// vertex attributes
attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexcoord;

// varying quantities passed by the vertex shader.
varying vec3 fNormal;
varying vec2 fTexcoord;

varying vec3 fLightDir; // the interpolated light direction for this fragment. (normalized)
varying float fLightAtten; // the attenuation of this light, used as a multiplier for brightness

void main() {
  fNormal = (uNormalMatrix * vec4(vNormal,0.0)).xyz; // normal in view-space

  fTexcoord = vTexcoord;

  fLightDir = (uModelViewMatrix * vec4(lightPosition - vPosition, 1.0)).xyz; // in view-space.
  fLightAtten = 1.0 / pow( 1.0 + length( fLightDir ) / lightRange, 2.0 );
  fLightDir = normalize(fLightDir); // normalize the light direction while we're at it.

  gl_Position = uProjection * uModelViewMatrix * vec4(vPosition,1.0); // position in screen space
}
