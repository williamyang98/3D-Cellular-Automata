import { Neighbour } from './Neighbours3D';

export class Rule3D {
    static Create(remain, become, total_states, neighbour) {
        neighbour = Neighbour.Create(neighbour);
        return new Rule3D(remain, become, total_states, neighbour);
    }

    constructor(remain_alive, become_alive, total_states, neighbours) {
        this.remain_alive = remain_alive;
        this.become_alive = become_alive;
        this.total_states = total_states;

        this.alive_state = 255;
        this.dead_state = 0;

        this.neighbours = neighbours;

        let delta = (this.alive_state-this.dead_state)/(this.total_states-1);
        delta = Math.floor(delta);

        this.alive_threshold = Math.floor(this.alive_state-delta);
        this.dead_threshold = Math.floor(delta);
        this.delta = delta;
    }

    update(grid, listener) {
        let {cells, neighbours, updates, render_updates} = grid;

        let completed_blocks = 0;
        let remove_stack = [];
        let sub_stack = [];
        let add_stack = [];
        let refactory_stack = [];

        function complete(total) {
            completed_blocks += total;
            listener(completed_blocks);
        }

        for (let i of updates) {
            let ncount = neighbours[i];
            let state = cells[i];
            let next_state = this.get_next_state(state, ncount); 
            cells[i] = next_state;

            // cell is still fresh, we want to update it next tick
            // we only update when neighbours change, and this only occurs when
            // dead to alive, or alive to refactory/dead
            // refractory cells do not affect neighbour count, but still require updating 
            // an update has occured, therefore we update the neighbour and updates set

            // alive to refactory/dead
            if (this.is_alive(state) && !this.is_alive(next_state)) {
                sub_stack.push(i);
            // dead to alive
            } else if (this.is_dead(state) && this.is_alive(next_state)) {
                add_stack.push(i);
            // refactory
            } else if (state !== next_state) {
                refactory_stack.push(i);
            // cell is stale, remove from update list
            } else {
                remove_stack.push(i);
            }
        }

        for (let i of remove_stack) {
            updates.delete(i);
        }
        complete(remove_stack.length);

        for (let i of refactory_stack) {
            // updates.add(i);
            render_updates.add(i);
        }
        complete(refactory_stack.length);

        for (let i of add_stack) {
            let [x, y, z] = grid.i_to_xyz(i);
            this.add(x, y, z, grid);
        }
        complete(add_stack.length);

        for (let i of sub_stack) {
            let [x, y, z] = grid.i_to_xyz(i);
            this.sub(x, y, z, grid);
        }
        complete(sub_stack.length);
    }

    get_next_state(state, neighbours) {
        // alive to dead
        if (this.is_alive(state)) {
            if (!this.remain_alive[neighbours]) {
                let next = state-this.delta;
                return this.is_dead(next) ? 0 : next;
            } else {
                return this.alive_state;
            }
        }
        // dead to alive
        if (this.is_dead(state)) {
            if (this.become_alive[neighbours]) {
                return this.alive_state;
            } else {
                // if we changed rules, then state may not always be 0
                return this.dead_state;
            }
        }
        // refractory
        let next = state-this.delta;
        return this.is_dead(next) ? 0 : next;
    }

    add(x, y, z, grid) {
        this.neighbours.add(x, y, z, grid);
    }

    sub(x, y, z, grid) {
        this.neighbours.sub(x, y, z, grid);
    }

    is_alive(state) {
        return (state > this.alive_threshold);
    }

    is_dead(state) {
        return (state < this.dead_threshold);
    }
}