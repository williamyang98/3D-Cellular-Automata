import { Entry } from './entry.js';

/**
 * @returns {Array[Entry]}
 */
let load_entries_from_string = (string) => {
    let raw_entries = JSON.parse(string);
    let entries = [];
    for (let raw_entry of raw_entries) {
        let entry = new Entry();
        entry.label = raw_entry.label;

        // NOTE: Continue with warning if a single entry was invalid
        try {
            entry.set_string(raw_entry.string);
            entries.push(entry);
        } catch (exception) {
            console.error(exception);
        }
    }
    return entries;
}

/**
 * Serialises array of entries with optional JSON formatting
 * Setting indent to an integer will set the identation amount
 * @param {Array[Entry]} entries 
 * @param {Number} indent 
 */
let save_entries_to_string = (entries, indent) => {
    let raw_entries = [];
    for (let entry of entries) {
        let raw_entry = {};
        raw_entry.label = entry.label;
        raw_entry.string = entry.string;
        raw_entries.push(raw_entry);
    }
    let string = JSON.stringify(raw_entries, null, indent);
    return string;
}

export { save_entries_to_string, load_entries_from_string };
