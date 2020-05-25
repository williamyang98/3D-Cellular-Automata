import { Shader } from '../gl/Shader';
import { UniformMat4f, UniformVec3f, Uniform } from '../gl/Uniform';

import { fragment_shader_src } from '../shaders/fragment_shader';
import { vertex_shader_src } from '../shaders/vertex_shader';
import { vec3 } from 'gl-matrix';

export class ShaderManager {
  constructor(gl, camera) {
    this.gl = gl;
    this.size = vec3.create();
    this.camera = camera;

    this.create();
  }

  set_size(size) {
    for (let i = 0; i < 3; i++)
      this.size[i] = size[i];
  }

  create() {
    let gl = this.gl;
    this.shaders = [];
    for (let vert_type in vertex_shader_src) {
      // for (let frag_type in fragment_shader_src) {
        let frag_type = 'basic';
        let vert_src = vertex_shader_src[vert_type];
        let frag_src = fragment_shader_src[frag_type];
        let shader = new Shader(gl, vert_src, frag_src); 
        this.add_uniforms(shader);

        // this.shaders.push({name:`${vert_type} (${frag_type})`, shader:shader});
        this.shaders.push({name:`${vert_type}`, shader:shader});
      // }
    }
    this.current_shader = 0;
  }

  select_shader(index) {
    this.current_shader = index;
  }

  bind() {
    let shader_entry = this.shaders[this.current_shader];
    let shader = shader_entry.shader;
    shader.bind();
  }

  add_uniforms(shader) {
    let gl = this.gl;

    shader.add_uniform("uModel", new UniformMat4f(gl, this.camera.model));
    shader.add_uniform("uView", new UniformMat4f(gl, this.camera.view));
    shader.add_uniform("uProjection", new UniformMat4f(gl, this.camera.projection));
    shader.add_uniform("uGridSize", new UniformVec3f(gl, this.size));
    shader.add_uniform("uViewPosition", new UniformVec3f(gl, this.camera.view_position));

    // lighting
    let light_position = vec3.create();
    vec3.scale(light_position, this.size, 2.5);
    shader.add_uniform('light.position', new UniformVec3f(gl, light_position));
    shader.add_uniform('light.colour', new UniformVec3f(gl, vec3.fromValues(1,1,1)));
    // // lighting params
    shader.add_uniform("uAmbientStrength", new Uniform(loc => gl.uniform1f(loc, 0.3)));
    shader.add_uniform("uDiffuseStrength", new Uniform(loc => gl.uniform1f(loc, 0.9)));
    shader.add_uniform("uSpecularStrength", new Uniform(loc => gl.uniform1f(loc, 0.5)));
    shader.add_uniform("uSpecularPowerFactor", new Uniform(loc => gl.uniform1f(loc, 4.0)));
    // add texture id
    shader.add_uniform("uStateTexture",         new Uniform(loc => gl.uniform1i(loc, 0)));
    shader.add_uniform("uStateColourTexture",   new Uniform(loc => gl.uniform1i(loc, 1)));
    shader.add_uniform("uRadiusColourTexture",  new Uniform(loc => gl.uniform1i(loc, 2)));
    // post processing
    shader.add_uniform("uScalingEnabled", new Uniform(loc => gl.uniform1i(loc, 0)));
    shader.add_uniform("uFogNear", new Uniform(loc => gl.uniform1f(loc, 0)));
    shader.add_uniform("uFogFar", new Uniform(loc => gl.uniform1f(loc, 0)));
    shader.add_uniform("uSunStrength", new Uniform(loc => gl.uniform1f(loc, 0.95)));
  }
}