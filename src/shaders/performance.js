function vertex(lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump sampler3D;
precision mediump int;

in vec3 position;
in vec3 normal;


uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec3 uGridSize;
uniform vec4 uStateColour[${lut_size}];


uniform sampler3D uStateTexture;

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
    // vColour = vec4(1,1,1, uStateColour[index].a);

    // vColour = vec4(new_position / (uGridSize/2.0), uStateColour[index].a);

    vNormal = normal;
    vFragPos = vec3(uModel * vec4(new_position, 1));

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(new_position, 1);
}
`
)};

function frag(total_lights) {
return (
`#version 300 es

#define TOTAL_LIGHTS ${total_lights}

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

vec3 uSkyTop =  vec3( 0.1, 0.2, 0.8 ) * 0.5;
vec3 uSkyBottom = vec3( 0.5, 0.8, 1.0 ) * 1.5;
vec3 uSunColour = vec3(1.0, 1.2, 1.4);


float uFloorHeight = 0.0;
float uAmbientOcclusionStrength = 0.8;
float uAmbientOcclusionRange = 100.0;

float uSunStrength = 1.0;

vec4 uFogColour = vec4(1,1,1,1);
float uFogNear = 0.0;
float uFogFar = 0.3;
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
  	return mix(uSkyBottom, uSkyTop, sky_blend);
}

vec3 get_sky_colour(vec3 view_direction) {
    return mix(uSkyBottom, uSkyTop, max(view_direction.y, 0.0));
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
    if (vColour.a == 0.0) {
        discard;
    }

    vec3 normal = normalize(vNormal);

    vec3 ambient = uAmbientStrength * light.colour;

    vec3 light_direction = normalize(light.position - vFragPos);
    vec3 view_direction = normalize(uViewPosition - vFragPos);
    vec3 reflect_direction = reflect(-light_direction, normal);


    // float diff = dot(view_direction, reflect_direction);
    float diff = dot(light_direction, normal);
    diff = max(diff, 0.0);
    vec3 diffuse = diff * uDiffuseStrength * light.colour;

    float spec = dot(view_direction, reflect_direction);
    spec = clamp(spec + uSpecularScattering, 0.0, 1.0);
    spec = pow(spec, uSpecularPowerFactor);
    vec3 specular = uSpecularStrength * spec * light.colour;

    vec3 sky_lighting = get_sky_lighting(normal);
    vec3 sun_lighting = get_sun_lighting(normal);

    // vec3 total_lighting = ambient + diffuse + specular;
    vec3 total_lighting = specular + sky_lighting + sun_lighting;

    vec4 result = vec4(total_lighting, 1) * vColour; 
    // result = apply_ambient_occlusion(result, vFragPos);

    float distance = length(uViewPosition-vFragPos);
    result = apply_fog(result, distance);

    fragColour = result;
}`
)};

export default {vertex: vertex, frag: frag};