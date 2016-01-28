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

// varying quantities passed by the vertex shader.
varying vec3 fNormal;
varying vec2 fTexcoord;
varying vec3 fPosition;
varying vec3 fLightDir; // the interpolated light direction for this fragment. (normalized)
varying float fLightAtten; // the attenuation of this light, used as a multiplier for brightness.

void main() {
  vec4 lightColor = vec4( uLightMatrix[0][0], uLightMatrix[1][0], uLightMatrix[2][0], uLightMatrix[3][0] );

  vec4 tex = texture2D( uMainTex, fTexcoord );
  float diffuse = max( 0.0, dot( fNormal, fLightDir ) ) * fLightAtten;

  gl_FragColor = vec4( tex.rgb * lightColor.rgb * diffuse, 1.0 );
}
