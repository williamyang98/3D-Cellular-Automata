function vertex(lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump sampler3D;
precision mediump int;

in vec3 position;
// in vec3 normal;


uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uGridSize;
uniform vec4 uStateColour[${lut_size}];


uniform sampler3D uStateTexture;

out vec4 vColour;

vec3 calculate_position(float index) {
    float remain = float(gl_InstanceID);
    float z = floor(remain/(uGridSize.x*uGridSize.y));
    remain = remain - z*uGridSize.x*uGridSize.y;
    float y = floor(remain/uGridSize.x);
    float x = remain-y*uGridSize.x; 
    return vec3(x, y, z);
}

void main() {
    // int index = int(state);
    // vColour = uStateColour[index];

    vec3 offset = calculate_position(float(gl_InstanceID));
    vec3 new_position = position + offset;

    // vec3 colour = normalize(new_position / (uGridSize * 2.0));
    // vColour = vec4(colour, 1);
    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    int index = int(result[0] * 255.0);
    vColour = uStateColour[index];

    // vColour = result;

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}
`
)};

function frag() {
return (
`#version 300 es

precision mediump float;
precision mediump int;

// uniform sampler2D uStateTexture;

// in vec2 face_position;
in vec4 vColour;

out vec4 fragColour;

void main() {
    // vec4 state = texture(uStateTexture, face_position);
    // vec4 vColour = state;

    if (vColour.a == 0.0) {
        discard;
    }
    fragColour = vColour;
}`
)};

export default {vertex: vertex, frag: frag};