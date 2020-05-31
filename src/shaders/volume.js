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

const frag_shader = (
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

out vec4 vFragColour;

void main() {
    vec3 view_direction = uViewPosition - vPosition;
    vec3 step_size = normalize(view_direction)/uGridSize;
    vec3 tex_coords = vTexturePosition;
    while (true) {
        vec4 cell = texture(uStateTexture, tex_coords);
        float state = cell[0];
        vec4 colour = texture(uStateColourTexture, vec2(state, 0.0));
        if (colour.a != 0.0) {
            vec3 distance = tex_coords - vec3(0.5, 0.5, 0.5);
            float radius = length(distance * uGridSize);
            float dist = mod(radius/10.0, 1.0); 
            vec4 dist_colour = texture(uRadiusColourTexture, vec2(dist, 0.0));
            vFragColour = dist_colour;
            return;
        }
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

export const volume_shader = {
    vert_src: vert_shader,
    frag_src: frag_shader,
};