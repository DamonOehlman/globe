#ifdef GL_ES
precision highp float;
#endif
attribute vec3 Vertex;
attribute vec3 TexCoord0;
uniform mat4 ModelViewMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 NormalMatrix;
varying float dotComputed;
varying vec2 TexCoordFragment;
void main(void) {
  TexCoordFragment = TexCoord0.xy;
  vec3 normal = normalize(Vertex);
  vec3 normalTransformed = vec3(NormalMatrix * vec4(normal,0.0));
  dotComputed = max(0.0, dot(normalTransformed, vec3(0,0,1)));
  if (dotComputed > 0.001) {
     dotComputed = 1.0;
  }
  gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1);
}