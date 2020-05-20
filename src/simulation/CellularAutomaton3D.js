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
        this.cells.fill(0, 0, this.count);
        this.buffer.fill(0, 0, this.count);
        this.should_update.clear();
        this.should_update_buffer.clear();
        this.remove_queue = [];
    }

    seed_updates(rule) {
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let i = this.xyz_to_i(x, y, z);
                    if (this.cells[i] === rule.dead_state) {
                        this.should_update.delete(i);
                        continue;
                    }
                    
                    rule.on_location_update(x, y, z, this.shape, this.should_update);
                }
            }
        }
    }

    step(rule) {
        let start = performance.now();

        for (let i of this.should_update) {
            let state = this.cells[i];
            let [x, y, z] = this.i_to_xyz[i];
            let neighbours = rule.count_neighbours(x, y, z, this.shape, this.cells);
            let next_state = rule.get_next_state(state, neighbours);
            this.buffer[i] = next_state; 

            if (next_state === state) {
                this.remove_queue.push(i);
            } else {
                rule.on_location_update(x, y, z, this.shape, this.should_update_buffer);
            }
        }

        // rerender with changes
        for (let listener of this.listeners) {
            listener(this);
        }

        // swap buffers
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

        let end = performance.now();
        console.log(this.should_update.size, end-start);
    }

    xyz_to_i(x, y, z) {
        return x + y*this.xyz_to_i_coefficients[0] + z*this.xyz_to_i_coefficients[1];
    }
};

