export class Rule3D {
    constructor(remain_alive, become_alive, total_states, neighbours) {
        this.remain_alive = remain_alive;
        this.become_alive = become_alive;
        this.total_states = total_states;
        // this.alive_state = this.total_states-1;
        this.alive_state = 1.0;
        this.dead_state = 0;
        this.delta = (this.alive_state-this.dead_state)/(this.total_states-1);

        this.alive_threshold = this.alive_state-this.delta/2.0;
        this.dead_threshold = this.delta/2.0;
        
        this.neighbours = neighbours;
    }

    count_neighbours(x, y, z, grid) {
        return this.neighbours.count_neighbours(x, y, z, grid, this);
    }

    on_location_update(x, y, z, grid) {
        this.neighbours.on_location_update(x, y, z, grid);
    }

    get_next_state(state, neighbours) {
        // alive to dead
        if (this.is_alive(state)) {
            if (!this.remain_alive[neighbours]) {
                return state-this.delta;
            } else {
                return state;
            }
        }
        // dead to alive
        if (this.is_dead(state)) {
            if (this.become_alive[neighbours]) {
                return this.alive_state;
            } else {
                return state;
            }
        }
        // refractory
        return state-this.delta;
    }

    is_neighbour(state) {
        return (state === this.alive_state);
    }

    is_alive(state) {
        return (state > this.alive_threshold);
    }

    is_dead(state) {
        return (state < this.dead_threshold);
    }
}