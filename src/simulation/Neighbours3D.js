export class MooreNeighbour {
    count_neighbours(x, y, z, shape, cells, rule) {
        let total_neighbours = 0;

        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0)
                        continue;

                    const xn = pos_mod(x+xoff, shape[0]);
                    const yn = pos_mod(y+yoff, shape[1]);
                    const zn = pos_mod(z+zoff, shape[2]); 

                    const i = xyz_to_i(xn, yn, zn, shape);
                    const state = cells[i]; 
                    if (rule.is_neighbour(state)) 
                        total_neighbours += 1;
                }
            }
        }

        return total_neighbours;

    }

    on_location_update(x, y, z, shape, buffer) {
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    const xn = pos_mod(x+xoff, shape[0]);
                    const yn = pos_mod(y+yoff, shape[1]);
                    const zn = pos_mod(z+zoff, shape[2]); 

                    const i = xyz_to_i(xn, yn, zn, shape);
                    buffer.add(i);
                }
            }
        }
    }
}

export class VonNeumanNeighbour {
    constructor() {
        this.offsets = [];
        for (let dim = 0; dim < 3; dim++) {
            let n = [0, 0, 0];
            let m = [0, 0, 0];
            n[dim] = 1;
            m[dim] = -1;
            this.offsets.push(n);
            this.offsets.push(m); 
        }
    }

    count_neighbours(x, y, z, shape, cells, rule) {
        let total_neighbours = 0;

        for (let off of this.offsets) {
            const xn = pos_mod(x+off[0], shape[0]);
            const yn = pos_mod(y+off[1], shape[1]);
            const zn = pos_mod(z+off[2], shape[2]); 

            const i = xyz_to_i(xn, yn, zn, shape);

            const state = cells[i]; 
            if (rule.is_neighbour(state)) 
                total_neighbours += 1;
        }

        return total_neighbours;
    }

    on_location_update(x, y, z, shape, buffer) {
        let i = xyz_to_i(x, y, z, shape);
        buffer.add(i);

        for (let off of this.offsets) {
            const xn = pos_mod(x+off[0], shape[0]);
            const yn = pos_mod(y+off[1], shape[1]);
            const zn = pos_mod(z+off[2], shape[2]); 

            i = xyz_to_i(xn, yn, zn, shape);
            buffer.add(i);
        }
    }
}

function xyz_to_i(x, y, z, shape) {
    const Y = shape[0];
    const Z = shape[0]*shape[1];
    return x + y*Y + z*Z;
}

function pos_mod(n, m) {
    return (((n % m) + m) % m);
}