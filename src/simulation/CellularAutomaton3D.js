import worker from 'worker-loader!../workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax 

export class CellularAutomaton3D {
    constructor(shape, stats) {
        this.shape = shape;
        this.count = shape[0] * shape[1] * shape[2];
        this.stats = stats;

        this.xyz_to_i_coefficients = [this.shape[0], this.shape[1]*this.shape[0]];
        this.cells = new Float32Array(this.count);
        this.cells_buffer = new Float32Array(this.count);
        this.neighbours = new Uint8Array(this.count);

        this.should_update = new Set();
        this.should_update_buffer = new Set();
        this.remove_queue = [];

        this.listeners = new Set();

        this.current_slice = null;
        this.slice_size = 10000;
        this.total_steps = 0;

        this.worker = worker();
        this.promise = new TestPromise();

        this.worker.addEventListener('message', (event) => {
            if (event.data && event.data.length && event.data.length >= 2) {
                [this.cells, this.cells_buffer] = event.data;
                this.promise.emit();
            }
        });
    }

    listen_rerender(listener) {
        this.listeners.add(listener);
    }

    clear() {
        this.worker.postMessage([this.cells, this.cells_buffer, this.count], [this.cells.buffer, this.cells_buffer.buffer]);
        // this.worker.postMessage([this.cells_buffer, this.count], [this.cells_buffer.buffer]);
        // this.worker.clear_buffer(this.cells.buffer, this.count); 
        // this.worker.clear_buffer(this.cells_buffer.buffer, this.count); 
        // this.cells.fill(0, 0, this.count);
        // this.cells_buffer.fill(0, 0, this.count);
        this.neighbours.fill(0, 0, this.count);
        this.should_update.clear();
        this.should_update_buffer.clear();
        this.remove_queue = [];
        this.total_steps = 0;

        this.stats.recieve({
            completed_blocks: 0,
            total_blocks: 0,
            total_steps: 0,
        });

        return this.promise;
    }

    seed_updates(rule) {
        this.should_update.clear();
        for (let x = 0; x < this.shape[0]; x++) {
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    let i = this.xyz_to_i(x, y, z);
                    let state = this.cells[i];
                    // let neighbours = rule.count_neighbours(x, y, z, this.shape, this.cells);
                    // this.neighbours[i] = neighbours;

                    if (rule.is_neighbour(state)) {
                        rule.on_location_update(x, y, z, this.shape, this.should_update);
                    }
                }
            }
        }

        this.stats.recieve({
            completed_blocks: 0,
            total_blocks: this.should_update.size
        });
    }

    step(rule, complete=false) {
        if (this.current_slice === null) {
            this.current_slice = this.sliced_step(rule);
        }

        // forcefully iterate through all slices
        if (complete) {
            while (!this.current_slice.next().done) {

            }
            this.current_slice = null;
            return true;
        }

        // complete only one slice
        let res = this.current_slice.next();
        if (res.done) {
            this.current_slice = null;
        }
        return res.done;
    }

    *sliced_step(rule) {
        let start = performance.now();
        let cell_count = 0;

        let completed = 0;
        let total = this.should_update.size;

        this.stats.recieve({
            completed_blocks: completed,
            total_blocks: total
        });

        let slice_start = performance.now();
        for (let i of this.should_update) {
            let state = this.cells[i];
            let [x, y, z] = this.i_to_xyz(i);

            let neighbours = rule.count_neighbours(x, y, z, this.shape, this.cells);
            this.neighbours[i] = neighbours;

            let next_state = rule.get_next_state(state, neighbours);
            this.cells_buffer[i] = next_state; 

            if (next_state === state) {
                this.remove_queue.push(i);
            } else {
                rule.on_location_update(x, y, z, this.shape, this.should_update_buffer);
            }

            cell_count += 1;
            completed += 1;
            // slice size at 10000
            if (cell_count % this.slice_size === 0) {
                cell_count = 0;
                let now = performance.now();
                if (now-slice_start >= 16) {// aim for minimum of 60ms per update
                    this.stats.recieve({completed_blocks: completed});
                    // console.log(`${completed} / ${total}`);
                    yield;
                    slice_start = performance.now();
                }
            }
        }

        this.total_steps += 1;

        this.stats.recieve({
            completed_blocks: completed,
            total_steps: this.total_steps,
        });

        // swap buffers
        let tmp = this.cells;
        this.cells = this.cells_buffer;
        this.cells_buffer = tmp;

        while (this.remove_queue.length > 0) {
            let i = this.remove_queue.pop();
            this.should_update.delete(i);
        }

        let tmp_update = this.should_update;
        this.should_update = this.should_update_buffer;
        this.should_update_buffer = tmp_update;

        let end = performance.now();
        let dt = end-start;
        // console.log(this.should_update.size, end-start);
        this.stats.recieve({frame_time: dt});

        // rerender with changes
        for (let listener of this.listeners) {
            listener(this);
        }
        return;
    }

    xyz_to_i(x, y, z) {
        return x + y*this.xyz_to_i_coefficients[0] + z*this.xyz_to_i_coefficients[1];
    }

    i_to_xyz(i) {
        let z = Math.floor(i / this.xyz_to_i_coefficients[1]);
        i = i-z*this.xyz_to_i_coefficients[1];
        let y = Math.floor(i / this.xyz_to_i_coefficients[0]);
        let x = i-y*this.xyz_to_i_coefficients[0];
        return [x, y, z];
    }
};

class TestPromise {
    constructor() {
        this.listeners = new Set();
    }

    emit(val) {
        for (let listener of this.listeners) {
            listener(val);
        }
        this.listeners = new Set();
    }

    then(lambda) {
        this.listeners.add(lambda);
    }
}
