import { cube } from '../gl/CubeData';

export class VoxelGrid {

  constructor(size, scale) {
    this.size = size;
    this.scale = scale;

    this.create_buffers();
    this.generate();
  }

  create_buffers() {
    // r, g, b, n1, n2, n3, state
    this.vertex_size = 3*4 + 3*4;
    this.total_vertices = 24;       // vertex per cube
    this.total_triangles = 12;     // triangles per cube
    this.cell_count = this.size[0] * this.size[1] * this.size[2];

    // x, y, z, n1, n2, n3
    this.vertex_data = new Float32Array(this.cell_count * this.total_vertices * 6);
    this.index_data = new Uint32Array(this.cell_count * this.total_triangles * 3); 
  }

  generate() {
    // create data
    let current_cell = 0;
    let index_mapping = n => n + this.total_vertices*current_cell;
    for (let z = 0; z < this.size[2]; z++) {
      for (let y = 0; y < this.size[1]; y++) {
        for (let x = 0; x < this.size[0]; x++) {
          let left = x*this.scale;
          let right = (x+1)*this.scale;
          let front = (z+1)*this.scale;
          let back = (z)*this.scale;
          let top = (y+1)*this.scale;
          let bottom = (y)*this.scale;

          // add vertex data
          let vertex_data = cube.vertex_data(left, right, front, back, top, bottom);
          let vertex_buffer_offset = current_cell*this.total_vertices*6;
          for (let i = 0; i < this.total_vertices*6; i++) {
            this.vertex_data[vertex_buffer_offset+i] = vertex_data[i];
          }

          // add index data
          let index_data = cube.index_data.map(index_mapping);
          let index_buffer_offset = current_cell*this.total_triangles*3;
          for (let i = 0; i < this.total_triangles*3; i++) {
            this.index_data[index_buffer_offset + i] = index_data[i];
          }

          current_cell += 1;
        }
      }
    }
  }
}


