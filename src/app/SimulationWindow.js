import { Shader } from '../gl/Shader';
import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../gl/VertexBuffer';
import { IndexBuffer } from '../gl/IndexBuffer';
import { UniformMat4f, UniformVec3f, UniformVec4f, Uniform } from '../gl/Uniform';

import basic_shader from '../shaders/basic';
import performance_shader from '../shaders/performance';
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { VoxelGrid, VoxelGridPerformance } from './VoxelGrid';
import { RuleBrowser } from './RuleBrowser';
import { vec4, vec3 } from 'gl-matrix';
import { cube_optimized, cube } from '../gl/CubeData';
import { Texture3D } from '../gl/Texture3D';
import { Texture2D } from '../gl/Texture2D';

export class SimulationWindow {
  constructor(gl, size, renderer, camera) {
    this.gl = gl;
    this.renderer = renderer;
    this.camera = camera;
    this.size = size;

    this.running = false;
    
    this.total_cells = 1;
    this.size.forEach(n => this.total_cells *= n);

    this.state_colours_data = new Float32Array([
      0, 0, 0, 0,
      0.5, 0.9, 0, 1,
      0.7, 0.75, 0, 1,
      0.9, 0.5, 0, 1,
      1, 0.25, 0, 1,
      1, 0, 0, 1
    ]);

    this.total_states = 6;

    // this.voxels = new VoxelGrid(this.size, 1.0);
    // this.voxels = new VoxelGridPerformance(this.size, 1.0);
    // this.state_buffer = new Float32Array(this.voxels.cell_count * this.voxels.total_vertices);
    this.sim = new CellularAutomaton3D(this.size);

    this.init_gl(this.total_cells, this.total_states);
    this.rule_browser = new RuleBrowser();

    this.sim.listen_rerender(sim => this.update_vertex_buffer_local());
  }

  create_performance_shader(total_states, total_lights) {
    let gl = this.gl;

    let vert_src = performance_shader.vertex(total_states);
    let frag_src = performance_shader.frag(total_lights);

    this.shader = new Shader(gl, vert_src, frag_src); 

    this.terrain_vbo_layout = new VertexBufferLayout(gl);
    this.terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);
    this.terrain_vbo_layout.push_attribute(1, 3, gl.FLOAT, false);

    // this.state_vbo_layout = new VertexBufferLayout(gl);
    // this.state_vbo_layout.push_attribute(1, 1, gl.FLOAT, false);

  }

  create_basic_shader(total_states, total_lights) {
    let gl = this.gl;

    let vert_src = basic_shader.vertex(total_states);
    let frag_src = basic_shader.frag(total_lights);

    this.shader = new Shader(gl, vert_src, frag_src); 

    this.terrain_vbo_layout = new VertexBufferLayout(gl);
    this.terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);
    this.terrain_vbo_layout.push_attribute(1, 3, gl.FLOAT, false);

    this.state_vbo_layout = new VertexBufferLayout(gl);
    this.state_vbo_layout.push_attribute(2, 1, gl.FLOAT, false);
  }

  init_gl(total_cells, total_states) {
    let gl = this.gl;

    // let total_lights = 3*3*3-1;
    let total_lights = 1;

    this.create_performance_shader(total_states, total_lights);
    // this.create_basic_shader(total_states, total_lights);

    this.vertex_data = cube.vertex_data(0, 1, 1, 0, 1, 0);
    this.index_data = cube.index_data;
    this.state_data = new Uint8Array(this.total_cells);

    this.terrain_vbo = new VertexBufferObject(gl, this.vertex_data, gl.STATIC_DRAW);
    this.index_buffer = new IndexBuffer(gl, this.index_data);

    this.vao = new VertexArrayObject(gl);
    this.vao.add_vertex_buffer(this.terrain_vbo, this.terrain_vbo_layout);
    // this.vao.add_vertex_buffer(this.state_vbo, this.state_vbo_layout);

    this.shader.add_uniform("uModel", new UniformMat4f(gl, this.camera.model));
    this.shader.add_uniform("uView", new UniformMat4f(gl, this.camera.view));
    this.shader.add_uniform("uProjection", new UniformMat4f(gl, this.camera.projection));
    this.shader.add_uniform("uStateColour", new Uniform(loc => gl.uniform4fv(loc, this.state_colours_data)));
    this.shader.add_uniform("uGridSize", new UniformVec3f(gl, this.size));
    // camera data
    this.shader.add_uniform("uViewPosition", new UniformVec3f(gl, this.camera.view_position));

    let light_position = vec3.create();
    vec3.scale(light_position, this.size, 2.5);
    this.shader.add_uniform('light.position', new UniformVec3f(gl, light_position));
    this.shader.add_uniform('light.colour', new UniformVec3f(gl, vec3.fromValues(1,1,1)));

    // // lighting params
    this.shader.add_uniform("uAmbientStrength", new Uniform(loc => gl.uniform1f(loc, 0.3)));
    this.shader.add_uniform("uDiffuseStrength", new Uniform(loc => gl.uniform1f(loc, 0.9)));
    this.shader.add_uniform("uSpecularStrength", new Uniform(loc => gl.uniform1f(loc, 0.5)));
    // specular lighting
    this.shader.add_uniform("uSpecularPowerFactor", new Uniform(loc => gl.uniform1f(loc, 4.0)));

    // add texture id
    this.state_texture = new Texture3D(gl, this.state_data, this.size);
    this.shader.add_uniform("uStateTexture", new Uniform(loc => gl.uniform1i(loc, 0)));
  }

  clear() {
    this.sim.clear();
    this.update_vertex_buffer();
  }

  randomise() {
    let entry = this.rule_browser.get_selected_entry();
    // this.clear();
    entry.randomiser.randomise(this.sim);
    this.sim.seed_updates(entry.rule);

    this.update_vertex_buffer();
  }

  on_update() {
    this.camera.update();
    if (this.running) {
      this.step(false);
    }
  }

  step(complete=true) {
    let entry = this.rule_browser.get_selected_entry();
    let rule = entry.rule;
    this.sim.step(rule, complete);
  }

  update_vertex_buffer() {
    let gl = this.gl;

    let rule = this.rule_browser.get_selected_entry().rule;
    let max_value = rule.alive_state;
    let scale = (this.total_states-1)/max_value;

    for (let i = 0; i < this.sim.count; i++) {
      let state = this.sim.cells[i];
      this.state_data[i] = Math.floor(state * scale);
    }

    this.state_texture.bind();
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RED, gl.UNSIGNED_BYTE, this.state_data, 0);
  }

  update_vertex_buffer_local() {
    let gl = this.gl;

    let rule = this.rule_browser.get_selected_entry().rule;
    let max_value = rule.alive_state;
    let scale = (this.total_states-1)/max_value;

    for (let i of this.sim.should_update) {
      let state = this.sim.cells[i];
      this.state_data[i] = Math.floor(state * scale);
    }

    this.state_texture.bind();
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RED, gl.UNSIGNED_BYTE, this.state_data, 0);

  }

  on_render() {
    let gl = this.gl;
    this.shader.bind();
    this.state_texture.bind(0);
    // this.test_texture.bind(0);
    this.vao.bind();
    this.index_buffer.bind();

    gl.drawElementsInstanced(gl.TRIANGLES, this.index_buffer.count, gl.UNSIGNED_INT, this.index_data, this.total_cells); 
    // this.renderer.draw(this.vao, this.index_buffer, this.shader);
  }
}