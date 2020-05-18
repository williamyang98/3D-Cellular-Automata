export class Rule3D {
    constructor(remain_alive, become_alive, total_states) {
        this.remain_alive = remain_alive;
        this.become_alive = become_alive;
        this.total_states = total_states;
        this.alive_state = this.total_states-1;
        this.dead_state = 0;
    }

    get_next_state(state, neighbours) {
        // refractory
        if (state > this.dead_state && state < this.alive_state) {
            return state-1;
        }
        // alive to dead
        if (state === this.total_states-1) {
            if (!this.remain_alive(neighbours)) {
                return state-1;
            } else {
                return state;
            }
        }
        // dead to alive
        if (state === this.dead_state && this.become_alive(neighbours)) {
            return this.alive_state;
        }
        // remain dead
        return state;
    }

    is_neighbour(state) {
        return (state === this.alive_state);
    }
}