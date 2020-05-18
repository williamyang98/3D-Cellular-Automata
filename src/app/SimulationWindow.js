import { Shader } from '../gl/Shader';
import { VertexBuffer, VertexBufferArray, VertexBufferLayout } from '../gl/VertexBuffer';
import { IndexBuffer } from '../gl/IndexBuffer';
import { UniformMat4f, UniformVec3f } from '../gl/Uniform';

import basic_shader from '../shaders/basic';
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { VoxelGrid } from './VoxelGrid';
import { RuleBrowser } from './RuleBrowser';

export class SimulationWindow {
  constructor(gl, size, renderer, camera) {
    this.gl = gl;
    this.renderer = renderer;
    this.camera = camera;
    this.size = size;

    this.running = false;
    
    this.total_cells = 1;
    this.size.forEach(n => this.total_cells *= n);

    this.voxels = new VoxelGrid(this.size, 1.0);
    this.sim = new CellularAutomaton3D(this.size);

    this.init_gl();

    this.sim.listen_step(ev => this.update_vertex_buffer());

    this.rule_browser = new RuleBrowser();
  }

  init_gl() {
    let gl = this.gl;
    this.shader = new Shader(gl, basic_shader.vertex, basic_shader.frag); 
    this.vertex_buffer = new VertexBuffer(gl, this.voxels.vertex_data, gl.STREAM_COPY);
    this.index_buffer = new IndexBuffer(gl, this.voxels.index_data);

    let layout = new VertexBufferLayout(gl);
    layout.add_element(3, gl.FLOAT, false);
    layout.add_element(4, gl.FLOAT, true);

    this.vao = new VertexBufferArray(gl);
    this.vao.add_vertex_buffer(this.vertex_buffer, layout);
    
    this.shader.add_uniform("uMVP", new UniformMat4f(gl, this.camera.MVP));
    this.shader.add_uniform("uGridSize", new UniformVec3f(gl, this.size));
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

    const colour_map = [
      [0, 0, 0, 0],
      [0.5, 0.9, 0, 1],
      [0.7, 0.75, 0, 1],
      [0.9, 0.5, 0, 1],
      [1, 0.25, 0, 1],
      [1, 0, 0, 1]
    ];

    for (let i = 0; i < this.sim.count; i++) {
      let state = this.sim.cells[i];
      let colour = colour_map[state];
      let offset = this.voxels.get_offset(i);
      for (let v = 0; v < this.voxels.total_vertexes; v++) {
        for (let c = 0; c < 4; c++) {
          let idx = offset + v*this.voxels.vertex_size + c + 3;
          this.voxels.vertex_data[idx] = colour[c];
        }
      }
    }

    this.vertex_buffer.bind();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.voxels.vertex_data, 0, this.voxels.vertex_data.length);    
  }

  on_render() {
    this.renderer.draw(this.vao, this.index_buffer, this.shader);
  }
}