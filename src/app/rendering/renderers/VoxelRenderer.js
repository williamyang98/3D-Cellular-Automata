import { Renderer } from "./Renderer";

import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../../../gl/VertexBuffer';
import { Shader } from "../../../gl/Shader";
import { UniformMat4f, UniformVec3f, Uniform } from "../../../gl/Uniform";
import { IndexBuffer } from "../../../gl/IndexBuffer";
import { cube } from "../../../gl/CubeData";

import { Toggle, Slider, Dropdown } from "../../../ui/AdjustableValues";
import { fragment_shader_src } from "../shaders/fragment_shader";
import { vertex_shader_src } from "../shaders/vertex_shader";

import { vec3 } from "gl-matrix";


export class VoxelRenderer extends Renderer {
    constructor(gl, props, params) {
        super(gl, props, {});
        this.shading_params = {
            ambient_strength: new Slider(0, 1, 0.4),
            diffuse_strength: new Slider(0, 1, 0.95),
            specular_strength: new Slider(0, 1, 0.6),
            specular_power_factor: new Slider(0, 128.0, 4.0),
            scaling_enabled: new Toggle(0),
            fog_near: new Slider(0, 1, 0),
            fog_far: new Slider(0, 1, 0),
            sun_strength: new Slider(0, 1, 0.95),
            sky_strength: new Slider(0, 1, 0.25),
            brightness: new Slider(0, 1, 1.0),
            occlusion: new Slider(0, 1, 0.0),
        };

        this.global_params = {
            ...params,
            shading: new Dropdown(Object.keys(fragment_shader_src)),
        };

        this.shading_keys = {
          basic: ['occlusion', 'sun_strength', 'sky_strength', 'fog_near', 'fog_far', 'scaling_enabled'],
          basic_alternate: ['occlusion', 'ambient_strength', 'diffuse_strength', 'specular_strength', 'specular_power_factor', 'scaling_enabled'],
          no_shading: ['occlusion', 'brightness', 'scaling_enabled']
        };

        this.update_props({
            light_position: vec3.create()
        });
        [this.vao, this.ibo, this.index_data] = create_cube_data(gl);
        this.create_shader();
        this.params.colouring.listen(() => this.create_shader());
        this.params.shading.listen(() => this.create_shader());
    }

    create_shader() {
        this.load_params();
        let colour = this.global_params.colouring.current_option;
        let shading = this.global_params.shading.current_option;
        let vert_src = vertex_shader_src[colour](false);
        let frag_src = fragment_shader_src[shading](false);
        this.shader = new Shader(this.gl, vert_src, frag_src);
        this.add_uniforms(this.shader);
    }

    // depending on shading type, we get different parameters to configure
    load_params() {
        let params = {};
        let shading = this.global_params.shading.current_option;
        let keys = this.shading_keys[shading];
        for (let key of keys) {
            params[key] = this.shading_params[key];
        }
        this.params = {...this.global_params, ...params};
    }

    add_uniforms(shader) {
        super.add_uniforms(shader);
        let gl = this.gl;
        // lighting
        shader.add_uniform('light.position', new UniformVec3f(gl, this.props.light_position));
        shader.add_uniform('light.colour', new UniformVec3f(gl, vec3.fromValues(1,1,1)));
        // // lighting params
        shader.add_uniform("uAmbientStrength", new Uniform(loc => gl.uniform1f(loc, this.params.ambient_strength.value)));
        shader.add_uniform("uDiffuseStrength", new Uniform(loc => gl.uniform1f(loc, this.params.diffuse_strength.value)));
        shader.add_uniform("uSpecularStrength", new Uniform(loc => gl.uniform1f(loc, this.params.specular_strength.value)));
        shader.add_uniform("uSpecularPowerFactor", new Uniform(loc => gl.uniform1f(loc, this.params.specular_power_factor.value)));
        shader.add_uniform("uBrightness", new Uniform(loc => gl.uniform1f(loc, this.params.brightness.value)));
        shader.add_uniform("uOcclusion", new Uniform(loc => gl.uniform1f(loc, this.params.occlusion.value)));
        // post processing
        shader.add_uniform("uScalingEnabled", new Uniform(loc => gl.uniform1i(loc, this.params.scaling_enabled.value)));
        shader.add_uniform("uFogNear", new Uniform(loc => gl.uniform1f(loc, this.params.fog_near.value)));
        shader.add_uniform("uFogFar", new Uniform(loc => gl.uniform1f(loc, this.params.fog_far.value)));
        shader.add_uniform("uSunStrength", new Uniform(loc => gl.uniform1f(loc, this.params.sun_strength.value)));
        shader.add_uniform("uSkyStrength", new Uniform(loc => gl.uniform1f(loc, this.params.sky_strength.value)));
    }

    bind() {
        this.shader.bind();
        this.vao.bind();
        this.ibo.bind();
    }

    on_render() {
        let gl = this.gl;
        let size = this.props.size;
        let total_cells = size[0]*size[1]*size[2];
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.drawElementsInstanced(gl.TRIANGLES, this.ibo.count, gl.UNSIGNED_INT, this.index_data, total_cells); 
    }
}

const create_cube_data = (gl) => {
  let layout = new VertexBufferLayout(gl);
  layout.push_attribute(0, 3, gl.FLOAT, false);
  layout.push_attribute(1, 3, gl.FLOAT, false);

  let vertex_data = cube.vertex_data(0, 1, 1, 0, 1, 0);
  let index_data = cube.index_data;

  let vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
  let ibo = new IndexBuffer(gl, index_data);

  let vao = new VertexArrayObject(gl);
  vao.add_vertex_buffer(vbo, layout);

  return [vao, ibo, index_data];
}