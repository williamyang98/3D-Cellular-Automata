const vertex = 
`
precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 uMVP;
uniform vec3 uOffset;

void main() {
    gl_Position = uMVP * vec4(position + uOffset, 1);
}`;

const frag = 
`
precision mediump float;

uniform vec4 uColour;

void main() {
    gl_FragColor = uColour;
}`;

export default {vertex: vertex, frag: frag};