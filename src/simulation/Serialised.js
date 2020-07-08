import  { Slider } from '../ui/util/AdjustableValues';
/**
 * Serialisation for web worker
 */


class SerializedRandomiser {
    constructor(type, params) {
        this.type = type;
        this.params = params;
    }

    to_json() {
        let params = {};
        for (let key in this.params) {
            params[key] = this.params[key].value;
        }
        return {
            type: this.type,
            params: params 
        };
    }
}

export class SeedCrystalSerialized extends SerializedRandomiser {
    constructor(density=0.2, radius=0.1) {
        super('Seed Crystal', {
            density: new Slider(0, 1, density, "Amount of region to fill"),
            radius: new Slider(0, 0.5, radius, "Radius of cube to fill (Relative to size of 3D grid)"),
        });
    }
}

export class SeedCrystalAbsoluteSerialized extends SerializedRandomiser {
    constructor(density=0.2, radius=3) {
        super('Seed Crystal Absolute', {
            density: new Slider(0, 1, density, "Amount of region to fill"),
            radius: new Slider(0, 100, radius, "Radius of cube to fill (Number of cells for radius)"),
        });
    }
}

export class RuleSerialized {
    constructor(remain, become, total_states, neighbour) {
        this.remain = remain;
        this.become = become;
        this.total_states = total_states;
        this.neighbour = neighbour;
    }

    to_json() {
        return this;
    }
}

export class NeighbourSerialized {
    constructor(type, max) {
        this.type = type;
        this.max = max;
    }
    
    to_json() {
        return this;
    }
}