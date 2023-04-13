import { Entry } from './entry.js';
import { save_entries_to_storage, load_entries_from_storage } from './user_entries_local_storage.js';

class User_Entries_List {
    constructor() {
        this.entries = [];
    }

    load_from_cache = () => {
        let entries = load_entries_from_storage();
        this.entries = entries;
    }

    save_to_cache = () => {
        save_entries_to_storage(this.entries);
    }

    on_change = () => {
        this.save_to_cache();
    }

    replace_entry = (index, new_entry) => {
        this.entries[index] = new_entry;
        this.on_change();
    }

    delete_entry = (index) => {
        this.entries.splice(index, 1);
        this.on_change();
    }

    /**
     * @param {Entry} entry
     */
    add_entry = (entry) => {
        this.entries.push(entry);
        this.on_change();
    }

    /**
     * @param {Array[Entry]} entry
     */
    add_entries = (entries) => {
        this.entries.push(...entries);
        this.on_change();
    }
};

export { User_Entries_List };