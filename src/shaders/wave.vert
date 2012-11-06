#ifdef GL_ES
precision highp float;
#endif

attribute vec3 Vertex;
attribute vec3 TexCoord0;
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 NormalMatrix;
uniform float scale;
uniform sampler2D Texture0;
varying float height;

float maxHeight = 1400000.0;
void main(void) {
    vec4 color = texture2D( Texture0, TexCoord0.xy);
    height = color[0];
    vec3 normal = normalize(Vertex);
    vec3 normalTransformed = vec3(NormalMatrix * vec4(normal,0.0));
    float dotComputed = dot(normalTransformed, vec3(0,0,1));
    height *= max(0.0, dotComputed);
    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex +  normal * ( height * maxHeight * scale),1.0);
    height *= 5.0 * scale;
}