#ifdef GL_ES
precision highp float;
#endif
uniform vec4 fragColor;
uniform vec4 baseColor;
uniform sampler2D Texture0;
varying vec2 FragTexCoord0;
void main(void) {
  vec4 color = texture2D( Texture0, FragTexCoord0.xy);
  float a = color[3];
  color = color*a;
  color[3]= a;
  gl_FragColor = (baseColor*color)*fragColor[0];
}