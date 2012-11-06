#ifdef GL_ES
precision highp float;
#endif

uniform vec4 fragColor;
varying float height;
void main(void) {
      gl_FragColor = fragColor * height;
}