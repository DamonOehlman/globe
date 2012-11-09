#ifdef GL_ES
precision highp float;
#endif

attribute vec3 Vertex;
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;
uniform vec4 fragColor;

void main(void) {
    gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex,1.0);
}