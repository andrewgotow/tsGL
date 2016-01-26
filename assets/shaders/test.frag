#version 100
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjection;
uniform mat4 uNormalMatrix;

uniform mat4 uLightMatrix;
/* Light Matrix
  r, 0, 0, x,
  g, 0, 0, y,
  b, 0, 0, z,
  i, 0, 0, r
*/

uniform sampler2D uMainTex;

varying vec3 fNormal;
varying vec2 fTexcoord;
varying vec3 fPosition;

void main() {
  vec4 lightColor = vec4( uLightMatrix[0][0], uLightMatrix[1][0], uLightMatrix[2][0], uLightMatrix[3][0] );
  vec3 lightPos = vec3( uLightMatrix[0][3], uLightMatrix[1][3], uLightMatrix[2][3] );
  vec3 lightDir = lightPos - fPosition;

  float atten = min( uLightMatrix[3][3] / length(lightDir), 1.0 );

  vec4 tex = texture2D( uMainTex, fTexcoord );
  float d = max( 0.0, dot( fNormal, normalize(lightDir) ) ) * atten;
  gl_FragColor = vec4( tex.rgb * lightColor.rgb * d, 1.0 );
}
