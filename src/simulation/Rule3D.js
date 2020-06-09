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

        this.alive_threshold = Math.floor(this.alive_state-delta/2.0);
        this.dead_threshold = Math.floor(delta/2.0);
        this.delta = Math.floor(delta);
    }

    count_neighbours(x, y, z, grid) {
        return this.neighbours.count_neighbours(x, y, z, grid, this);
    }

    on_location_update(x, y, z, grid, updates) {
        this.neighbours.on_location_update(x, y, z, grid, updates);
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