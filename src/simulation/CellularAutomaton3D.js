export class CellularAutomaton3D {
    constructor(shape) {
        this.shape = shape;
        this.count = 1;
        this.shape.forEach(n => this.count *= n); 

        this.xyz_to_idx = [shape[1], shape[2]*shape[1]];

        this.cells = new Uint8Array(this.count);
        this.buffer = new Uint8Array(this.count);

        this.listeners = new Set();
    }

    listen_step(listener) {
        return this.listeners.add(listener);
    }

    unlisten_step(listener) {
        return this.listeners.delete(listener);
    }

    clear() {
        this.cells.fill(0, 0, -1);
        this.buffer.fill(0, 0, -1);

        for (let listener of this.listeners) listener(this);
    }

    step(rule) {
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let idx = this.calculate_index(x, y, z);
                    let state = this.cells[idx];
                    let neighbours = this.get_neighbours(x, y, z, rule);
                    
                    let next_state = rule.get_next_state(state, neighbours);
                    this.buffer[idx] = next_state; 
                }
            }
        }
        let tmp = this.cells;
        this.cells = this.buffer;
        this.buffer = tmp; 

        for (let listener of this.listeners) {
            listener(this);
        }
    }

    get_neighbours(x, y, z, rule) {
        let i = 0;
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0) 
                        continue;

                    let idx = this.calculate_index(
                        this.pos_mod(x+xoff, this.shape[0]), 
                        this.pos_mod(y+yoff, this.shape[1]), 
                        this.pos_mod(z+zoff, this.shape[2]));
                    let state = this.cells[idx];
                    if (rule.is_neighbour(state)) {
                        i += 1;
                    }
                }
            }
        }
        return i;
    }

    calculate_index(x, y, z) {
        return x + y*this.xyz_to_idx[0] + z*this.xyz_to_idx[1];
    }

    pos_mod(n, m) {
        return ((n % m) + m) % m;
    }
};