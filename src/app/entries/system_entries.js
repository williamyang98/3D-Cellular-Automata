import { Entry } from './entry.js';
import { Randomiser_Radius_Absolute, Randomiser_Radius_Relative } from "../randomisers/randomisers.js";

/**
 * Convenience method for create and setting up system rules
 * System rules are provided by default for users
 * @param {String} label 
 * @param {String} string 
 * @param {Randomiser} randomiser 
 * @returns {Entry}
 */
let create_system_entry = (label, string, randomiser) => {
    let entry = new Entry();
    entry.label = label;
    entry.set_string(string);
    entry.randomiser_presets.push(randomiser);
    return entry;
}

const system_entries = [
    create_system_entry('Amoeba-1',           '9-26/5-7,12-13,15/16/M', new Randomiser_Radius_Absolute(0.3,  8  )),
    create_system_entry('445',                '4/4/5/M',                new Randomiser_Radius_Absolute(0.1,  15 )),
    create_system_entry('Builder 2',          '6,9/4,6,8-9/10/M',       new Randomiser_Radius_Absolute(0.35, 7  )),
    create_system_entry('Crystal Growth 1',   '0-6/1,3/2/VN',           new Randomiser_Radius_Absolute(1.0,  1  )),
    create_system_entry('Crystal Growth 2',   '1-3/1-3/5/VN',           new Randomiser_Radius_Absolute(1.0,  1  )),
    create_system_entry('Clouds 1',           '13-26/13-14,17-19/2/M',  new Randomiser_Radius_Relative(0.5,  1.0)),
    create_system_entry('Slow Decay',         '8,11,13-26/13-26/5/M',   new Randomiser_Radius_Relative(0.45, 1.0)),
    create_system_entry('Spiky Growth 1',     '7-26/4,12-13,15/10/M',   new Randomiser_Radius_Absolute(0.32, 7  )),
    create_system_entry('Ripple Cube',        '8-26/4,12-13,15/10/M',   new Randomiser_Radius_Absolute(0.35, 10 )),
    create_system_entry('Amoeba-2',           '9-26/5-7,12-13,15/5/M',  new Randomiser_Radius_Absolute(0.3,  5  )),
    create_system_entry('Builder 1',          '6,9/4,6,8-9/10/M',       new Randomiser_Radius_Absolute(0.35, 7  )),
    create_system_entry('Pyroclastic',        '4-7/6-8/10/M',           new Randomiser_Radius_Absolute(0.2,  5  )),
    create_system_entry('678 678',            '6-8/6-8/3/M',            new Randomiser_Radius_Absolute(0.3,  5  )),
];

export { system_entries };