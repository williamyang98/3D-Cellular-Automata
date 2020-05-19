import { Shader } from '../gl/Shader';
import { VertexBuffer, VertexBufferArray, VertexBufferLayout } from '../gl/VertexBuffer';
import { IndexBuffer } from '../gl/IndexBuffer';
import { UniformMat4f, UniformVec3f, UniformVec4f, Uniform } from '../gl/Uniform';

import basic_shader from '../shaders/basic';
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { VoxelGrid } from './VoxelGrid';
import { RuleBrowser } from './RuleBrowser';
import { vec4 } from 'gl-matrix';

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

    this.voxels = new VoxelGrid(this.size, 1.0);
    this.sim = new CellularAutomaton3D(this.size);

    this.init_gl(this.total_cells, this.total_states);

    this.sim.listen_step(ev => this.update_vertex_buffer());

    this.rule_browser = new RuleBrowser();
  }

  init_gl(total_cells, total_states) {
    let gl = this.gl;
    let vert_src = basic_shader.vertex(total_cells, total_states);
    let frag_src = basic_shader.frag(total_cells, total_states);
    this.shader = new Shader(gl, vert_src, frag_src); 
    this.vertex_buffer = new VertexBuffer(gl, this.voxels.vertex_data, gl.STREAM_COPY);
    this.index_buffer = new IndexBuffer(gl, this.voxels.index_data);

    let layout = new VertexBufferLayout(gl);
    layout.add_element(3, gl.FLOAT, false);
    layout.add_element(1, gl.FLOAT, false);

    this.vao = new VertexBufferArray(gl);
    this.vao.add_vertex_buffer(this.vertex_buffer, layout);
    
    this.shader.add_uniform("uMVP", new UniformMat4f(gl, this.camera.MVP));
    // this.shader.add_uniform("uGridSize", new UniformVec3f(gl, this.size));
    this.shader.add_uniform("uStateColour", new Uniform(loc => gl.uniform4fv(loc, this.state_colours_data)));
  }

  clear() {
    this.sim.clear();
  }

  randomise() {
    let entry = this.rule_browser.get_selected_entry();
    // this.clear();
    entry.randomiser.randomise(this.sim);
    this.update_vertex_buffer();
  }

  on_update() {
    this.camera.update();
    if (this.running) {
      this.step();
    }
  }

  step() {
    let entry = this.rule_browser.get_selected_entry();
    let rule = entry.rule;
    this.sim.step(rule);
  }

  update_vertex_buffer() {
    let gl = this.gl;

    let rule = this.rule_browser.get_selected_entry().rule;
    let max_value = rule.alive_state;
    let scale = (this.total_states-1)/max_value;

    for (let i = 0; i < this.sim.count; i++) {
      let state = this.sim.cells[i];
      let offset = i*this.voxels.total_vertices;
      for (let v = 0; v < this.voxels.total_vertices; v++) {
        this.voxels.states[offset+v][0] = state*scale;
      }
    }

    this.vertex_buffer.bind();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.voxels.vertex_data, 0, this.voxels.vertex_data.length);    
  }

  on_render() {
    this.renderer.draw(this.vao, this.index_buffer, this.shader);
  }
}