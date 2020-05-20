export class SeedCrystal {
    constructor(density=0.2, radius=0.1) {
        this.radius = radius;
        this.density = density;
        this.alive_state = 0;
        this.dead_state = 0;
    }

    randomise(sim) {
        let [lower, upper] = [Math.max(0.5-this.radius, 0.0), Math.min(0.5+this.radius, 1.0)];

        let X = sim.shape[0]-1;
        let Y = sim.shape[1]-1;
        let Z = sim.shape[2]-1;

        let [xlower, xupper] = [Math.floor(X*lower), Math.ceil(X*upper)];
        let [ylower, yupper] = [Math.floor(Y*lower), Math.ceil(Y*upper)];
        let [zlower, zupper] = [Math.floor(Z*lower), Math.ceil(Z*upper)];


        for (let x = xlower; x <= xupper; x++) {
            for (let y = ylower; y <= yupper; y++) {
                for (let z = zlower; z <= zupper; z++) {
                    let i = sim.xyz_to_i(x, y, z);
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