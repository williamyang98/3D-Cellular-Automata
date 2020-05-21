function vertex(lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec3 position;
in float state;


uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uGridSize;
uniform vec4 uStateColour[${lut_size}];

out vec4 vColour;

void main() {
    int index = int(state);

    // vColour = uStateColour[index];
    vec3 colour = normalize(position / (uGridSize * 2.0));
    vColour = vec4(colour, uStateColour[index].a);

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(position, 1);
}`
)};

function frag() {
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;

out vec4 fragColour;

void main() {
    if (vColour.a == 0.0) {
        discard;
    }
    fragColour = vColour;
}`
)};

export default {vertex: vertex, frag: frag};