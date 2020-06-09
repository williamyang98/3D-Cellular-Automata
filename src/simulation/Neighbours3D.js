class MooreNeighbour {
    constructor() {
        this.max_neighbours = 26;
    }

    count_neighbours(x, y, z, grid, rule) {
        let total_neighbours = 0;

        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0)
                        continue;

                    const xn = pos_mod(x+xoff, grid.shape[0]);
                    const yn = pos_mod(y+yoff, grid.shape[1]);
                    const zn = pos_mod(z+zoff, grid.shape[2]); 

                    const i = grid.xyz_to_i(xn, yn, zn);
                    const state = grid.cells[i]; 
                    if (rule.is_neighbour(state)) 
                        total_neighbours += 1;
                }
            }
        }

        return total_neighbours;

    }

    on_location_update(x, y, z, grid, updates) {
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    const xn = pos_mod(x+xoff, grid.shape[0]);
                    const yn = pos_mod(y+yoff, grid.shape[1]);
                    const zn = pos_mod(z+zoff, grid.shape[2]); 

                    const i = grid.xyz_to_i(xn, yn, zn);
                    updates.add(i);
                    // updates[i] = true;
                }
            }
        }
    }
}

class VonNeumanNeighbour {
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
        this.max_neighbours = 6;
    }

    count_neighbours(x, y, z, grid, rule) {
        let total_neighbours = 0;

        for (let off of this.offsets) {
            const xn = pos_mod(x+off[0], grid.shape[0]);
            const yn = pos_mod(y+off[1], grid.shape[1]);
            const zn = pos_mod(z+off[2], grid.shape[2]); 

            const i = grid.xyz_to_i(xn, yn, zn);

            const state = grid.cells[i]; 
            if (rule.is_neighbour(state)) 
                total_neighbours += 1;
        }

        return total_neighbours;
    }

    on_location_update(x, y, z, grid, updates) {
        let i = grid.xyz_to_i(x, y, z);
        updates.add(i);
        // updates[i] = true;

        for (let off of this.offsets) {
            const xn = pos_mod(x+off[0], grid.shape[0]);
            const yn = pos_mod(y+off[1], grid.shape[1]);
            const zn = pos_mod(z+off[2], grid.shape[2]); 

            i = grid.xyz_to_i(xn, yn, zn);
            updates.add(i);
            // updates[i] = true;
        }
    }
}


function pos_mod(n, m) {
    return (((n % m) + m) % m);
}

const Moore = new MooreNeighbour();
const VN = new VonNeumanNeighbour();

export class Neighbour {
    static Create(type) {
        switch (type) {
            case 'M':
                return Moore;
            case 'VN':
                return VN;
            default:
                throw new Error(`Unknown neighbour type: ${type}`);
        }
    }
}
