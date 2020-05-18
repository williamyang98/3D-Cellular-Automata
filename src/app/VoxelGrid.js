import { cube } from '../gl/CubeData';

export class VoxelGrid {

  constructor(size, scale) {
    let [vertex_data, index_data, total_cells] = this.generate(size, scale);
    this.vertex_data = new Float32Array(vertex_data);
    this.index_data = new Uint32Array(index_data);
    this.total_cells = total_cells;
    this.total_vertexes = 8;
    this.vertex_size = 3 + 4;
    this.size = size;
    this.scale = scale;
  }

  get_offset(index) {
    return this.total_vertexes*this.vertex_size*index;
  }

  generate(size, scale) {
    const attributes = [0.0, 0.0, 0.0, 0.0];
    let vertex_data = [];
    let index_data = [];
    let i = 0;
    for (let x = 0; x < size[0]; x++) {
      for (let y = 0; y < size[1]; y++) {
        for (let z = 0; z < size[2]; z++) {
          let left = x*scale;
          let right = (x+1)*scale;
          let front = (z+1)*scale;
          let back = (z)*scale;
          let top = (y+1)*scale;
          let bottom = (y)*scale;
          // add vertex data
          vertex_data.push(...cube.vertex_data(left, right, front, back, top, bottom, attributes));
          // 8 vertices per cell
          let new_index_data = cube.index_data.map(n => n + 8*i);
          index_data.push(...new_index_data);
          i += 1;
        }
      }
    }

    return [vertex_data, index_data, i];
  }
}


