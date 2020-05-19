function vertex(vertex_count, lut_size) { 
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

function frag(vertex_count, lut_size) {
return (
`#version 300 es

precision mediump float;
precision mediump int;

in vec4 vColour;
in vec3 vFragPos;
in vec3 vNormal;

out vec4 fragColour;

uniform vec3 uLightPos;
uniform vec3 uLightColour;
uniform float uAmbientStrength;
uniform float uDiffuseStrength;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 light_direction = normalize(uLightPos - vFragPos);
    float diff = max(dot(normal, light_direction), 0.0);

    vec3 ambient = uAmbientStrength * uLightColour;
    vec3 diffuse = diff * uDiffuseStrength * uLightColour;

    vec3 combined = ambient + diffuse;
    vec4 result = vec4(combined, 1) * vColour; 

    fragColour = result;
    if (fragColour.a == 0.0) {
        discard;
    }
}`
)};

export default {vertex: vertex, frag: frag};