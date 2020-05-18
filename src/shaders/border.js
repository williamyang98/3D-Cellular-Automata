const vertex = 
`
precision mediump float;

attribute vec3 position;

uniform mat4 uMVP;
uniform vec4 uColour;
uniform vec3 uOffset;

varying vec4 vColour;

void main() {
    vColour = uColour;
    gl_Position = uMVP * vec4(position + uOffset, 1);
}`;

const frag = 
`
precision mediump float;
varying vec4 vColour;

void main() {
    gl_FragColor = vColour;
}`;

export default {vertex: vertex, frag: frag};