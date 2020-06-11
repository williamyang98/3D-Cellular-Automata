import { SeedCrystalSerialized, SeedCrystalAbsoluteSerialized } from "../simulation/Serialised";

export class RandomiserManager {
    constructor() {
        this.entries = [];

        this.add_randomiser(new SeedCrystalSerialized());
        this.add_randomiser(new SeedCrystalAbsoluteSerialized());

        this.current_index = 0;
        this.listeners = new Set();
    }

    listen_select(listener) {
        this.listeners.add(listener);
    }

    notify(randomiser) {
        for (let listener of this.listeners) {
            listener(randomiser);
        }
    }

    add_randomiser(randomiser) {
        this.entries.push(randomiser);
    }

    update_randomiser(randomiser) {
        let {type, params} = randomiser;
        for (let i = 0; i < this.entries.length; i++) {
            let other = this.entries[i];
            if (other.type !== type) continue;

            for (let key in params) {
                other.params[key].value = params[key].value;
            }
            other.params = {...other.params};
            this.current_index = i;
            break;
        }
    }

    update_current(key, value) {
        let param = this.current_randomiser.params[key];
        param.value = value;
        this.current_randomiser.params = {...this.current_randomiser.params}; // force update react
    }

    select(index) {
        this.current_index = index;
        this.notify(this.current_randomiser);
    }

    get current_randomiser() {
        return this.entries[this.current_index];
    } 
}