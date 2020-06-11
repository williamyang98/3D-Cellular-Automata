import { Grid3D } from './Grid3D';
import { Randomiser } from './Randomiser3D';
import { Rule3D } from './Rule3D';

// state machine
export class Engine {
    constructor() {
        this.listeners = new Set();
        this.total_steps = 0;
        this.running = false;
        this.requested_step = false;

        this.completed_frame = false;
        this.grid_available = true;
        this.local_rerender = false;

        this.tasks = {
            clear:     {callback: () => this.clear(), queued: false},
            randomise: {callback: () => this.randomise(), queued: false},
            set_shape: {callback: () => {}, queued: false},
        }
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

    get_frame() {
        if (!this.grid) {
            return undefined;
        }
        if (!this.completed_frame) {
            return undefined;
        }

        this.completed_frame = false;
        this.grid_available = false;

        let local = this.local_rerender;
        this.local_rerender = true;

        return {grid:this.grid, local};
    }

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    run() {
        this.loop();
    }

    loop() {
        const dt = 15;

        for (let key in this.tasks) {
            let task = this.tasks[key];
            if (task.queued) task.callback();
        }

        if (this.grid_available && (this.running || this.requested_step)) {
            this.calculate_frame();
            this.requested_step = false;
        }

        setTimeout(() => this.loop(), dt);
    }

    step() {
        this.requested_step = true;
    }

    set_shape(shape) {
        // if grid is still being used, then queue it
        if (this.grid && !this.grid_available) {
            this.tasks.set_shape.queued = true;
            this.tasks.set_shape.callback = () => this.set_shape(shape);
            return;
        }
        this.tasks.set_shape.queued = false;
        this.tasks.set_shape.callback = () => {};

        this.grid = Grid3D.Create(shape);
        this.total_steps = 0;
        this.notify({total_steps: this.total_steps, total_blocks: 0, completed_blocks: 0, frame_time: 0});
        this.completed_frame = true;
        this.local_rerender = false;
    }

    set_grid(grid) {
        this.grid = new Grid3D(grid);
        this.grid_available = true;
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
        if (!this.grid || !this.grid_available) {
            this.tasks.clear.queued = true;
            return;
        }
        this.tasks.clear.queued = false;

        let {cells, cells_buffer, neighbours, updates, updates_buffer, render_updates} = this.grid;
        let count = this.grid.count;
        cells.fill(0, 0, count);
        cells_buffer.fill(0, 0, count);
        neighbours.fill(0, 0, count);
        updates.clear();
        updates_buffer.clear();
        render_updates.clear();

        this.total_steps = 0;
        this.notify({total_steps: this.total_steps, total_blocks: 0, completed_blocks: 0, frame_time: 0});
        this.completed_frame = true;
        this.local_rerender = false;
    }

    randomise() {
        if (!this.randomiser) return;
        if (!this.rule) return;
        if (!this.grid || !this.grid_available) {
            this.tasks.randomise.queued = true;
            return;
        };
        this.tasks.randomise.queued = false;

        this.randomiser.randomise(this.grid, this.rule);
        let total_blocks = this.grid.updates.size;

        this.notify({total_blocks, completed_blocks:0});
        this.completed_frame = true;
        this.local_rerender = this.local_rerender && true;
    }

    calculate_frame() {
        let grid = this.grid;
        let rule = this.rule;
        if (!grid) return;
        if (!rule) return;

        this.grid_available = false;

        let {cells, cells_buffer, neighbours, updates, updates_buffer, render_updates} = grid;

        let total_blocks = updates.size;
        let completed_blocks = 0;
        this.notify({total_blocks, completed_blocks});

        let remove_stack = [];
        let start_dt = performance.now();

        // let xyz = [0,0,0];
        for (let i of updates) {
            let [x, y, z] = grid.i_to_xyz(i);
            // grid.i_to_xyz_inplace(i, xyz);
            // let [x,y,z] = xyz;

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

        this.completed_frame = true;
        this.grid_available = true;
        this.local_rerender = this.local_rerender && true;
    }
};