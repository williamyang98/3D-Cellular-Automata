export class Rule3D {
    constructor(remain_alive, become_alive, total_states, neighbours) {
        this.remain_alive = remain_alive;
        this.become_alive = become_alive;
        this.total_states = total_states;
        // this.alive_state = this.total_states-1;
        this.alive_state = 1.0;
        this.dead_state = 0;
        this.delta = (this.alive_state-this.dead_state)/(this.total_states-1);
        
        this.neighbours = neighbours;
    }

    count_neighbours(x, y, z, shape, cells) {
        return this.neighbours.count_neighbours(x, y, z, shape, cells, this);
    }

    on_location_update(x, y, z, shape, buffer) {
        this.neighbours.on_location_update(x, y, z, shape, buffer);
    }

    get_next_state(state, neighbours) {
        // refractory
        if (state >= this.delta && state < this.alive_state) {
            return state-this.delta;
        }
        // alive to dead
        if (state === this.alive_state) {
            if (!this.remain_alive(neighbours)) {
                return state-this.delta;
            } else {
                return state;
            }
        }
        // dead to alive
        if (state < this.delta && this.become_alive(neighbours)) {
            return this.alive_state;
        }
        // remain dead
        return state;
    }

    is_neighbour(state) {
        return (state === this.alive_state);
    }
}