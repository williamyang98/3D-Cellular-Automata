const vertex_data = new Float32Array([
    -1, -1, 
    -1, +1,
    +1, -1,
    +1, +1
]);

const index_data = new Uint32Array([
    0, 3, 1,
    0, 2, 3,
]);

const mesh = { index_data, vertex_data };

export { mesh };