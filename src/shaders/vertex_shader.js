function create_vertex_shader(main, body='') {
return (
`#version 300 es

precision mediump float;
precision mediump sampler3D;
precision mediump sampler2D;
precision mediump int;

in vec3 position;
in vec3 normal;


uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uGridSize;
uniform int uScalingEnabled;

uniform sampler2D uStateColourTexture;
uniform sampler3D uStateTexture;

vec3 centre = vec3(0.5, 0.5, 0.5);

out vec4 vColour;
out vec3 vNormal;
out vec3 vFragPos;

vec3 calculate_position(float index) {
    float remain = float(gl_InstanceID);
    float z = floor(remain/(uGridSize.x*uGridSize.y));
    remain = remain - z*uGridSize.x*uGridSize.y;
    float y = floor(remain/uGridSize.x);
    float x = remain-y*uGridSize.x; 
    return vec3(x, y, z);
}

${body}

${main}
`
)};

const state_shading = create_vertex_shader(
`void main() {
    vec3 offset = calculate_position(float(gl_InstanceID));

    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    float index = result[0];

    float scale = max(index, float(1-uScalingEnabled));
    vec3 to_centre = centre-position;
    vec3 new_position = position + to_centre*(1.0-scale) + offset;

    vec4 state_colour =  texture(uStateColourTexture, vec2(index,0));
    vColour = state_colour; 
    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}`);

const xyz_shading = create_vertex_shader(
`void main() {
    vec3 offset = calculate_position(float(gl_InstanceID));

    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    float index = result[0];

    float scale = max(index, float(1-uScalingEnabled));
    vec3 to_centre = centre-position;
    vec3 new_position = position + to_centre*(1.0-scale) + offset;

    vec4 state_colour =  texture(uStateColourTexture, vec2(index,0));
    vec3 cube_colour = normalize(new_position / (uGridSize * 2.0));

    vColour = vec4(cube_colour, state_colour.a); 
    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}`);

const radius_shading = create_vertex_shader(
`void main() {
    vec3 offset = calculate_position(float(gl_InstanceID));

    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    float index = result[0];

    float scale = max(index, float(1-uScalingEnabled));
    vec3 to_centre = centre-position;
    vec3 new_position = position + to_centre*(1.0-scale) + offset;

    vec4 state_colour =  texture(uStateColourTexture, vec2(index,0));

    vec3 distance = new_position-uGridSize/2.0;
    float normalised_distance = length(distance/ (uGridSize/2.0));
    normalised_distance = clamp(normalised_distance, 0.0, 1.0);
    vec4 distance_colour = texture(uStateColourTexture, vec2(normalised_distance, 0));

    vColour = vec4(distance_colour.xyz, state_colour.a); 
    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}`);

const neighbour_shading = create_vertex_shader(
`void main() {
    vec3 offset = calculate_position(float(gl_InstanceID));

    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    float index = result[1];

    float scale = max(index, float(1-uScalingEnabled));
    vec3 to_centre = centre-position;
    vec3 new_position = position + to_centre*(1.0-scale) + offset;

    vec4 state_colour =  texture(uStateColourTexture, vec2(index,0));
    vColour = state_colour; 
    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}`);

const neighbour_and_alive_shading = create_vertex_shader(
`void main() {
    vec3 offset = calculate_position(float(gl_InstanceID));

    vec3 state_lookup = offset / uGridSize;
    vec4 result = texture(uStateTexture, state_lookup);
    float state = result[0];
    float neighbours = result[1];

    float scale = max(neighbours, float(1-uScalingEnabled));
    vec3 to_centre = centre-position;
    vec3 new_position = position + to_centre*(1.0-scale) + offset;

    vec4 state_colour =  texture(uStateColourTexture, vec2(state,0));
    vec4 neighbour_colour = texture(uStateColourTexture, vec2(neighbours, 0)); 
    vColour = vec4(neighbour_colour.xyz, state_colour.a*neighbour_colour.a); 
    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}`);

export const vertex_shader_src = {
    state: state_shading,
    xyz: xyz_shading,
    radius: radius_shading,
    neighbour: neighbour_shading,
    'neighbour and alive': neighbour_and_alive_shading,
};