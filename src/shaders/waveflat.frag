#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D Texture0;
uniform vec4 fragColor;
uniform float scale;
varying float dotComputed;
varying vec2 TexCoordFragment;

void main(void) {
    vec4 color = texture2D( Texture0, TexCoordFragment.xy);
    gl_FragColor = fragColor * min(2.0*dotComputed * color.x, 0.999999);
}