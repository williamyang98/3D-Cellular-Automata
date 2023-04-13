let create_cube_vertex_data = (left, right, front, back, top, bottom) => {
    return new Float32Array([
        left, bottom, front, 0, 0, 1,
        right, bottom, front, 0, 0, 1,
        left, top, front, 0, 0, 1,
        right, top, front, 0, 0, 1,

        left, top, front, 0, 1, 0,
        left, top, back, 0, 1, 0,
        right, top, back, 0, 1, 0,
        right, top, front, 0, 1, 0,

        right, top, front, 1, 0, 0,
        right, bottom, front, 1, 0, 0,
        right, bottom, back, 1, 0, 0,
        right, top, back, 1, 0, 0,

        left, top, front, -1, 0, 0,
        left, top, back, -1, 0, 0,
        left, bottom, front, -1, 0, 0,
        left, bottom, back, -1, 0, 0,

        left, bottom, front, 0, -1, 0,
        left, bottom, back, 0, -1, 0,
        right, bottom, back, 0, -1, 0,
        right, bottom, front, 0, -1, 0,

        left, top, back, 0, 0, -1,
        right, top, back, 0, 0, -1,
        left, bottom, back, 0, 0, -1,
        right, bottom, back, 0, 0, -1,
  ]);
}

// wind triangles counter clockwise for culling
let cube_index_data = new Uint32Array([
    0, 3, 2,
    0, 1, 3,

    4, 6, 5,
    4, 7, 6,

    8, 9, 11,
    9, 10, 11,

    13, 14, 12,
    13, 15, 14,

    16, 18, 19,
    16, 17, 18,

    20, 21, 22,
    21, 23, 22,
]);

let create_cube_optimised_vertex_data = (left, right, front, back, top, bottom) => {
    return new Float32Array([
        left, bottom, front,
        right, bottom, front,
        left, top, front,
        right, top, front,
        left, bottom, back, 
        right, bottom, back, 
        left, top, back, 
        right, top, back, 
    ]);
}

// wind triangles counter clockwise for culling
const cube_optimised_index_data = new Uint32Array([
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

let create_cube = (left, right, front, back, top, bottom) => {
    let vertex_data = create_cube_vertex_data(left, right, front, back, top, bottom);
    return { vertex_data, index_data: cube_index_data };
};

let create_optimised_cube = (left, right, front, back, top, bottom) => {
    let vertex_data = create_cube_optimised_vertex_data(left, right, front, back, top, bottom);
    return { vertex_data, index_data: cube_optimised_index_data };
};

export { create_cube, create_optimised_cube };