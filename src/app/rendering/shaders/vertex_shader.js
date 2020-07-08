const calculate_offset = (
`vec3 calculate_offset(int index) {
    float remain = float(index);
    float z = floor(remain/(uGridSize.x*uGridSize.y));
    remain = remain - z*uGridSize.x*uGridSize.y;
    float y = floor(remain/uGridSize.x);
    float x = remain - y*uGridSize.x; 
    return vec3(x, y, z);
}`);

const calculate_point_cloud = (
`mat3 Rx(float a) {
    return mat3(
        1., 0., 0.,
        0., cos(a), sin(a),
        0., -sin(a), cos(a)
    );
}

mat3 Ry(float a) {
    return mat3(
        cos(a), 0., -sin(a),
        0, 1., 0.,
        sin(a), 0., cos(a)
    );
}

vec3 calculate_point_cloud(const vec3 pos, const vec3 offset) {
    vec3 point_position = offset+uCenter-(uGridSize/2.0);
    vec3 view_direction = uViewPosition-point_position;
    vec2 xz = vec2(view_direction.x, view_direction.z);
    float r = length(xz);
    float ay = atan(view_direction.x, view_direction.z);
    float ax = -atan(view_direction.y, r);
    mat3 R = Ry(ay) * Rx(ax);
    return R*(pos-uCenter) + uCenter + offset; 
}`
);

const get_cell_data = (
`
vec4 get_cell_data(vec3 offset) {
    vec3 vol_tex_coords = offset / uGridSize;
    vec4 cell = texture(uStateTexture, vol_tex_coords);
    return cell;
}
`
);

const calculate_scaling = (
`
vec3 scale_position(float scale, vec3 pos) {
    float K = max(scale, float(1-uScalingEnabled));
    vec3 delta = pos-uCenter;
    return uCenter + (K*delta);
}
`
);

const inline_imports = (
`
${calculate_offset}
${calculate_scaling}
${calculate_point_cloud}
${get_cell_data}
`
);

const create_inline_snippet = (point_cloud) => (
`
// get basic info about cell
vec3 offset = calculate_offset(gl_InstanceID);
vec4 cell = get_cell_data(offset);
float state = cell[0];
float neighbours = cell[1];
float lighting = 1.0-(neighbours*uOcclusion);
vec4 state_colour =  texture(uStateColourTexture, vec2(state,0));
`
);

const create_inline_header = (point_cloud) => (
`#version 300 es

precision highp float;
precision highp sampler3D;
precision highp sampler2D;
precision highp int;

in vec3 position;
${point_cloud ? '' : 'in vec3 normal;'}

// MVP
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uViewPosition;
uniform vec3 uGridSize;
// params
uniform int uScalingEnabled;
uniform float uOcclusion;
// texturing
uniform sampler2D uStateColourTexture;
uniform sampler2D uRadiusColourTexture;
uniform sampler3D uStateTexture;

vec3 uCenter = vec3(0.5, 0.5, 0.5);

out vec4 vColour;
${point_cloud ? '' : 'out vec3 vNormal;'}
${point_cloud ? '' : 'out vec3 vFragPos;'}

${inline_imports}
`
)

const create_inline_footer = (point_cloud) => (
`
${point_cloud ? 
    'vPosition = calculate_point_cloud(vPosition, offset);' : 
    'vPosition = vPosition + offset;'}

// pass through data
vPosition *= vColour.a;
mat4 MVP = uProjection * uView * uModel;
${point_cloud ? '' : 'vNormal = normal;'}
${point_cloud ? '' : 'vFragPos = vec3(uModel * vec4(vPosition, 1.0));'}
gl_Position = MVP * vec4(vPosition, 1.0);
`
);

const create_state_shader = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec3 vPosition = scale_position(state, position);
    vColour = vec4(state_colour.xyz*lighting, state_colour.a);
    ${create_inline_footer(point_cloud)}
}`);

const create_xyz_shading = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec3 vPosition = scale_position(state, position);
    vec3 xyz_colour = offset / uGridSize;
    vColour = vec4(xyz_colour*lighting, state_colour.a);
    ${create_inline_footer(point_cloud)}
}
`);

const create_layer_shading = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec3 vPosition = scale_position(state, position);
    vec3 distance = offset - (uGridSize/2.0);
    float dist = length(distance/10.0);
    dist = mod(dist, 1.0);
    vec4 dist_colour = texture(uRadiusColourTexture, vec2(dist, 0.0));
    vColour = vec4(dist_colour.xyz*lighting, state_colour.a);
    ${create_inline_footer(point_cloud)}
}`);

const create_radius_shading = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec3 xyz_center = uGridSize/2.0;
    vec3 distance = offset-xyz_center;
    float radius = length(distance/xyz_center);
    float total_repeats = 1.0;
    radius = clamp(radius, 0.0, 1.0) * total_repeats;
    vec4 radius_colour = texture(uRadiusColourTexture, vec2(radius, 0.0));

    vec3 vPosition = scale_position(state, position);
    vColour = vec4(radius_colour.xyz*lighting, state_colour.a);
    ${create_inline_footer(point_cloud)}
}`);

const create_neighbour_shading = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec4 neighbour_colour = texture(uStateColourTexture, vec2(neighbours, 0.0));

    vec3 vPosition = scale_position(neighbours, position);
    vColour = vec4(neighbour_colour.xyz*lighting, neighbour_colour.a);
    ${create_inline_footer(point_cloud)}
}`);

const create_neighbour_and_alive_shading = (point_cloud) => (
`${create_inline_header(point_cloud)}
void main() {
    ${create_inline_snippet(point_cloud)}
    vec4 neighbour_colour = texture(uStateColourTexture, vec2(neighbours, 0.0));

    vec3 vPosition = scale_position(neighbours, position);
    vColour = vec4(neighbour_colour.xyz*lighting, state_colour.a*neighbour_colour.a);
    ${create_inline_footer(point_cloud)}
}`);


export const vertex_shader_src = {
    state: create_state_shader,
    xyz: create_xyz_shading,
    layer: create_layer_shading,
    radius: create_radius_shading,
    neighbour: create_neighbour_shading,
    neighbour_and_alive: create_neighbour_and_alive_shading,
};