import { Renderer } from "./Renderer";

import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../../gl/VertexBuffer';
import { IndexBuffer } from "../../gl/IndexBuffer";
import { Shader } from "../../gl/Shader";
import { UniformMat4f, UniformVec3f, Uniform } from "../../gl/Uniform";
import { cube_optimized } from "../../gl/CubeData";
import { volume_shader } from "../../shaders/volume";

import { Toggle, Slider, Dropdown } from "../../ui/AdjustableValues";

export class VolumeRenderer extends Renderer {
    constructor(gl, props) {
        super(gl, props);
        [this.vao, this.ibo, this.index_data] = create_volume_data(gl);
        this.add_params({
            colouring: new Dropdown(Object.keys(volume_shader.frag_src)),
            occlusion: new Slider(0, 1, 0.65)
        });
        this.create_shader();
        this.params.colouring.listen(() => {
            this.create_shader();
        })
    }

    create_shader() {
        let colour = this.params.colouring.current_option;
        let vert_src = volume_shader.vert_src;
        let frag_src = volume_shader.frag_src[colour];
        this.shader = new Shader(this.gl, vert_src, frag_src);
        this.add_uniforms(this.shader);
    }

    add_uniforms(shader) {
        super.add_uniforms(shader);
        let gl = this.gl;
        shader.add_uniform("uOcclusion", new Uniform(loc => gl.uniform1f(loc, this.params.occlusion.value)));
    }

    bind() {
        this.shader.bind();
        this.vao.bind();
        this.ibo.bind();
    }

    on_render() {
        let gl = this.gl;
        gl.drawElements(gl.TRIANGLES, this.ibo.count, gl.UNSIGNED_INT, 0);
    }
}

const create_volume_data = (gl) => {
  let layout = new VertexBufferLayout(gl);
  layout.push_attribute(0, 3, gl.FLOAT, false);
  
  let vertex_data = cube_optimized.vertex_data(0, 1, 1, 0, 1, 0);
  let index_data = cube_optimized.index_data;

  let vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
  let ibo = new IndexBuffer(gl, index_data);

  let vao = new VertexArrayObject(gl);
  vao.add_vertex_buffer(vbo, layout);

  return [vao, ibo, index_data];
}