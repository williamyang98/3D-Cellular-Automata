export class Randomiser {
    constructor(params={}) {
        this.params = params;
    }

    static Create(type, params) {
        switch (type) {
            case 'Seed Crystal':
                return new SeedCrystal(params);
            case 'Seed Crystal Absolute':
                return new SeedCrystalAbsolute(params);
            default:
                throw new Error(`Invalid randomiser type: ${type}`);
        }
    }
}

class SeedCrystal extends Randomiser {
    randomise(grid, rule) {
        let {radius, density} = this.params;

        let [lower, upper] = [
            Math.max(0.5-radius, 0.0),  
            Math.min(0.5+radius, 1.0)];

        let X = grid.shape[0]-1;
        let Y = grid.shape[1]-1;
        let Z = grid.shape[2]-1;

        let [xlower, xupper] = [Math.floor(X*lower), Math.ceil(X*upper)];
        let [ylower, yupper] = [Math.floor(Y*lower), Math.ceil(Y*upper)];
        let [zlower, zupper] = [Math.floor(Z*lower), Math.ceil(Z*upper)];


        for (let x = xlower; x <= xupper; x++) {
            for (let y = ylower; y <= yupper; y++) {
                for (let z = zlower; z <= zupper; z++) {
                    let i = grid.xyz_to_i(x, y, z);
                    let state = grid.cells[i];
                    if (state === rule.alive_state) {
                        continue;
                    }
                    if (Math.random() < density) {
                        grid.cells[i] = rule.alive_state;
                        rule.add(x, y, z, grid);
                    } else {
                        // grid.cells[i] = this.dead_state;
                    }
                }
            }
        }
    }
}

class SeedCrystalAbsolute extends Randomiser {
    randomise(grid, rule) {
        let {radius, density} = this.params;

        let X = Math.floor(grid.shape[0]/2);
        let Y = Math.floor(grid.shape[1]/2);
        let Z = Math.floor(grid.shape[2]/2);

        let [xlower, xupper] = [Math.max(X-radius, 0), Math.min(X+radius, grid.shape[0]-1)];
        let [ylower, yupper] = [Math.max(Y-radius, 0), Math.min(Y+radius, grid.shape[1]-1)];
        let [zlower, zupper] = [Math.max(Z-radius, 0), Math.min(Z+radius, grid.shape[2]-1)];

        for (let x = xlower; x <= xupper; x++) {
            for (let y = ylower; y <= yupper; y++) {
                for (let z = zlower; z <= zupper; z++) {
                    let i = grid.xyz_to_i(x, y, z);
                    let state = grid.cells[i];
                    if (state === rule.alive_state) {
                        continue;
                    }
                    if (Math.random() < density) {
                        grid.cells[i] = rule.alive_state;
                        rule.add(x, y, z, grid)
                    } else {
                        // sim.cells[i] = this.dead_state;
                    }
                }
            }
        }
    }
}


