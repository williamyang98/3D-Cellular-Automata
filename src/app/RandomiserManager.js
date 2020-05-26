import { SeedCrystal, SeedCrystalAbsolute } from "../simulation/Randomiser3D";

export class RandomiserManager {
    constructor() {
        this.entries = [];

        this.add_randomiser(new SeedCrystal());
        this.add_randomiser(new SeedCrystalAbsolute());

        this.selected_index = 0;
    }

    add_randomiser(randomiser) {
        this.entries.push({
            name: randomiser.type,
            instance: randomiser
        });
    }

    select_randomiser(randomiser) {
        let entries = this.entries.map((v, i) => [v, i]);
        let matching_entries = entries.filter(([entry, i]) => entry.instance.type === randomiser.type);
        let other_rands = matching_entries.map(([entry, i]) => [entry.instance, i]);
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
        let randomiser = this.selected_randomiser;
        randomiser.update(params);
    }

    get selected_randomiser() {
        return this.entries[this.selected_index].instance;
    } 
}