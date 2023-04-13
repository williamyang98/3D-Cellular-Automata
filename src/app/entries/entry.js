import { Rule } from "../simulation/compute_volume.js";
import { Randomiser } from "../randomisers/randomisers.js";
import { read_rule_from_string } from "./read_rule_from_string.js";

/**
 * Entry consists of a rule and a list of randomiser presets
 */
class Entry {
    constructor() {
        /** @property {String} */
        this.label = null;
        /** @property {Rule} */
        this.rule = null;
        /** @property {String} */
        this.string = null;
        /** @property {Array[Randomiser]} */
        this.randomiser_presets = [];
    }

    set_string = (string) => {
        let rule = read_rule_from_string(string);
        this.rule = rule;
        this.string = string;
    }
}

export { Entry };
