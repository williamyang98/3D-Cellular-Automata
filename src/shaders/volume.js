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

out vec3 vPosition;
out vec3 vTexturePosition;

void main() {
    mat4 MVP = uProjection * uView * uModel;
    vec3 vertex_pos = position * uGridSize;
    vec4 pos = MVP * vec4(vertex_pos, 1.0);
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

uniform vec3 uGridSize;
uniform vec3 uViewPosition;

uniform sampler3D uStateTexture;
uniform sampler2D uStateColourTexture;
uniform sampler2D uRadiusColourTexture;

uniform float uOcclusion;

out vec4 vFragColour;

void main() {
    vec3 view_direction = uViewPosition - vPosition;
    vec3 step_size = normalize(view_direction)/uGridSize;
    vec3 tex_coords = vTexturePosition;
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