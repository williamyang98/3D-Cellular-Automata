const vertex = 
`
precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uOffset;

void main() {
    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(position + uOffset, 1);
}`;

const frag = 
`
precision mediump float;

uniform vec4 uColour;

void main() {
    gl_FragColor = uColour;
}`;

export default {vertex: vertex, frag: frag};