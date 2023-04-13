import { compile_program } from "./compile_shader.js"
import { Uniform_Location_Cache } from "./uniform_location_cache.js";
import { mesh as square_mesh } from "./mesh/square.js";

class Clear_Volume {
    constructor(gl) {
        this.gl = gl;
        this.generate_mesh();
        this.programs = {};
        this.clear_colour = { r: 0, g: 0, b: 0, a: 0 };
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
            void main() {
                gl_Position = vec4(position.xy, 0.0, 1.0);
            } 
        `;

        let fragment_shader_src =
           `#version 300 es
            precision mediump float;
            out vec4 vFragColor[${depth}];
            uniform vec4 u_clear_colour;
            void main() {
                ${
                    Array(depth)
                        .fill(0)
                        .map((_,z) => `vFragColor[${z}] = u_clear_colour;`)
                        .join('\n')
                }
            }
        `;

        return compile_program(gl, vertex_shader_src, fragment_shader_src);
    }

    get_program = (depth) => {
        let key = depth;
        if (key in this.programs) {
            return this.programs[key];
        }

        let program = this.create_program(depth);
        let uniform_location_cache = new Uniform_Location_Cache(this.gl, program);
        let value = { program, uniform_location_cache };
        this.programs[key] = value;
        return value;
    }

    /**
     * @param {Volume_Data} volume
     */
    render = (volume) => {
        let gl = this.gl;
        let frame_buffers = volume.frame_buffers;
        let size = volume.size;

        let rgba_to_arr = (v) => [v.r,v.g,v.b,v.a];

        gl.viewport(0, 0, size.x, size.y);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        for (let frame_buffer of frame_buffers) {
            let { program, uniform_location_cache: loc } = this.get_program(frame_buffer.total_layers);

            gl.useProgram(program);
            gl.bindVertexArray(this.vao);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

            gl.uniform4f(loc.find("u_clear_colour"), ...rgba_to_arr(this.clear_colour));

            gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer.gl_id);
            gl.drawBuffers(frame_buffer.gl_layers);

            gl.clearColor(...rgba_to_arr(this.clear_colour));
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, this.mesh.index_data.length, gl.UNSIGNED_INT, 0);
        }
    }
}

export { Clear_Volume };