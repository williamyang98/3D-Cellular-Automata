import { cube } from '../gl/CubeData';
import { vec3 } from 'gl-matrix';

export class BoundingBox {
    constructor(size, thickness) {
        let [vertex_data, index_data] = this.generate(size, thickness);
        this.size = size;
        this.thickness = thickness;
        this.vertex_data = new Float32Array(vertex_data);
        this.index_data = new Uint32Array(index_data);
    }

    generate(size, thickness) {
        let vertex_data = [];
        let index_data = [];
        let triangle_count = 0;
        function push_data(data) {
            let [v, i] = data;
            vertex_data.push(...v);
            let shifted_index = i.map(idx => idx+triangle_count);
            index_data.push(...shifted_index);
            triangle_count += 24;
        }

        // create corner pieces
        let shape = vec3.fromValues(thickness, thickness, thickness);
        for (let x of [0, size[0]]) {
            for (let y of [0, size[1]]) {
                for (let z of [0, size[2]]) {
                    push_data(this.create_cube([x, y, z], shape));
                }
            }
        }
        // create x beams
        shape = vec3.fromValues(size[0]-thickness, thickness, thickness);
        for (let y of [0, size[1]]) {
            for (let z of [0, size[2]]) {
                let x = size[0]/2;
                push_data(this.create_cube([x, y, z], shape));
            }
        }
        // create y beams
        shape = vec3.fromValues(thickness, size[1]-thickness, thickness);
        for (let x of [0, size[0]]) {
            for (let z of [0, size[2]]) {
                let y = size[1]/2;
                push_data(this.create_cube([x, y, z], shape));
            }
        }
        // create z beams
        shape = vec3.fromValues(thickness, thickness, size[2]-thickness);
        for (let x of [0, size[0]]) {
            for (let y of [0, size[1]]) {
                let z = size[2]/2;
                push_data(this.create_cube([x, y, z], shape));
            }
        }

        return [vertex_data, index_data];
    }

    create_cube(centre, shape) {
        let left = centre[0] - shape[0]/2;
        let right = centre[0] + shape[0]/2;
        let top = centre[1] + shape[1]/2;
        let bottom = centre[1] - shape[1]/2;
        let front = centre[2] - shape[2]/2;
        let back = centre[2] + shape[2]/2;
        let vertex_data = cube.vertex_data(left, right, front, back, top, bottom);
        let index_data = cube.index_data;
        return [vertex_data, index_data];
    }
};