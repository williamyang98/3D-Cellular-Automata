import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../gl/VertexBuffer';
import { IndexBuffer } from '../gl/IndexBuffer';

import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { cube } from '../gl/CubeData';

import { Texture3D } from '../gl/Texture3D';
import { Texture2D } from '../gl/Texture2D';

import colorsys from 'colorsys';


export class SimulationWindow {
  constructor(gl, size, renderer, camera, shader_manager, rule_browser) {
    this.gl = gl;
    this.renderer = renderer;
    this.camera = camera;
    this.size = size;

    this.total_cells = size[0] * size[1] * size[2];

    this.running = false;
    this.total_queued_steps = 0;

    this.shader_manager = shader_manager;
    this.rule_browser = rule_browser;
    this.create_data();
    
    this.sim = new CellularAutomaton3D(this.size);
    this.sim.listen_rerender(sim => this.update_vertex_buffer_local());

  }

  create_data() {
    let gl = this.gl;

    let terrain_vbo_layout = new VertexBufferLayout(gl);
    terrain_vbo_layout.push_attribute(0, 3, gl.FLOAT, false);
    terrain_vbo_layout.push_attribute(1, 3, gl.FLOAT, false);

    let vertex_data = cube.vertex_data(0, 1, 1, 0, 1, 0);
    let index_data = cube.index_data;
    this.state_data = new Uint8Array(this.total_cells);

    let terrain_vbo = new VertexBufferObject(gl, vertex_data, gl.STATIC_DRAW);
    this.index_buffer = new IndexBuffer(gl, index_data);

    this.vao = new VertexArrayObject(gl);
    this.vao.add_vertex_buffer(terrain_vbo, terrain_vbo_layout);

    this.state_colour_texture = this.create_states_texture();
    this.state_texture = new Texture3D(gl, this.state_data, this.size);
  }

  create_states_texture() {
    let gl = this.gl;

    let total_states = 40;
    let state_colours_data = new Uint8Array(4*total_states)
    for (let i = 0; i < total_states-1; i++) {
      let offset = (i+1)*4;
      
      const hue_range = 200;
      let hue = hue_range*(1.0-i/total_states);
      let saturation = 100;
      let value = 80;
      let {r, g, b} = colorsys.hsv_to_rgb(hue, saturation, value);
      state_colours_data[offset+0] = r;
      state_colours_data[offset+1] = g;
      state_colours_data[offset+2] = b;
      state_colours_data[offset+3] = 255;
    }

    for (let i = 0; i < 4; i++) {
      state_colours_data[i] = 0;
    }

    return new Texture2D(gl, state_colours_data, [total_states,1]);
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
      this.total_queued_steps = 1;
    }

    if (this.total_queued_steps > 0) {
      let entry = this.rule_browser.get_selected_entry();
      let rule = entry.rule;
      let res = this.sim.step(rule);
      if (res) {
        this.total_queued_steps = 0;
      } 
    }
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
    this.total_queued_steps = 0;
  }

  toggle() {
    if (this.running)
      this.stop();
    else
      this.start();
  }

  step() {
    this.total_queued_steps = 1;
  }

  update_vertex_buffer() {
    let gl = this.gl;

    let rule = this.rule_browser.get_selected_entry().rule;
    let max_value = rule.alive_state;

    for (let i = 0; i < this.sim.count; i++) {
      let state = this.sim.cells[i];
      this.state_data[i] = Math.floor(state/max_value * 255);
    }

    this.state_texture.bind();
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RED, gl.UNSIGNED_BYTE, this.state_data, 0);
  }

  update_vertex_buffer_local() {
    let gl = this.gl;

    let rule = this.rule_browser.get_selected_entry().rule;
    let max_value = rule.alive_state;

    for (let i of this.sim.should_update) {
      let state = this.sim.cells[i];
      this.state_data[i] = Math.floor(state/max_value * 255);
    }

    this.state_texture.bind();
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RED, gl.UNSIGNED_BYTE, this.state_data, 0);

  }

  on_render() {
    let gl = this.gl;
    this.shader_manager.bind();
    this.state_texture.bind(0);
    this.state_colour_texture.bind(1);
    this.vao.bind();
    this.index_buffer.bind();

    gl.drawElementsInstanced(gl.TRIANGLES, this.index_buffer.count, gl.UNSIGNED_INT, this.index_data, this.total_cells); 
  }
}