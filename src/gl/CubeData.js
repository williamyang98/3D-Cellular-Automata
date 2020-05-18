function vertex_data(left, right, front, back, top, bottom, props) {
  return new Float32Array([
    left, bottom, front, ...props,
    right, bottom, front, ...props,
    left, top, front, ...props,
    right, top, front, ...props,
    left, bottom, back, ...props,
    right, bottom, back, ...props,
    left, top, back, ...props,
    right, top, back, ...props,
  ]);
}

// wind triangles counter clockwise for culling
// const cell_index_data = new Uint32Array([
//   0, 1, 2, // bottom face
//   1, 2, 3,
//   4, 5, 6, // top face
//   5, 6, 7,
//   0, 1, 4, // front face
//   1, 4, 5,
//   2, 3, 6, // back face
//   3, 6, 7,
//   0, 2, 4, // left face
//   2, 4, 6,
//   1, 3, 5, // right face
//   3, 5, 7,
// ]);

const index_data = new Uint32Array([
  0, 1, 2,
  1, 3, 2,
  2, 3, 6, 
  3, 7, 6,
  1, 5, 3, 
  5, 7, 3,
  0, 2, 6, 
  0, 6, 4, 
  4, 1, 0, 
  1, 4, 5, 
  5, 6, 7, 
  5, 4, 6,
]);

export const cube = {
    vertex_data: vertex_data,
    index_data: index_data
};