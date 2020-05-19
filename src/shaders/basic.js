function vertex(vertex_count, lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec3 position;
in vec3 normal;
in float state;

uniform mat4 uMVP;
uniform vec4 uStateColour[${lut_size}];

uniform vec3 uLightColour;
uniform float uAmbientStrength;


out vec4 vColour;

void main() {
    int index = int(state);
    vec4 object_colour = uStateColour[index];
    vec3 ambient = uAmbientStrength * uLightColour;
    vColour = vec4(ambient, 1.0) * object_colour;

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