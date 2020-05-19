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
    this.vertex_size = 3*4 + 3*4 + 1*4; // bytes
    this.total_vertices = 24;       // vertex per cube
    this.total_triangles = 12;     // triangles per cube
    this.cell_count = this.size[0] * this.size[1] * this.size[2];

    this.vertex_data_buffer = new ArrayBuffer(this.cell_count * this.vertex_size * this.total_vertices);
    this.vertex_data = new Uint8Array(this.vertex_data_buffer);
    this.index_data = new Uint32Array(this.cell_count * this.total_triangles * 3); 

    this.positions = new Array(this.cell_count * this.total_vertices);
    this.normals = new Array(this.cell_count * this.total_vertices);
    this.states = new Array(this.cell_count * this.total_vertices);
    // create view for each vertex
    for (let i = 0; i < this.cell_count*this.total_vertices; i++) {
      let offset = i*this.vertex_size;
      let pos_view = new Float32Array(this.vertex_data_buffer, offset, 3);
      let normal_view = new Float32Array(this.vertex_data_buffer, offset + 12, 3);
      let state_view = new Float32Array(this.vertex_data_buffer, offset + 24, 1);
      this.positions[i] = pos_view;
      this.normals[i] = normal_view;
      this.states[i] = state_view;
    }
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
          let vertex_buffer_offset = current_cell*this.total_vertices;
          for (let i = 0; i < this.total_vertices; i++) {
            let pos = this.positions[vertex_buffer_offset + i];
            let norm = this.normals[vertex_buffer_offset + i];
            for (let j = 0; j < 3; j++) {
              pos[j] = vertex_data[i*6 + j];
              norm[j] = vertex_data[i*6 + j + 3]; 
            }
          }

          // add index data
          let new_index_data = cube.index_data.map(index_mapping);
          let index_buffer_offset = current_cell*this.total_triangles*3;
          for (let i = 0; i < this.total_triangles*3; i++) {
            this.index_data[index_buffer_offset + i] = new_index_data[i];
          }

          current_cell += 1;
        }
      }
    }
  }
}


