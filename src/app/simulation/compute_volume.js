import { compile_program } from "./compile_shader.js"
import { Uniform_Location_Cache } from "./uniform_location_cache.js";
import { mesh as square_mesh } from "./mesh/square.js";

const Neighbourhood = {
    MOORE: 0,
    VON_NEUMANN: 1,
};

let is_valid_neighbourhood = (neighbourhood) => {
    return neighbourhood in Object.values(Neighbourhood);
}

let get_neighbourhood_size = (neighbourhood) => {
    switch (neighbourhood) {
    case Neighbourhood.MOORE:       return 26;
    case Neighbourhood.VON_NEUMANN: return 6;
    default:
        throw Error(`Invalid neighboorhood ${neighbourhood}`);
    }
}

let get_neighbourhood_name = (neighbourhood) => {
    switch (neighbourhood) {
    case Neighbourhood.MOORE:       return "Moore";
    case Neighbourhood.VON_NEUMANN: return "Von-Neumann";
    default:
        throw Error(`Invalid neighboorhood ${neighbourhood}`);
    }
}

class Rule {
    constructor() {
        this.alive_rule = null;     // Float32Array
        this.dead_rule = null;      // Float32Array
        this.total_states = null;   // Number
        this.neighbourhood = null;  // Neighbourhood
    }

    is_valid = () => {
        if (!is_valid_neighbourhood(this.neighbourhood)) {
            return false;
        }

        if (this.alive_rule === null || this.dead_rule === null) {
            return false;
        }

        let max_neighbours = get_neighbourhood_size(this.neighbourhood);
        if (this.alive_rule.length !== (max_neighbours+1)) {
            return false;
        }

        if (this.dead_rule.length !== (max_neighbours+1)) {
            return false;
        }

        return true;
    }
}

class Compute_Volume {
    constructor(gl) {
        this.gl = gl;
        this.generate_mesh();
        this.programs = {}
    }

    generate_mesh = () => {
        let gl = this.gl;

        let mesh = square_mesh;

        let vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertex_data, gl.STATIC_DRAW);

        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.index_data, gl.STATIC_DRAW);

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            let index = 0;
            let count = 2;
            let is_normalised = false; 
            let size = 4;
            let stride = count*size;
            let offset = 0;
            gl.vertexAttribPointer(index, count, gl.FLOAT, is_normalised, stride, offset);
            gl.enableVertexAttribArray(index);
        }

        this.mesh = mesh;
        this.ibo = ibo;
        this.vbo = vbo;
        this.vao = vao;
    }

    create_program = (depth, neighbourhood) => {
        let gl = this.gl;

        let max_neighbours = get_neighbourhood_size(neighbourhood);

        let vertex_shader_src =
           `#version 300 es
            precision mediump float;

            layout(location = 0) in vec2 position;
            out vec2 vPosition; // 0.0 to 1.0

            void main() {
                vPosition = (position+1.0)/2.0;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            } 
        `;

        let get_total_neighbours_src = {};
        get_total_neighbours_src[Neighbourhood.MOORE] = 
           `float get_total_neighbours(vec3 pos, vec3 step, float delta) {
                float sum = 0.0;
                sum += is_neighbour(vec3(pos.x + step.x, pos.y         , pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y         , pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y + step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y + step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y + step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y - step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y - step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y - step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y         , pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y         , pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y         , pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y + step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y + step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y + step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y - step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y - step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y - step.y, pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y         , pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y         , pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y         , pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y + step.y, pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y + step.y, pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y + step.y, pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y - step.y, pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x + step.x, pos.y - step.y, pos.z - step.z), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y - step.y, pos.z - step.z), delta);
                return sum;
            }
        `;

        get_total_neighbours_src[Neighbourhood.VON_NEUMANN] = 
           `float get_total_neighbours(vec3 pos, vec3 step, float delta) {
                float sum = 0.0;
                sum += is_neighbour(vec3(pos.x + step.x, pos.y         , pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x - step.x, pos.y         , pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y + step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y - step.y, pos.z         ), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y         , pos.z + step.z), delta);
                sum += is_neighbour(vec3(pos.x         , pos.y         , pos.z - step.z), delta);
                return sum;
            }
        `;

        let fragment_shader_src =
           `#version 300 es
            precision mediump float;
            precision highp sampler3D;

            in vec2 vPosition; // 0.0 to 1.0
            out vec4 vFragColor[${depth}];

            // volume data format is:
            // R = 0 or 255 => 0.0 or 1.0
            // G = NONE
            // B = NONE
            // A = NONE
            uniform sampler3D volume_in;   
            uniform int z_offset;
            uniform ivec3 size;
            uniform float total_states;     // refractory period after death (>= 2)
            uniform float alive_rule[${max_neighbours+1}];   // if alive and !alive_rule[i] then die
            uniform float dead_rule[${max_neighbours+1}];    // if dead  and  dead_rule[i] then alive

            float get_state(vec3 pos) {
                return texture(volume_in, pos).x;
            }

            bool is_alive(float state, float delta) {
                return state > (1.0 - delta/2.0);
            }

            bool is_dead(float state, float delta) {
                return state < delta/2.0;
            }

            float get_next_state(float state, int total_neighbours, float delta) {
                if (is_alive(state, delta)) {
                    float is_stay_alive = alive_rule[total_neighbours];
                    float is_die = 1.0 - is_stay_alive;
                    float next_state = max(1.0 - is_die*delta, 0.0);
                    return next_state;
                } 
                
                if (is_dead(state, delta)) {
                    float is_turn_alive = dead_rule[total_neighbours];
                    float next_state = is_turn_alive;
                    return next_state;
                }

                float next_state = max(state - delta, 0.0);
                return next_state;
            }

            float is_neighbour(vec3 pos, float delta) {
                float state = get_state(pos);
                return is_alive(state, delta) ? 1.0 : 0.0;
            }

            // Get neighbourhood
            ${get_total_neighbours_src[neighbourhood]}

            vec4 process_layer(int z_, vec3 step, float delta) {
                int z = z_ + z_offset;
                float z_norm = float(z) / float(size.z);
                vec3 pos = vec3(vPosition.xy, z_norm);

                float state = get_state(pos);
                int total_neighbours = int(get_total_neighbours(pos, step, delta));
                float next_state = get_next_state(state, total_neighbours, delta);

                const int max_total_neighbours = ${max_neighbours};
                float norm_total_neighbours = float(total_neighbours) / float(max_total_neighbours);

                return vec4(next_state, norm_total_neighbours, 0.0, 0.0);
            }

            void main() {
                vec3 step = vec3(1.0)/vec3(size);
                float delta = 1.0 / (total_states-1.0);

                ${
                    Array(depth)
                        .fill(0)
                        .map((_,z) => `vFragColor[${z}] = process_layer(${z}, step, delta);`)
                        .join('\n')
                }
            }
        `;

        return compile_program(gl, vertex_shader_src, fragment_shader_src);
    }

    get_program = (depth, neighbourhood) => {
        if (!is_valid_neighbourhood(neighbourhood)) {
            throw Error(`Invalid neighbourhood ${neighbourhood}`);
        }

        let key = `${depth}-${neighbourhood}`;
        if (key in this.programs) {
            return this.programs[key];
        }

        let program = this.create_program(depth, neighbourhood);
        let uniform_location_cache = new Uniform_Location_Cache(this.gl, program);
        let value = { program, uniform_location_cache };
        this.programs[key] = value;
        return value;
    }

    /**
     * Compute single step of cellular automata on 3D volume data
     * @param {Volume_Data} volume_in 
     * @param {Volume_Data} volume_out 
     * @param {Rule} rule 
     */
    render = (volume_in, volume_out, rule) => {
        let gl = this.gl;

        if ((volume_in.size.x !== volume_in.size.x) ||
            (volume_in.size.y !== volume_in.size.y) ||
            (volume_in.size.z !== volume_in.size.z)
        ) {
            throw Error(`Compute volumes have mismatching sizes: ${volume_in.size} != ${volume_out.size}`);
        }

        if (!rule.is_valid()) {
            throw Error(`Got invalid rule: ${rule}`);
        }

        volume_in.set_wrap(true);
        volume_out.set_wrap(true);
        let size = volume_in.size;
        let texture = volume_in.texture;
        let frame_buffers = volume_out.frame_buffers;

        gl.viewport(0, 0, size.x, size.y);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        let texture_slot = 0;
        gl.activeTexture(gl.TEXTURE0+texture_slot);
        gl.bindTexture(gl.TEXTURE_3D, texture);

        for (let frame_buffer of frame_buffers) {
            let { program, uniform_location_cache: loc } = this.get_program(frame_buffer.total_layers, rule.neighbourhood);

            gl.useProgram(program);
            gl.bindVertexArray(this.vao);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

            gl.uniform1i(loc.find("volume_in"), texture_slot);
            gl.uniform1i(loc.find("z_offset"), frame_buffer.z_offset);
            gl.uniform3i(loc.find("size"), size.x, size.y, size.z);
            gl.uniform1f(loc.find("total_states"), rule.total_states);
            gl.uniform1fv(loc.find("alive_rule"), rule.alive_rule, 0, rule.alive_rule.length);
            gl.uniform1fv(loc.find("dead_rule"), rule.dead_rule, 0, rule.dead_rule.length);

            gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer.gl_id);
            gl.drawBuffers(frame_buffer.gl_layers);
            gl.drawElements(gl.TRIANGLES, this.mesh.index_data.length, gl.UNSIGNED_INT, 0);
        }
    }

}

export { 
    Compute_Volume, 
    Rule, 
    Neighbourhood, 
    get_neighbourhood_name, get_neighbourhood_size, is_valid_neighbourhood 
};