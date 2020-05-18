export class RandomDensity {
    constructor(density=0.2) {
        this.density = density;
        this.alive_state = 0;
        this.dead_state = 0;
    }

    randomise(sim) {
        let cells = sim.cells;
        for (let i = 0; i < cells.length; i++) {
            if (Math.random() < this.density) {
                cells[i] = this.alive_state; 
            } else {
                cells[i] = this.dead_state;
            }
        }
    }
}

export class SeedCrystal {
    constructor(density=0.2, radius=0.1) {
        this.radius = radius;
        this.density = density;
        this.alive_state = 0;
        this.dead_state = 0;
    }

    randomise(sim) {
        let [lower, upper] = [pos_mod(0.5-this.radius, 1.0), pos_mod(0.5+this.radius, 1.0)];

        let [xlower, xupper] = [Math.floor(sim.shape[0]*lower), Math.floor(sim.shape[0]*upper)];
        let [ylower, yupper] = [Math.floor(sim.shape[1]*lower), Math.floor(sim.shape[1]*upper)];
        let [zlower, zupper] = [Math.floor(sim.shape[2]*lower), Math.floor(sim.shape[2]*upper)];


        for (let x = xlower; x < xupper; x++) {
            for (let y = ylower; y < yupper; y++) {
                for (let z = zlower; z < zupper; z++) {
                    let i = sim.calculate_index(x, y, z);
                    if (Math.random() < this.density) {
                        sim.cells[i] = this.alive_state;
                    } else {
                        sim.cells[i] = this.dead_state;
                    }
                }
            }
        }
    }
}

function pos_mod(a, b) {
    return ((a % b) + b) % b;
}