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
    // vColour = uStateColour[index];

    vColour = vec4(new_position / (uGridSize/2.0), uStateColour[index].a);

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

uniform Light uLights[TOTAL_LIGHTS];

uniform float uAmbientStrength;
uniform float uDiffuseStrength;
uniform float uSpecularStrength;

uniform vec3 uViewPosition;
uniform float uSpecularPowerFactor;

void main() {
    if (vColour.a == 0.0) {
        discard;
    }

    vec3 total_lighting = vec3(0.0, 0.0, 0.0);

    vec3 normal = normalize(vNormal);
    {
        Light light = uLights[0];
        vec3 ambient = uAmbientStrength * light.colour;
        total_lighting += ambient;

        vec3 light_direction = normalize(light.position - vFragPos);
        float diff = max(dot(normal, light_direction), 0.0);
        vec3 diffuse = diff * uDiffuseStrength * light.colour;
        total_lighting += diffuse;
    }

    for (int i = 0; i < TOTAL_LIGHTS; i++) {
        Light light = uLights[i];
        vec3 light_direction = normalize(light.position - vFragPos);
        vec3 view_direction = normalize(uViewPosition - vFragPos);
        vec3 reflect_direction = reflect(-light_direction, normal);
        float spec = dot(view_direction, reflect_direction);
        spec = max(spec, 0.0);
        spec = pow(spec, uSpecularPowerFactor);
        vec3 specular = uSpecularStrength * spec * light.colour;

        total_lighting += specular;
    }

    total_lighting = total_lighting / float(TOTAL_LIGHTS);

    vec4 result = vec4(total_lighting, 1) * vColour; 

    fragColour = result;
}`
)};

export default {vertex: vertex, frag: frag};