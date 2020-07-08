/**
 * Add or subtract neighbours from a grid
 * If a cell becomes alive, then surrounding cells gain a neighbour
 * If a cell dies or starts refracting, then surround cells lose a neighbour
 */
class NeighbourBase {
    constructor(max_neighbours) {
        this.max_neighbours = max_neighbours;
    }

    sub(x, y, z, grid) {

    }

    add(x, y, z, grid) {

    }
}

class MooreNeighbour extends NeighbourBase {
    constructor() {
        super(26);
    }

    sub(x, y, z, grid) {
        this.add(x, y, z, grid, -1);
    }

    add(x, y, z, grid, val=1) {
        let neighbours = grid.neighbours;
        let updates = grid.updates;
        let render_updates = grid.render_updates;

        let i = grid.xyz_to_i(x, y, z);
        updates.add(i);
        render_updates.add(i);

        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0)
                        continue;

                    const xn = pos_mod(x+xoff, grid.shape[0]);
                    const yn = pos_mod(y+yoff, grid.shape[1]);
                    const zn = pos_mod(z+zoff, grid.shape[2]); 

                    i = grid.xyz_to_i(xn, yn, zn);
                    neighbours[i] += val;
                    updates.add(i);
                    render_updates.add(i);
                }
            }
        }

    }
}

class VonNeumanNeighbour extends NeighbourBase {
    constructor() {
        super(6);
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

    sub(x, y, z, grid) {
        this.add(x, y, z, grid, -1);
    }

    add(x, y, z, grid, val=1) {
        let neighbours = grid.neighbours;
        let updates = grid.updates;
        let render_updates = grid.render_updates;

        let i = grid.xyz_to_i(x, y, z);
        updates.add(i);
        render_updates.add(i);

        for (let off of this.offsets) {
            const xn = pos_mod(x+off[0], grid.shape[0]);
            const yn = pos_mod(y+off[1], grid.shape[1]);
            const zn = pos_mod(z+off[2], grid.shape[2]); 

            i = grid.xyz_to_i(xn, yn, zn);
            neighbours[i] += val;
            updates.add(i);
            render_updates.add(i);
        }
    }
}


function pos_mod(n, m) {
    return (((n % m) + m) % m);
}

const Moore = new MooreNeighbour();
const VN = new VonNeumanNeighbour();

export class Neighbour {
    static Create(neighbour) {
        let type = neighbour.type;
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
