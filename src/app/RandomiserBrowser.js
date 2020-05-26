import { SeedCrystal, SeedCrystalAbsolute } from "../simulation/Randomiser3D";

export class RandomiserBrowser {
    constructor() {
        this.randomisers = [
            {name: 'Seed Crystal',          instance: new SeedCrystal()},
            {name: 'Seed Crystal Absolute', instance: new SeedCrystalAbsolute()},
        ];

        this.selected_index = 0;
    }

    select(index) {
        this.selected_index = index;
    }

    set_params(params) {
        let entry = this.selected_randomiser;
        let randomiser = entry.instance;
        randomiser.update(params);
    }

    get selected_randomiser() {
        return this.randomisers[this.selected_index];
    } 
}