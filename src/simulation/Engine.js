import { Grid3D } from './Grid3D';
import { Randomiser } from './Randomiser3D';
import { Rule3D } from './Rule3D';

// state machine
export class Engine {
    constructor() {
        this.listeners = new Set();
        this.total_steps = 0;
    }

    attach_listener(listener) {
        return this.listeners.add(listener);
    }

    remove_listener(listener) {
        return this.listeners.delete(listener);
    }

    notify(data) {
        for (let listener of this.listeners) {
            listener(data);
        }
    }

    set_shape(shape) {
        this.grid = Grid3D.Create(shape);
    }

    set_grid(grid) {
        this.grid = new Grid3D(grid);
    }

    set_rule(data) {
        let {remain, become, total_states, neighbour} = data;
        this.rule = Rule3D.Create(remain, become, total_states, neighbour);
    }

    set_randomiser(data) {
        let {type, params} = data;
        this.randomiser = Randomiser.Create(type, params);
    }

    clear() {
        if (!this.grid) throw new Error('Grid not initialized');
        let {cells, cells_buffer, updates, updates_buffer, neighbours} = this.grid;
        let count = this.grid.count;
        cells.fill(0, 0, count);
        cells_buffer.fill(0, 0, count);
        neighbours.fill(0, 0, count);
        updates.clear();
        updates_buffer.clear();
        this.total_steps = 0;
        this.notify({total_steps: this.total_steps, total_blocks: 0, completed_blocks: 0, frame_time: 0});
    }

    randomise() {
        if (!this.randomiser) throw new Error('Randomiser not set');
        this.randomiser.randomise(this.grid, this.rule);
        let total_blocks = this.grid.updates.size;
        this.notify({total_blocks, completed_blocks:0});
    }

    step() {
        let grid = this.grid;
        let rule = this.rule;
        if (!grid) throw new Error('Grid not initialized');
        if (!rule) throw new Error('Rule not initialized');

        let {cells, cells_buffer, updates, updates_buffer, neighbours} = grid;

        let total_blocks = updates.size;
        let completed_blocks = 0;
        this.notify({total_blocks, completed_blocks});

        let remove_stack = [];
        let start_dt = performance.now();

        for (let i of updates) {
            let [x, y, z] = grid.i_to_xyz(i);
            let ncount = rule.count_neighbours(x, y, z, grid);
            neighbours[i] = ncount;

            let state = cells[i];
            let next_state = rule.get_next_state(state, ncount);
            cells_buffer[i] = next_state;

            if (state === next_state) {
                remove_stack.push(i);
            } else {
                rule.on_location_update(x, y, z, grid, updates_buffer);
            }

            completed_blocks += 1;
            if (completed_blocks % 10000 === 0) {
                this.notify({completed_blocks});
            }
        }

        for (let i of remove_stack) {
            updates.delete(i);
        }

        grid.swap_buffers();

        this.total_steps += 1;
        let end_dt = performance.now();
        let frame_time = end_dt - start_dt;
        this.notify({total_steps: this.total_steps, frame_time, completed_blocks, total_blocks});
    }
};