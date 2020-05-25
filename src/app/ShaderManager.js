import { Shader } from '../gl/Shader';
import { UniformMat4f, UniformVec3f, Uniform } from '../gl/Uniform';

import { fragment_shader_src } from '../shaders/fragment_shader';
import { vertex_shader_src } from '../shaders/vertex_shader';
import { vec3 } from 'gl-matrix';

export class ShaderManager {
  constructor(gl, camera) {
    this.gl = gl;
    this.size = vec3.create();
    this.light_position = vec3.create();
    this.camera = camera;

    this.params = {
      ambient_strength: new Slider(0, 1, 0.4),
      diffuse_strength: new Slider(0, 1, 0.95),
      specular_strength: new Slider(0, 1, 0.6),
      specular_power_factor: new Slider(0, 128.0, 4.0),
      scaling_enabled: new Toggle(0),
      fog_near: new Slider(0, 1, 0),
      fog_far: new Slider(0, 1, 0),
      sun_strength: new Slider(0, 1, 0.95),
      sky_strength: new Slider(0, 1, 0.4),
    };

    this.create_options();
    this.create_shader();
  }

  create_options() {
    this.colourings = [];
    this.shadings = [];

    for (let vert_type in vertex_shader_src) {
      this.colourings.push(vert_type);
    }
    for (let frag_type in fragment_shader_src) {
      this.shadings.push(frag_type);
    }

    this.current_colouring = 0;
    this.current_shading = 0;
  }

  create_shader() {
    let vert_name = this.colourings[this.current_colouring];
    let frag_name = this.shadings[this.current_shading];

    let vert_src = vertex_shader_src[vert_name];
    let frag_src = fragment_shader_src[frag_name];
    this.shader = new Shader(this.gl, vert_src, frag_src);
    this.add_uniforms(this.shader);
  }

  set_size(size) {
    for (let i = 0; i < 3; i++) {
      this.size[i] = size[i];
    }

    vec3.scale(this.light_position, this.size, 2.5);
  }

  set_param(name, value) {
    let param = this.params[name];
    param.value = value;
    this.params = {...this.params};
  }

  select_colouring(index) {
    this.current_colouring = index;
    this.create_shader();
  }

  select_shading(index) {
    this.current_shading = index;
    this.create_shader();
  }

  bind() {
    this.shader.bind();
  }

  add_uniforms(shader) {
    let gl = this.gl;

    shader.add_uniform("uModel", new UniformMat4f(gl, this.camera.model));
    shader.add_uniform("uView", new UniformMat4f(gl, this.camera.view));
    shader.add_uniform("uProjection", new UniformMat4f(gl, this.camera.projection));
    shader.add_uniform("uGridSize", new UniformVec3f(gl, this.size));
    shader.add_uniform("uViewPosition", new UniformVec3f(gl, this.camera.view_position));

    // lighting
    shader.add_uniform('light.position', new UniformVec3f(gl, this.light_position));
    shader.add_uniform('light.colour', new UniformVec3f(gl, vec3.fromValues(1,1,1)));
    // // lighting params
    shader.add_uniform("uAmbientStrength", new Uniform(loc => gl.uniform1f(loc, this.params.ambient_strength.value)));
    shader.add_uniform("uDiffuseStrength", new Uniform(loc => gl.uniform1f(loc, this.params.diffuse_strength.value)));
    shader.add_uniform("uSpecularStrength", new Uniform(loc => gl.uniform1f(loc, this.params.specular_strength.value)));
    shader.add_uniform("uSpecularPowerFactor", new Uniform(loc => gl.uniform1f(loc, this.params.specular_power_factor.value)));
    // add texture id
    shader.add_uniform("uStateTexture",         new Uniform(loc => gl.uniform1i(loc, 0)));
    shader.add_uniform("uStateColourTexture",   new Uniform(loc => gl.uniform1i(loc, 1)));
    shader.add_uniform("uRadiusColourTexture",  new Uniform(loc => gl.uniform1i(loc, 2)));
    // post processing
    shader.add_uniform("uScalingEnabled", new Uniform(loc => gl.uniform1i(loc, this.params.scaling_enabled.value)));
    shader.add_uniform("uFogNear", new Uniform(loc => gl.uniform1f(loc, this.params.fog_near.value)));
    shader.add_uniform("uFogFar", new Uniform(loc => gl.uniform1f(loc, this.params.fog_far.value)));
    shader.add_uniform("uSunStrength", new Uniform(loc => gl.uniform1f(loc, this.params.sun_strength.value)));
    shader.add_uniform("uSkyStrength", new Uniform(loc => gl.uniform1f(loc, this.params.sky_strength.value)));
  }
}

class Toggle {
  constructor(value) {
    this.type = 'toggle';
    this.value = value;
  }
}

class Slider {
  constructor(min, max, value) {
    this.type = 'slider';
    this.min = min;
    this.max = max;
    this.value = value;
  }

  set value(val) {
    val = this.clamp(val);
    this._value = val;
  }

  get value() {
    return this._value;
  }

  clamp(val) {
    if (val < this.min) {
      val = this.min;
    }
    if (val > this.max) {
      val = this.max;
    }
    return val;
  }
}