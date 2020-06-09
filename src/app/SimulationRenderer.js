
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { Texture3D } from '../gl/Texture3D';
import { Texture2D } from '../gl/Texture2D';

import colorsys from 'colorsys';

export class SimulationRenderer {
  constructor(gl, camera, shader_manager, entry_browser, randomiser_browser, stats) {
    this.gl = gl;
    this.camera = camera;
    this.stats = stats;


    this.running = false;
    this.total_queued_steps = 0;

    this.shader_manager = shader_manager;
    this.entry_browser = entry_browser;
    this.randomiser_browser = randomiser_browser;

    this.data_updated = false;

    this.randomiser_browser.listen_select((randomiser) => {
      this.sim.set_randomiser(randomiser.to_json());
    });

    this.entry_browser.listen_select((entry) => {
      this.sim.set_randomiser(entry.randomiser.to_json());
      this.sim.set_rule(entry.rule.to_json());
    });

    this.sim = new CellularAutomaton3D(stats);
    this.sim.listen_available_frame((grid, unprocessed_blocks, local) => {
      this.update_vertex_buffer(grid, unprocessed_blocks, local);
    });
  }

  set_size(size) {
    this.size = size;
    this.total_cells = size[0] * size[1] * size[2];
    this.sim.set_size(size);
    this.create_data();
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
    this.sim.clear();
  }

  randomise() {
    let randomiser = this.randomiser_browser.current_randomiser;
    this.sim.set_randomiser(randomiser.to_json());
    this.sim.randomise();
  }

  on_update() {
    this.camera.update();
  }

  start() {
    this.running = true;
    this.sim.start();
  }

  stop() {
    this.running = false;
    this.sim.stop();
  }

  toggle() {
    if (this.running)
      this.stop();
    else
      this.start();
  }

  step() {
    this.sim.step();
  }

  update_vertex_buffer(grid, unprocessed_blocks, local=false) {
    let gl = this.gl;

    let items = local ? unprocessed_blocks : range(0, grid.count);
    let rule = this.entry_browser.selected_entry.rule;
    let max_neighbours = rule.neighbour.max;

    let cells = grid.cells;
    let neighbours = grid.neighbours;

    let total_items = 0;

    let start = performance.now();
    const width = this.cell_data_width;
    let cell_data = this.cell_data;
    for (let i of items) {
      let offset = i*width;
      let state = cells[i];
      let neighbour = neighbours[i];
      cell_data[offset+0] = state;
      cell_data[offset+1] = Math.floor(Math.min(neighbour, max_neighbours)/max_neighbours * 255);
      total_items += 1;
    }
    let end = performance.now();
    this.stats.recieve('texture_data_update', end-start);
    // console.log('Vertex update took', performance.now()-start, 'ms @', total_items);

    this.data_updated = this.data_updated || (total_items > 0);
  }

  on_render() {
    let gl = this.gl;

    this.shader_manager.bind();
    this.cell_data_texture.bind(0);
    this.sim.request_frame();

    if (this.data_updated) {
      let start = performance.now();
      gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RG, gl.UNSIGNED_BYTE, this.cell_data, 0);
      let end = performance.now();
      this.stats.recieve('texture_data_upload', end-start);
      this.data_updated = false;
    }
    this.state_colour_texture.bind(1);
    this.radius_colour_texture.bind(2);

    {
      let start = performance.now();
      this.shader_manager.on_render();
      let end = performance.now();
      this.stats.recieve('draw_time', end-start);
    }
  }
}

function *range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

function *should_update(list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      yield i;
    }
  }
}
