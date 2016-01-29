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

// varying quantities passed by the vertex shader.
varying vec3 fNormal;
varying vec2 fTexcoord;
varying vec3 fLightDir; // the interpolated light direction for this fragment. (normalized)
varying float fLightAtten; // the attenuation of this light, used as a multiplier for brightness.

varying vec3 fReflectionDir; // the view-space reflection vector for this surface.

void main() {
  vec4 tex = texture2D( uMainTex, fTexcoord );
  vec4 env = textureCube( uEnvTex, fReflectionDir );
  vec4 smoothness = texture2D( uSmoothTex, fTexcoord );

  float diffuse = max( 0.0, dot( fNormal, fLightDir ) ) * fLightAtten;
  vec3 litColor = tex.rgb * lightColor.rgb * diffuse;

  // This does a straight lerp between the normal color, and the reflected color,
  // based on a "shininess" variable. I'm using a step function on the light intensity,
  // so that only the unlit base pass will have the added reflections, and all future lighting
  // passes won't add it again.
  gl_FragColor = vec4( mix( litColor, env.rgb, step( lightIntensity, 0.0) * smoothness.r ), 1.0 );
}
