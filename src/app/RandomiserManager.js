import { SeedCrystal, SeedCrystalAbsolute } from "../simulation/Randomiser3D";

export class RandomiserManager {
    constructor() {
        this.randomisers = [];

        this.add_randomiser(new SeedCrystal());
        this.add_randomiser(new SeedCrystalAbsolute());

        this.selected_index = 0;
    }

    add_randomiser(randomiser) {
        this.randomisers.push({
            name: randomiser.type,
            instance: randomiser
        });
    }

    select_randomiser(randomiser) {
        let randomisers = this.randomisers.map((v, i) => [v, i]);
        let entries = randomisers.filter(([entry, i]) => entry.instance.type === randomiser.type);
        let other_rands = entries.map(([entry, i]) => [entry.instance, i]);
        other_rands.forEach(([rand, i]) => {
            let params = {};
            Object.entries(randomiser.params).forEach(([key, adjustable]) => {
                params[key] = adjustable.value;
            });
            rand.update(params);
            this.select(i);
        });
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
        return this.randomisers[this.selected_index].instance;
    } 
}