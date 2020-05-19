function vertex(vertex_count, lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec3 position;
in float state;

uniform mat4 uMVP;
uniform vec4 uStateColour[${lut_size}];

out vec4 vColour;

void main() {
    int index = int(state);
    vColour = uStateColour[index];
    gl_Position = uMVP * vec4(position, 1);
}`
)};

function frag(vertex_count, lut_size) {
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;

out vec4 fragColour;

void main() {
    fragColour = vColour;
    if (fragColour.a == 0.0) {
        discard;
    }
}`
)};

export default {vertex: vertex, frag: frag};