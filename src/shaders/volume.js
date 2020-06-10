const vert_shader = (
`#version 300 es

precision highp sampler3D;
precision highp sampler2D;
precision highp float;

in vec3 position;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uGridSize;
uniform vec3 uViewPosition;

out vec3 vPosition;
out vec3 vTexturePosition;
out vec3 vNormViewPosition;
out float vInside;

void main() {
    mat4 MVP = uProjection * uView * uModel;
    vec3 vertex_pos = position * uGridSize;
    vec4 pos = MVP * vec4(vertex_pos, 1.0);
    // camera centered around (0,0,0)
    // box has size uGridSize
    vec3 camera_box = abs(uViewPosition);
    vec3 volume_box = abs(uGridSize)/2.0;
    if (camera_box.x < volume_box.x && camera_box.y < volume_box.y && camera_box.z < volume_box.z) {
        vInside = -1.0;
    } else {
        vInside = 1.0;
    }
    vNormViewPosition = (-uViewPosition / (uGridSize/2.0) + vec3(1.0,1.0,1.0))/2.0;
    // consider -60, -70, 80
    // center is 0, 0, 0
    // normalised with box 100, 100, 100 this is
    // -0.6 -0.7 0.8
    // to get a mapping 0 to 1
    // consider convert -1.0 to 1.0 to 0.0 to 1.0
    // add 1.0 and divide by 2

    vPosition = (uModel * vec4(vertex_pos, 1.0)).xyz;
    vTexturePosition = position;
    gl_Position = pos;
}
`
);

const create_frag_shader = (colouring) => (
`#version 300 es

precision highp sampler3D;
precision highp sampler2D;
precision highp float;

in vec3 vPosition;
in vec3 vTexturePosition;
in vec3 vNormViewPosition;
in float vInside;

uniform vec3 uGridSize;
uniform vec3 uViewPosition;

uniform sampler3D uStateTexture;
uniform sampler2D uStateColourTexture;
uniform sampler2D uRadiusColourTexture;

uniform float uOcclusion;
uniform float uStepFactor;

out vec4 vFragColour;

void main() {
    vec3 view_direction = uViewPosition - vPosition;
    vec3 step_size = normalize(view_direction);
    // vec3 resize = abs(step_size);
    // step_size /= max(resize.x, max(resize.y, resize.z));
    step_size = step_size / uGridSize * uStepFactor * vInside;

    // outside then vInside=1.0, start=1.0, vInside=-1, start=0.0
    float start = (vInside+1.0)/2.0;
    vec3 tex_coords = vTexturePosition*start + vNormViewPosition*(1.0-start);
    while (true) {
        vec4 cell = texture(uStateTexture, tex_coords);
        float state = cell[0];
        float neighbours = cell[1];
        float lighting = 1.0-neighbours*uOcclusion;
        vec4 state_colour = texture(uStateColourTexture, vec2(state, 0.0));
        vec4 neighbour_colour = texture(uStateColourTexture, vec2(neighbours, 0.0));
        ${colouring}
        tex_coords -= step_size;
        if (tex_coords.x < 0.0 || tex_coords.x > 1.0 || 
            tex_coords.y < 0.0 || tex_coords.y > 1.0 ||
            tex_coords.z < 0.0 || tex_coords.z > 1.0) 
        {
            break;
        }
    }
    vFragColour = vec4(0, 0, 0, 0);
}
`
);

const state_colouring = create_frag_shader(
`if (state_colour.a != 0.0) {
    vFragColour = vec4(state_colour.xyz*lighting, state_colour.a);
    return;
}
`
);

const xyz_colouring = create_frag_shader(
`if (state_colour.a != 0.0) {
    vFragColour = vec4(tex_coords*lighting, state_colour.a);
    return;
}
`
);

const layer_colouring = create_frag_shader(
`if (state_colour.a != 0.0) {
    vec3 distance = tex_coords - vec3(0.5, 0.5, 0.5);
    float radius = length(distance * uGridSize);
    float dist = mod(radius/10.0, 1.0); 
    vec4 dist_colour = texture(uRadiusColourTexture, vec2(dist, 0.0));
    vFragColour = vec4(dist_colour.xyz*lighting, state_colour.a);
    return;
}
`
);

const radius_colouring = create_frag_shader(
`if (state_colour.a != 0.0) {
    vec3 distance = tex_coords - vec3(0.5, 0.5, 0.5);
    float radius = length(distance * uGridSize);
    float dist = length(distance) * 2.0;
    vec4 dist_colour = texture(uRadiusColourTexture, vec2(dist, 0.0));
    vFragColour = vec4(dist_colour.xyz*lighting, state_colour.a);
    return;
}
`
);

const neighbour_colouring = create_frag_shader(
`if (neighbour_colour.a != 0.0) {
    vFragColour = vec4(neighbour_colour.xyz*lighting, neighbour_colour.a);
    return;
}
`
);

const neighbour_and_alive_colouring = create_frag_shader(
`float alpha = state_colour.a * neighbour_colour.a;
if (alpha != 0.0) {
    vFragColour = vec4(neighbour_colour.xyz*lighting, alpha);
    return;
}
`
);


export const volume_shader = {
    vert_src: vert_shader,
    frag_src: {
        state: state_colouring,
        xyz: xyz_colouring, 
        layer: layer_colouring,
        radius: radius_colouring,
        neighbour: neighbour_colouring,
        neighbour_and_alive: neighbour_and_alive_colouring,
    },
};