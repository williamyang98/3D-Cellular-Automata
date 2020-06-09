import  { Slider } from '../ui/AdjustableValues';

class Randomiser {
    constructor(params={}) {
        this.params = params;
    }

    update(params) {
        for (let key in params) {
            let value = params[key];
            this.params[key].value = value;
        }

        this.params = {...this.params};
    }
}

export class SeedCrystal extends Randomiser {
    constructor(density=0.2, radius=0.1) {
        super({
            density: new Slider(0, 1, density), 
            radius: new Slider(0, 0.5, radius)
        });
        this.type = 'Seed Crystal';
        this.alive_state = 1.0;
        this.dead_state = 0;
    }

    randomise(grid, rule) {
        const radius = this.params.radius.value;
        const density = this.params.density.value; 

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
                    if (Math.random() < density) {
                        grid.cells[i] = this.alive_state;
                        rule.on_location_update(x, y, z, grid, rule)
                    } else {
                        // grid.cells[i] = this.dead_state;
                    }
                }
            }
        }
    }
}

export class SeedCrystalAbsolute extends Randomiser {
    constructor(density=0.2, radius=3) {
        super({
            density: new Slider(0, 1, density), 
            radius: new Slider(0, 100, radius)
        });
        this.type = 'Seed Crystal Absolute';
        this.alive_state = 1.0;
        this.dead_state = 0;
    }

    randomise(grid, rule) {
        const radius = this.params.radius.value;
        const density =  this.params.density.value;

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
                    if (Math.random() < density) {
                        grid.cells[i] = this.alive_state;
                        rule.on_location_update(x, y, z, grid, rule)
                    } else {
                        // sim.cells[i] = this.dead_state;
                    }
                }
            }
        }
    }
}


