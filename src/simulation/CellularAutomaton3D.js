export class CellularAutomaton3D {
    constructor(shape) {
        this.shape = shape;
        this.count = 1;
        this.shape.forEach(n => this.count *= n); 

        this.xyz_to_i_coefficients = [this.shape[0], this.shape[1]*this.shape[0]];
        this.cells = new Uint8Array(this.count);
        this.buffer = new Uint8Array(this.count);

        this.should_update = new Set();
        this.should_update_buffer = new Set();
        this.remove_queue = [];

        this.listeners = new Set();

        this.i_to_xyz = new Array(this.count);
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let i = this.xyz_to_i(x, y, z);
                    this.i_to_xyz[i] = [x, y, z];
                }
            }
        }

    }

    listen_rerender(listener) {
        this.listeners.add(listener);
    }

    clear() {
        this.cells.fill(0, 0, -1);
        this.buffer.fill(0, 0, -1);
        this.should_update.clear();
        this.should_update_buffer.clear();
        this.remove_queue = [];
    }

    seed_updates(rule) {
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let i = this.xyz_to_i(x, y, z);
                    if (this.cells[i] !== rule.dead_state) {
                        this.update_neighbours(x, y, z);
                    }
                }
            }
        }

        let tmp = this.should_update;
        this.should_update = this.should_update_buffer;
        this.should_update_buffer = tmp;
    }

    // O(n^3)
    refresh_updates(rule) {
        for (let i of this.should_update) {
            let [x, y, z] = this.i_to_xyz[i];
            if (this.cells[i] == rule.alive_state)
                this.update_neighbours(x, y, z);
        }
    }

    update_neighbours(x, y, z) {
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    const xn = this.pos_mod(x+xoff, this.shape[0]);
                    const yn = this.pos_mod(y+yoff, this.shape[1]);
                    const zn = this.pos_mod(z+zoff, this.shape[2]);
                    const i = this.xyz_to_i(xn, yn, zn);
                    this.should_update_buffer.add(i);
                }
            }
        }
    }

    step(rule) {
        for (let i of this.should_update) {
            let state = this.cells[i];
            let neighbours = 0; 
            let [x, y, z] = this.i_to_xyz[i];
            neighbours = this.get_neighbours(x, y, z, rule)

            let next_state = rule.get_next_state(state, neighbours);
            this.buffer[i] = next_state; 

            if (next_state == state) {
                this.remove_queue.push(i);
            } else {
                this.update_neighbours(x, y, z);
            }
        }

        // rerender with changes
        for (let listener of this.listeners) {
            listener(this);
        }

        let tmp = this.cells;
        this.cells = this.buffer;
        this.buffer = tmp;

        while (this.remove_queue.length > 0) {
            let i = this.remove_queue.pop();
            this.should_update.delete(i);
        }

        let tmp_update = this.should_update;
        this.should_update = this.should_update_buffer;
        this.should_update_buffer = tmp_update;

        console.log(this.should_update.size);
    }

    get_neighbours(x, y, z, rule) {
        let total_neighbours = 0;

        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    if (xoff === 0 && yoff === 0 && zoff === 0) 
                        continue;

                    const xn = this.pos_mod(x+xoff, this.shape[0]);
                    const yn = this.pos_mod(y+yoff, this.shape[1]);
                    const zn = this.pos_mod(z+zoff, this.shape[2]);
                    const i = this.xyz_to_i(xn, yn, zn);

                    const state = this.cells[i];

                    if (rule.is_neighbour(state)) {
                        total_neighbours += 1;
                    }
                }
            }
        }
    
        return total_neighbours;
    }

    xyz_to_i(x, y, z) {
        return x + y*this.xyz_to_i_coefficients[0] + z*this.xyz_to_i_coefficients[1];
    }

    pos_mod(n, m) {
        return ((n % m) + m) % m;
    }
};


class PTimer {
    constructor() {
        this.t1 = 0;
        this.t2 = 0;   
    }

    start() {
        this.t1 = performance.now();
    }

    end() {
        this.t2 = performance.now();
        let dt = this.t2-this.t1;
        return dt;
    }
}

class Stack {
    constructor(size) {
        // this.i = 0;
        // this.buffer = new Array(size);
        this.buffer = [];
        // this.size = size;
    }

    push(data) {
        this.buffer.push(data);
        // this.buffer[this.i] = data;
        // this.i++;
    }

    pop() {
        return this.buffer.pop();
        // return this.buffer[this.i--];
    }

    clear() {
        this.buffer = [];
        // this.i = 0;
    }
}