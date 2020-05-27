const basic_shading = (point_cloud) =>
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;
in vec3 vFragPos;
in vec3 vNormal;

out vec4 fragColour;

struct Light {
    vec3 position;
    vec3 colour;
};

uniform Light light;

uniform vec3 uViewPosition;
uniform float uSpecularPowerFactor;
float uSpecularScattering = 0.1;

// vec3 uSkyTop =  vec3( 0.1, 0.2, 0.8 ) * 0.5;
// vec3 uSkyBottom = vec3( 0.5, 0.8, 1.0 ) * 1.5;
// vec3 uSunColour = vec3(1.0, 1.2, 1.4);

vec3 uSkyTop =  vec3( 0.8, 0.8, 0.8 ) * 0.5;
vec3 uSkyBottom = vec3( 0.8, 0.8, 0.8 ) * 1.5;
vec3 uSunColour = vec3(1.0, 1.0, 1.0);


float uFloorHeight = 0.0;
float uAmbientOcclusionStrength = 0.8;
float uAmbientOcclusionRange = 100.0;

uniform float uSkyStrength;
uniform float uSunStrength;

vec4 uFogColour = vec4(1,1,1,1);
uniform float uFogNear;
uniform float uFogFar;
float uFogRange = 1000.0;

vec3 get_sun_direction() {
    return normalize(vec3(20.0, 40.3, -10.4));
}

vec3 get_sun_lighting(const vec3 normal) {
    vec3 light_direction = -get_sun_direction();
    float angle = max(dot(normal, -light_direction), 0.0);
    return uSunColour * uSunStrength * angle;
}

vec3 get_sky_lighting(const vec3 normal) {
    float sky_blend = normal.y * 0.5 + 0.5;
    vec3 sky_light = mix(uSkyBottom, uSkyTop, sky_blend);
    return sky_light * uSkyStrength;  
}

vec3 get_sky_colour(vec3 view_direction) {
    vec3 sky_colour = mix(uSkyBottom, uSkyTop, max(view_direction.y, 0.0));
    return sky_colour * uSkyStrength;
}

vec4 apply_ambient_occlusion(const vec4 colour, const vec3 position) {
    float height = (position.y - uFloorHeight) / uAmbientOcclusionRange;
    height = abs(height);
    float occlusion = mix(1.0, 1.0-uAmbientOcclusionStrength, clamp(0.0, 1.0, height));
    return vec4(colour.xyz * occlusion, colour.a);
}

vec4 apply_fog(const vec4 colour, float distance) {
    float norm_distance = distance / uFogRange;
    float fog_strength = clamp(norm_distance, uFogNear, uFogFar);
    return mix(colour, uFogColour, fog_strength);
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 view_direction = normalize(uViewPosition - vFragPos);

    vec3 sky_lighting = get_sky_lighting(normal);
    vec3 sky_colour = get_sky_colour(view_direction);
    vec3 sun_lighting = get_sun_lighting(normal);
    vec3 total_lighting = sky_lighting + sun_lighting + sky_colour;

    vec4 result = vec4(total_lighting, 1) * vColour; 
    // result = apply_ambient_occlusion(result, vFragPos);

    float distance = length(uViewPosition-vFragPos);
    result = apply_fog(result, distance);

    fragColour = result;
}`;

const basic_shading_alternate = (point_cloud) =>
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;
in vec3 vFragPos;
in vec3 vNormal;

out vec4 fragColour;

struct Light {
    vec3 position;
    vec3 colour;
};

uniform Light light;

uniform float uAmbientStrength;
uniform float uDiffuseStrength;
uniform float uSpecularStrength;

uniform vec3 uViewPosition;
uniform float uSpecularPowerFactor;
float uSpecularScattering = 0.1;

void main() {
    vec3 normal = normalize(vNormal);

    vec3 ambient = uAmbientStrength * light.colour;

    vec3 light_position = vec3(-uViewPosition.x, uViewPosition.y, -uViewPosition.z);
    vec3 light_direction = normalize(light_position - vFragPos);

    float diff = max(dot(normal, light_direction), 0.0);
    vec3 diffuse = diff * uDiffuseStrength * light.colour;

    vec3 view_direction = normalize(uViewPosition - vFragPos);
    vec3 reflect_direction = reflect(-light_direction, normal);
    float spec = dot(view_direction, reflect_direction);
    spec = clamp(spec + uSpecularScattering, 0.0, 1.0);
    spec = pow(spec, uSpecularPowerFactor);
    vec3 specular = uSpecularStrength * spec * light.colour;
    
    vec3 total_lighting = (ambient + diffuse + specular) * vColour.xyz;
    vec4 result = vec4(total_lighting, 1.0);

    fragColour = result;
}`;

const create_no_shader = (point_cloud) => (
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;
${point_cloud ? '' : 'in vec3 vNormal;'}
${point_cloud ? '' : 'in vec3 vFragPos;'}

out vec4 fragColour;

void main() {
    fragColour = vColour;
}`);

export const fragment_shader_src = {
    basic: {create: basic_shading, point_cloud: false},
    basic_alternate: {create: basic_shading_alternate, point_cloud: false},
    no_shading: {create: create_no_shader, point_cloud: true}
}