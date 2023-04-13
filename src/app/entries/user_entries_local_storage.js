import { save_entries_to_string, load_entries_from_string } from "./serialise_entries";

const is_supports_local_storage = 'localStorage' in window;
const local_storage = window.localStorage;
const storage_key = "user_entries";

/**
 * @returns {Array[Entry]}
 */
let load_entries_from_storage = () => {
    if (!is_supports_local_storage) {
        console.error("User entries couldn't be loaded since localStorage is unsupported");
        return [];
    }

    try {
        let data_string = local_storage.getItem(storage_key);
        if (data_string === undefined) {
            return [];
        }
        return load_entries_from_string(data_string);
    } catch (exception) {
        console.error(exception.message);
        return [];
    }
}

/**
 * @param {Array[Entry]} entries 
 */
let save_entries_to_storage = (entries) => {
    if (!is_supports_local_storage) {
        console.error("User entries couldn't be saved since localStorage is unsupported");
        return;
    }

    let data_string = save_entries_to_string(entries);
    local_storage.setItem(storage_key, data_string);
}

export { load_entries_from_storage, save_entries_to_storage, is_supports_local_storage };