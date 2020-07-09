import { Texture3D } from '../../gl/Texture3D';
import { create_states_texture, create_radius_texture } from './ColourMaps';

/**
 * Collect data from simulation and render it
 */
export class SimulationRenderer {
  constructor(gl, sim, shader_manager, stats) {
    this.gl = gl;

    this.sim = sim;
    this.shader_manager = shader_manager;
    this.stats = stats;
    this.max_neighbours = 26;

    this.data_updated = false;

    this.sim.listen_available_frame((grid, unprocessed_blocks, local) => {
      this.update_texture_buffer(grid, unprocessed_blocks, local);
    });
  }

  set_size(size) {
    this.size = size;
    this.total_cells = size[0] * size[1] * size[2];
    this.create_textures();
  }

  create_textures() {
    let gl = this.gl;

    // colour maps for states and distances
    this.state_colour_texture = create_states_texture(gl);
    this.radius_colour_texture = create_radius_texture(gl);

    // create 3d texture for rendering cell data
    this.cell_data_width = 2;
    this.cell_data = new Uint8Array(this.total_cells*this.cell_data_width);
    this.cell_data_texture = new Texture3D(gl, this.cell_data, this.size);
  }

  

  // from the transferred grid from webworker, update the texture's buffer
  // we use a rgba buffer, with 8 bits for each channel
  // r = state, g = neighbours, b/a = unused
  update_texture_buffer(grid, local=false) {
    let items = local ? grid.render_updates : range(0, grid.count);
    // once updates all rendered, clear it
    if (local) grid.render_updates = new Set();

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
      cell_data[offset+1] = Math.floor(Math.min(neighbour, this.max_neighbours)/this.max_neighbours * 255);
      total_items += 1;
    }
    let end = performance.now();
    this.stats.recieve('texture_data_update', end-start);

    // data mutated if more than one item
    this.data_updated = this.data_updated || (total_items > 0);
  }

  // open gl requires us to load data to gpu when texture changed
  load_texture_data() {
    let gl = this.gl;
    if (!this.data_updated) {
      return;
    }
    let start = performance.now();
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, this.size[0], this.size[1], this.size[2], gl.RG, gl.UNSIGNED_BYTE, this.cell_data, 0);
    let end = performance.now();
    this.stats.recieve('texture_data_upload', end-start);
    this.data_updated = false;
  }

  // render the 3d grid
  on_render() {
    this.shader_manager.bind();
    this.cell_data_texture.bind(0);
    this.sim.request_frame();
    this.load_texture_data();
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

