import { Shader } from '../gl/Shader';
import { UniformMat4f, UniformVec3f, Uniform } from '../gl/Uniform';
import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../gl/VertexBuffer';
import { IndexBuffer } from '../gl/IndexBuffer';

import { cube, cube_optimized } from '../gl/CubeData';

import { fragment_shader_src } from '../shaders/fragment_shader';
import { vertex_shader_src } from '../shaders/vertex_shader';
import { volume_shader } from '../shaders/volume';
import { vec3 } from 'gl-matrix';

import { Slider, Toggle } from '../ui/AdjustableValues';

export class ShaderManager {
  constructor(gl, camera) {
    this.gl = gl;
    this.size = vec3.create();
    this.total_cells = 0;
    this.light_position = vec3.create();
    this.camera = camera;

    this.global_params = {
      ambient_strength: new Slider(0, 1, 0.4),
      diffuse_strength: new Slider(0, 1, 0.95),
      specular_strength: new Slider(0, 1, 0.6),
      specular_power_factor: new Slider(0, 128.0, 4.0),
      scaling_enabled: new Toggle(0),
      fog_near: new Slider(0, 1, 0),
      fog_far: new Slider(0, 1, 0),
      sun_strength: new Slider(0, 1, 0.95),
      sky_strength: new Slider(0, 1, 0.25),
      brightness: new Slider(0, 1, 0.9),
    };

    this.create_options();
    this.set_available_shadings();
    this.create_shader();
    this.create_params();
  }

  set_available_shadings() {
    let render_type = this.render_types[this.current_render_type];
    let shadings = [];
    for (let i = 0; i < this.all_shadings.length; i++) {
      let name = this.all_shadings[i];
      let shader = fragment_shader_src[name];
      if (render_type.point_cloud && !shader.point_cloud) {
        continue;
      }
      shadings.push(name);
    }
    this.shadings = shadings;
    this.current_shading = 0;
  }

  create_options() {
    this.render_types = [
      // create_quad_data(this.gl),
      // create_triangle_data(this.gl),
      // create_cube_data(this.gl),
      create_volume_data(this.gl),
    ];

    this.colourings = [];
    this.all_shadings = [];
    this.shadings = [];

    // this.shadings_params = {
    //   basic: ['sun_strength', 'sky_strength', 'fog_near', 'fog_far', 'scaling_enabled'],
    //   basic_alternate: ['ambient_strength', 'diffuse_strength', 'specular_strength', 'specular_power_factor', 'scaling_enabled'],
    //   no_shading: ['brightness', 'scaling_enabled']
    // };

    // for (let vert_type in vertex_shader_src) {
    //   this.colourings.push(vert_type);
    // }
    // for (let frag_type in fragment_shader_src) {
    //   this.all_shadings.push(frag_type);
    // }

    this.current_render_type = 0;
    this.current_colouring = 0;
    this.current_shading = 0;
  }

  create_shader() {
    // let vert_name = this.colourings[this.current_colouring];
    // let frag_name = this.shadings[this.current_shading];
    // let render_type = this.render_types[this.current_render_type];

    // let vert_shader = vertex_shader_src[vert_name];
    // let frag_shader = fragment_shader_src[frag_name];

    // // point cloud only works with no shading
    // if (render_type.point_cloud && !frag_shader.point_cloud) {
    //   for (let index = 0; index < this.shadings.length; index++) {
    //     let name = this.shadings[index];
    //     let shader = fragment_shader_src[name];
    //     if (shader.point_cloud) {
    //       this.current_shading = index;
    //       return this.create_shader();
    //     }
    //   }
    // }

    // let vert_src = vert_shader(render_type.point_cloud);
    // let frag_src = frag_shader.create(render_type.point_cloud);

    // this.shader = new Shader(this.gl, vert_src, frag_src);
    // this.add_uniforms(this.shader);

    // let render_type = this.render_types[this.current_render_type];
    this.shader = new Shader(this.gl, volume_shader.vert_src, volume_shader.frag_src);
    this.add_uniforms(this.shader);
  }

  create_params() {
    // let name = this.shadings[this.current_shading];
    // let param_names = this.shadings_params[name];
    // let params = {};
    // for (let name of param_names) {
    //   let param = this.global_params[name];
    //   params[name] = param;
    // }
    this.params = {};
  }

  set_size(size) {
    for (let i = 0; i < 3; i++) {
      this.size[i] = size[i];
    }

    this.total_cells = size[0] * size[1] * size[2];

    vec3.scale(this.light_position, this.size, 2.5);
  }

  set_param(name, value) {
    let param = this.params[name];
    param.value = value;
    this.params = {...this.params};
  }

  select_render_type(index) {
    this.current_render_type = index;
    this.set_available_shadings();
    this.create_shader();
    this.create_params();
  }  

  select_colouring(index) {
    this.current_colouring = index;
    this.create_shader();
    this.create_params();
  }

  select_shading(index) {
    this.current_shading = index;
    this.create_shader();
    this.create_params();
  }

  bind() {
    this.shader.bind();
    let render_type = this.render_types[this.current_render_type];
    render_type.vao.bind();
    render_type.index_buffer.bind();
  }

  on_render() {
    let gl = this.gl;
    let render_type = this.render_types[this.current_render_type];
    // gl.drawElementsInstanced(gl.TRIANGLES, render_type.index_buffer.count, gl.UNSIGNED_INT, render_type.index_data, this.total_cells); 
    gl.drawElementsInstanced(gl.TRIANGLES, render_type.index_buffer.count, gl.UNSIGNED_INT, render_type.index_data, 1); 
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
    shader.add_uniform("uAmbientStrength", new Uniform(loc => gl.uniform1f(loc, this.global_params.ambient_strength.value)));
    shader.add_uniform("uDiffuseStrength", new Uniform(loc => gl.uniform1f(loc, this.global_params.diffuse_strength.value)));
    shader.add_uniform("uSpecularStrength", new Uniform(loc => gl.uniform1f(loc, this.global_params.specular_strength.value)));
    shader.add_uniform("uSpecularPowerFactor", new Uniform(loc => gl.uniform1f(loc, this.global_params.specular_power_factor.value)));
    shader.add_uniform("uBrightness", new Uniform(loc => gl.uniform1f(loc, this.global_params.brightness.value)));
    // add texture id
    shader.add_uniform("uStateTexture",         new Uniform(loc => gl.uniform1i(loc, 0)));
    shader.add_uniform("uStateColourTexture",   new Uniform(loc => gl.uniform1i(loc, 1)));
    shader.add_uniform("uRadiusColourTexture",  new Uniform(loc => gl.uniform1i(loc, 2)));
    // post processing
    shader.add_uniform("uScalingEnabled", new Uniform(loc => gl.uniform1i(loc, this.global_params.scaling_enabled.value)));
    shader.add_uniform("uFogNear", new Uniform(loc => gl.uniform1f(loc, this.global_params.fog_near.value)));
    shader.add_uniform("uFogFar", new Uniform(loc => gl.uniform1f(loc, this.global_params.fog_far.value)));
    shader.add_uniform("uSunStrength", new Uniform(loc => gl.uniform1f(loc, this.global_params.sun_strength.value)));
    shader.add_uniform("uSkyStrength", new Uniform(loc => gl.uniform1f(loc, this.global_params.sky_strength.value)));
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

  return {
    name: 'volume',
    vao: vao,
    index_buffer: ibo,
    index_data: index_data,
  };
}

const create_cube_data = (gl) => {
  let terrain_vbo_layout = new VertexBufferLayout(gl);
  terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);
  terrain_vbo_layout.push_attribute(1, 3, gl.FLOAT, false);

  let vertex_data = cube.vertex_data(0, 1, 1, 0, 1, 0);
  let index_data = cube.index_data;

  let terrain_vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
  let index_buffer = new IndexBuffer(gl, index_data);

  let vao = new VertexArrayObject(gl);
  vao.add_vertex_buffer(terrain_vbo, terrain_vbo_layout);

  return {
    name: 'cube',
    vao: vao,
    index_buffer: index_buffer,
    index_data: index_data,
    point_cloud: false
  };
}

const create_quad_data = (gl) => {
  let terrain_vbo_layout = new VertexBufferLayout(gl);
  terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);

  let vertex_data = new Float32Array([0, 1, 0.5,
                                      1, 1, 0.5,
                                      0, 0, 0.5,
                                      1, 0, 0.5]);
  let index_data = new Uint32Array([2, 1, 0, 2, 3, 1]);

  let terrain_vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
  let index_buffer = new IndexBuffer(gl, index_data);

  let vao = new VertexArrayObject(gl);
  vao.add_vertex_buffer(terrain_vbo, terrain_vbo_layout);

  return {
    name: 'quad point cloud',
    vao: vao,
    index_buffer: index_buffer,
    index_data: index_data,
    point_cloud: true
  };
}

const create_triangle_data = (gl) => {
  let terrain_vbo_layout = new VertexBufferLayout(gl);
  terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);

  let vertex_data = new Float32Array([-0.5, -0.5, 0.5,
                                      1.5, -0.5, 0.5,
                                      0.5, -1.5, 0.5]);
  let index_data = new Uint32Array([2, 1, 0]);

  let terrain_vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
  let index_buffer = new IndexBuffer(gl, index_data);

  let vao = new VertexArrayObject(gl);
  vao.add_vertex_buffer(terrain_vbo, terrain_vbo_layout);

  return {
    name: 'triangle point cloud',
    vao: vao,
    index_buffer: index_buffer,
    index_data: index_data,
    point_cloud: true
  };
}