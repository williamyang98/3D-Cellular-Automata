import { Renderer } from "./Renderer";

import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../../gl/VertexBuffer';
import { Shader } from "../../gl/Shader";
import { IndexBuffer } from "../../gl/IndexBuffer";

import { Dropdown, Slider, Toggle } from "../../ui/AdjustableValues";
import { fragment_shader_src } from "../../shaders/fragment_shader";
import { vertex_shader_src } from "../../shaders/vertex_shader";
import { Uniform } from "../../gl/Uniform";

export class PointCloudRenderer extends Renderer {
    constructor(gl, props, params) {
        super(gl, props, params);
        this.add_params({
            point_type: new Dropdown(['quad', 'tri']),
            brightness: new Slider(0, 1, 1),
            occlusion: new Slider(0, 1, 0.65),
            scaling_enabled: new Toggle(0),
        });
        this.data = {
            quad: create_quad_data(gl),
            tri: create_triangle_data(gl),
        };
        this.create_shader();
        this.params.colouring.listen(colouring => {
            this.create_shader();
        });
    }

    create_shader() {
        let colour = this.params.colouring.current_option;
        let vert_src = vertex_shader_src[colour](true);
        let frag_src = fragment_shader_src.no_shading(true);
        this.shader = new Shader(this.gl, vert_src, frag_src);
        this.add_uniforms(this.shader);
    }

    add_uniforms(shader) {
        super.add_uniforms(shader);
        let gl = this.gl;
        shader.add_uniform("uBrightness", new Uniform(loc => gl.uniform1f(loc, this.params.brightness.value)));
        shader.add_uniform("uOcclusion", new Uniform(loc => gl.uniform1f(loc, this.params.occlusion.value)));
        shader.add_uniform("uScalingEnabled", new Uniform(loc => gl.uniform1i(loc, this.params.scaling_enabled.value)));
    }

    get current_data() {
        return this.data[this.params.point_type.current_option];
    }

    bind() {
        this.shader.bind();
        let data = this.current_data;
        data.vao.bind();
        data.ibo.bind();
    }

    on_render() {
        let gl = this.gl;
        let data = this.current_data;
        let size = this.props.size;
        let total_cells = size[0]*size[1]*size[2];
        gl.drawElementsInstanced(gl.TRIANGLES, data.ibo.count, gl.UNSIGNED_INT, data.index_data, total_cells); 
    }
}

// square for each point
const create_quad_data = (gl) => {
    let layout = new VertexBufferLayout(gl);
    layout.push_attribute(0, 3, gl.FLOAT, false);

    let vertex_data = new Float32Array([0, 1, 0.5,
                                        1, 1, 0.5,
                                        0, 0, 0.5,
                                        1, 0, 0.5]);
    let index_data = new Uint32Array([2, 1, 0, 2, 3, 1]);

    let vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
    let ibo = new IndexBuffer(gl, index_data);

    let vao = new VertexArrayObject(gl);
    vao.add_vertex_buffer(vbo, layout);
    return {vao: vao, ibo: ibo, index_data: index_data};
}

// triangle for each point
const create_triangle_data = (gl) => {
    let layout = new VertexBufferLayout(gl);
    layout.push_attribute(0, 3, gl.FLOAT, false);

    let vertex_data = new Float32Array([-0.5, -0.5, 0.5,
                                        1.5, -0.5, 0.5,
                                        0.5, -1.5, 0.5]);
    let index_data = new Uint32Array([2, 1, 0]);

    let vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
    let ibo = new IndexBuffer(gl, index_data);

    let vao = new VertexArrayObject(gl);
    vao.add_vertex_buffer(vbo, layout);
    return {vao: vao, ibo: ibo, index_data: index_data};
}