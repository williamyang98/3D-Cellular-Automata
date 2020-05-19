function vertex(lut_size) { 
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec3 position;
in vec3 normal;
in float state;


uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec4 uStateColour[${lut_size}];

out vec4 vColour;
out vec3 vFragPos;
out vec3 vNormal;

void main() {
    int index = int(state);
    vColour = uStateColour[index];

    mat4 MVP = uProjection * uView * uModel;
    gl_Position = MVP * vec4(position, 1);
    vFragPos = vec3(uModel * vec4(position, 1));

    vNormal = normal;
}`
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

    // total_lighting = total_lighting / float(TOTAL_LIGHTS);

    vec4 result = vec4(total_lighting, 1) * vColour; 

    fragColour = result;
    if (fragColour.a == 0.0) {
        discard;
    }
}`
)};

export default {vertex: vertex, frag: frag};