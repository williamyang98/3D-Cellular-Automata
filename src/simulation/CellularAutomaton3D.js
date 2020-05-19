export class CellularAutomaton3D {
    constructor(shape) {
        this.shape = shape;
        this.count = 1;
        this.shape.forEach(n => this.count *= n); 

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

        for (let listener of this.listeners) 
            listener(this);
    }

    step(rule) {
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let i  = this.xyz_to_i(x, y, z);
                    let state = this.cells[i];
                    let neighbours = this.get_neighbours(x, y, z, rule);
                    let next_state = rule.get_next_state(state, neighbours);
                    this.buffer[i] = next_state; 
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
        let total_neighbours = 0;

        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0) 
                        continue;

                    let xn = this.pos_mod(x+xoff, this.shape[0]);
                    let yn = this.pos_mod(y+yoff, this.shape[1]);
                    let zn = this.pos_mod(z+zoff, this.shape[2]);
                    let i = this.xyz_to_i(xn, yn, zn);

                    let state = this.cells[i];

                    if (rule.is_neighbour(state)) {
                        total_neighbours += 1;
                    }
                }
            }
        }
    
        return total_neighbours;
    }

    xyz_to_i(x, y, z) {
        const Y = this.shape[1];
        const Z = this.shape[1]*this.shape[0];
        return x + y*Y + z*Z;
    }

    pos_mod(n, m) {
        return ((n % m) + m) % m;
    }
};