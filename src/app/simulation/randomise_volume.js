import { compile_program } from "./compile_shader.js"
import { Uniform_Location_Cache } from "./uniform_location_cache.js";
import { mesh as square_mesh } from "./mesh/square.js";

class Randomise_Volume_Params {
    constructor() {
        this.density = 0.5;
        this.region = {
            x: 1,
            y: 1,
            z: 1 
        }
    }
}

class Randomise_Volume {
    constructor(gl) {
        this.gl = gl;
        this.generate_mesh();
        this.programs = {};
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

    create_program = (depth) => {
        let gl = this.gl;

        let vertex_shader_src =
           `#version 300 es
            precision mediump float;

            layout(location = 0) in vec2 position;
            out vec2 vPosition;
            uniform vec3 u_region;

            void main() {
                vPosition = position;
                gl_Position = vec4(position.xy*u_region.xy, 0.0, 1.0);
            } 
        `;

        let fragment_shader_src =
           `#version 300 es
            precision mediump float;
            precision highp sampler3D;

            in vec2 vPosition;
            out vec4 vFragColor[${depth}];

            uniform float u_density;
            uniform vec3 u_region; // Fill radius with 0...1 per dimension
            uniform float u_external_rand;
            uniform ivec3 u_size;
            uniform int u_z_offset;

            float rand(vec3 co){
                const vec3 rand_vec = vec3(12.9898, 78.233, 3.2345);
                float a = dot(co, rand_vec) * u_external_rand;
                float b = sin(a);
                float c = b * 43758.5453;
                return fract(c);
            }

            bool is_within_region(float z_norm) {
                // Convert 0...1 fill radius to 0...1 texture coordinate
                float z0 = 2.0*z_norm - 1.0;    // 0...1 to -1...+1
                float z1 = u_region.z;          // 0...1

                // Get distance from origin
                z0 = abs(z0);              
                return z0 <= z1;
            }

            vec4 process_layer(int z_) {
                int z = z_ + u_z_offset;
                float z_norm = float(z) / float(u_size.z); 

                // NOTE: We do this do prevent an off by one error
                //       This occurs since the range (0...N-1) gets mapped to (0...N)
                z_norm += 0.5/float(u_size.z);

                if (!is_within_region(z_norm)) {
                    return vec4(0);
                }

                vec3 pos = vec3(vPosition.xy, z_norm);
                float value = rand(pos);
                value = (value < u_density) ? 1.0 : 0.0;
                return vec4(value);
            }

            void main() {
                ${
                    Array(depth)
                        .fill(0)
                        .map((_,z) => `vFragColor[${z}] = process_layer(${z});`)
                        .join('\n')
                }
            }
        `;

        return compile_program(gl, vertex_shader_src, fragment_shader_src);
    }

    get_program = (depth) => {
        if (depth in this.programs) {
            return this.programs[depth];
        }

        let program = this.create_program(depth);
        let uniform_location_cache = new Uniform_Location_Cache(this.gl, program);
        let value = { program, uniform_location_cache };
        this.programs[depth] = value;
        return value;
    }

    // Pad the randomiser region by a quarter the grid resolution to guarantee fill
    pad_region = (region, grid_size) => {
        let res = [grid_size.x, grid_size.y, grid_size.z];
        res = res.map((v) => 1.0/v);

        let pad = [region.x, region.y, region.z];
        const pad_ratio = 0.01;
        pad = pad.map((v,i) => v + res[i] * pad_ratio);
        return pad;
    }


    /**
     * @param {Volume_Data} volume_in
     * @param {Randomise_Volume_Params} params
     */
    render = (volume_in, params) => {
        let gl = this.gl;

        volume_in.set_wrap(false);
        let size = volume_in.size;
        let frame_buffers = volume_in.frame_buffers;

        let padded_region = this.pad_region(params.region, size);

        gl.viewport(0, 0, size.x, size.y);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        // NOTE: Enable basic blending for randomised fields to overlap
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        for (let frame_buffer of frame_buffers) {
            let { program, uniform_location_cache: loc } = this.get_program(frame_buffer.total_layers);

            gl.useProgram(program);
            gl.bindVertexArray(this.vao);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

            gl.uniform1f(loc.find("u_density"), params.density);
            gl.uniform3f(loc.find("u_region"), ...padded_region);
            gl.uniform1f(loc.find("u_external_rand"), Math.random());
            gl.uniform3i(loc.find("u_size"), size.x, size.y, size.z);
            gl.uniform1i(loc.find("u_z_offset"), frame_buffer.z_offset);

            gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer.gl_id);
            gl.drawBuffers(frame_buffer.gl_layers);
            gl.drawElements(gl.TRIANGLES, this.mesh.index_data.length, gl.UNSIGNED_INT, 0);
        }
    }
}

export { Randomise_Volume, Randomise_Volume_Params };