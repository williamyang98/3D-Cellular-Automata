const vertex = 
`
precision mediump float;

attribute vec3 position;
attribute vec4 colour;

uniform mat4 uMVP;
uniform vec3 uGridSize;

varying vec4 vColour;

void main() {
    vColour = colour;
    gl_Position = uMVP * vec4(position, 1);
}`;

const frag = 
`
precision mediump float;
varying vec4 vColour;

void main() {
    gl_FragColor = vColour;
    if (gl_FragColor.a == 0.0) {
        discard;
    }
}`;

export default {vertex: vertex, frag: frag};