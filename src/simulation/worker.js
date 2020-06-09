import { Grid3D } from "./Grid3DWrapper";

onmessage = (ev) => {
    let {grid, id, action, data} = ev.data;
    try {
        switch (action) {
            case 'clear':
                clear_grid(grid);
                break;
            case 'randomise':
                console.log(data.randomiser);
                randomise_grid(grid, data.randomiser, data.rule);
                break;
            default:
                break;
        }
        postMessage({grid, id, action}, grid.transferables);
    } catch (ex) {
        postMessage({grid, id, action, err: ex}, grid.transferables);
    }
}

function clear_grid(grid) {
    let {cells, cells_buffer, should_update, neighbours} = grid;
    for (let i = 0; i < grid.count; i++) {
        cells[i] = 0; 
        cells_buffer[i] = 0; 
        neighbours[i] = 0; 
        should_update[i] = false;
    }
}

function randomise_grid(grid, randomiser, rule) {
    grid = new Grid3D(grid);
    switch (randomiser.type) {
        case 'Seed Crystal':
            return relative_randomiser(grid, randomiser, rule);
        case 'Seed Crystal Absolute':
            return absolute_randomiser(grid, randomiser, rule);
    }
}

function relative_randomiser(grid, randomiser, rule) {
    const radius = randomiser.params.radius._value;
    const density = randomiser.params.density._value; 

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
                    grid.cells[i] = randomiser.alive_state;
                    grid.should_update[i] = true;
                    // rule.on_location_update(x, y, z, grid, rule)
                } else {
                    // grid.cells[i] = this.dead_state;
                }
            }
        }
    }
}

function absolute_randomiser(grid, randomiser, rule) {
    const radius = randomiser.params.radius._value;
    const density =  randomiser.params.density._value;

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
                    grid.cells[i] = randomiser.alive_state;
                    grid.should_update[i] = true;
                    // rule.on_location_update(x, y, z, grid, rule)
                } else {
                    // sim.cells[i] = this.dead_state;
                }
            }
        }
    }
}

