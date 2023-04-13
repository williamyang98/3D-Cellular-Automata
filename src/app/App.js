import { Simulation } from './simulation/simulation.js';
import { Randomiser_List } from './randomisers/randomiser_list.js';
import { Entry } from './entries/entry.js';
import { system_entries } from './entries/system_entries.js';
import { User_Entries_List } from './entries/user_entries_list.js';

class App {
    constructor() {
        this.simulation = new Simulation();
        this.randomiser_list = new Randomiser_List();

        this.system_entries = system_entries;
        this.user_entries_list = new User_Entries_List();
        this.user_entries_list.load_from_cache();

        this.simulation.set_randomiser_params_getter(
            (absolute_size) => {
                return this.randomiser_list.get_volume_params(absolute_size);
            }
        );

        this.current_entry = null; 
    }

    init_default = () => {
        this.simulation.set_size(128, 128, 128);
        this.select_entry(this.system_entries[1]);
        this.simulation.randomise();
    }

    /**
     * @param {Entry} entry 
     */
    select_entry = (entry) => {
        this.current_entry = entry;
        if (entry === null) {
            this.simulation.set_rule(null);
            return;
        }

        this.simulation.set_rule(entry.rule);
        let randomisers = entry.randomiser_presets;
        if (randomisers.length > 0) {
            let randomiser = randomisers[0];
            this.randomiser_list.copy_randomiser(randomiser);
        }
    }
}

export { App };