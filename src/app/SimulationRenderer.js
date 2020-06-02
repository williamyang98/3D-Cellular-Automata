
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { Texture3D } from '../gl/Texture3D';
import { Texture2D } from '../gl/Texture2D';

import colorsys from 'colorsys';

export class SimulationRenderer {
  constructor(gl, size, camera, shader_manager, rule_browser, randomiser_browser, stats) {
    this.gl = gl;
    this.camera = camera;
    this.size = size;
    this.stats = stats;

    this.total_cells = size[0] * size[1] * size[2];

    this.running = false;
    this.total_queued_steps = 0;

    this.shader_manager = shader_manager;
    this.rule_browser = rule_browser;
    this.randomiser_browser = randomiser_browser;

    this.data_updated = false;
    this.create_data();
    
    this.sim = new CellularAutomaton3D(this.size, stats);
    this.sim.listen_rerender(sim => this.update_vertex_buffer(true));

  }

  create_data() {
    let gl = this.gl;

    this.state_colour_texture = this.create_states_texture();
    this.radius_colour_texture = this.create_radius_texture();

    this.cell_data_width = 2;
    this.cell_data = new Uint8Array(this.total_cells*this.cell_data_width);
    this.cell_data_texture = new Texture3D(gl, this.cell_data, this.size);
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
      let value = 100;
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

  create_radius_texture() {
    let gl = this.gl;

    let total_states = 360;
    let state_colours_data = new Uint8Array(4*total_states)
    for (let i = 0; i < total_states; i++) {
      let offset = (i)*4;
      
      const hue_range = 360;
      let hue = hue_range*(1.0-i/total_states);
      let saturation = 100;
      let value = 100;
      let {r, g, b} = colorsys.hsv_to_rgb(hue, saturation, value);
      state_colours_data[offset+0] = r;
      state_colours_data[offset+1] = g;
      state_colours_data[offset+2] = b;
      state_colours_data[offset+3] = 255;
    }
    
    return new Texture2D(gl, state_colours_data, [total_states,1]);
  }

  clear() {
    this.sim.clear().then(() => {
      this.update_vertex_buffer();
    });
  }

  randomise() {
    let rule = this.rule_browser.get_selected_entry().rule;
    let randomiser = this.randomiser_browser.selected_randomiser;
    // this.clear();
    randomiser.randomise(this.sim);
    this.sim.seed_updates(rule);

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

  update_vertex_buffer(local=false) {
    let gl = this.gl;

    let items = local ? this.sim.should_update : range(0, this.sim.count);
    let rule = this.rule_browser.get_selected_entry().rule;
    let neighbour_config = rule.neighbours;
    let max_neighbours = neighbour_config.max_neighbours;

    let total_items = 0;
    for (let i of items) {
      let offset = i*this.cell_data_width;
      let state = this.sim.cells[i];
      let neighbours = this.sim.neighbours[i];
      this.cell_data[offset+0] = Math.floor(state * 255);
      this.cell_data[offset+1] = Math.floor(Math.min(neighbours, max_neighbours)/max_neighbours * 255);
      total_items += 1;
    }

    this.data_updated = this.data_updated || (total_items > 0);

  }

  on_render() {
    let gl = this.gl;

    this.shader_manager.bind();
    this.cell_data_texture.bind(0);
    // this.cell_data_texture.bind();
    if (this.data_updated) {
      gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RG, gl.UNSIGNED_BYTE, this.cell_data, 0);
      this.data_updated = false;
    }
    this.state_colour_texture.bind(1);
    this.radius_colour_texture.bind(2);

    this.shader_manager.on_render();
    // gl.drawElementsInstanced(gl.TRIANGLES, this.index_buffer.count, gl.UNSIGNED_INT, this.index_data, this.total_cells); 
    // gl.drawElementsInstanced(gl.POINTS, this.index_buffer.count, gl.UNSIGNED_INT, this.index_data, this.total_cells); 
  }
}

function *range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}
