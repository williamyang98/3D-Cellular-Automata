import { Entry } from "./Entry";

export class StoredEntryBrowser {
  constructor() {
    this.entries = [];

    this.listeners = new Set();

    this.db_cfg = {
      name: 'entries_db',
      store: 'entries_os'
    };

    let db_request = window.indexedDB.open(this.db_cfg.name, 1);
    db_request.onerror = (ev) => console.error(`${this.db_cfg.name} failed to open`);
    db_request.onsuccess = (ev) => {
      this.db = db_request.result;
      this.on_db_load();
    };

    db_request.onupgradeneeded = (ev) => {
      let db = ev.target.result;
      let store = db.createObjectStore(this.db_cfg.store, { keyPath:'id', autoIncrement: true});
      store.createIndex('name', 'name', {unique: false});
      store.createIndex('ca_string', 'ca_string', {unique: false});
    }

    this.current_index = -1;
  }

  listen_select(listener) {
    this.listeners.add(listener);
  }

  notify(entry) {
    for (let listener of this.listeners) {
      listener(entry);
    }
  }

  on_db_load() {
    // this.add_user_entry('Test', '0-6/1,3/2/VN');
    let cfg = this.db_cfg;
    let store = this.db.transaction(cfg.store).objectStore(cfg.store);
    let corrupted_ids = [];
    store.openCursor().onsuccess = (ev) => {
      let cursor = ev.target.result;
      if (cursor) {
        let {name, ca_string, id} = cursor.value;
        try {
          let entry = new StoredEntry(name, ca_string, id);
          this.add_entry(entry);
        } catch (ex) {
          corrupted_ids.push(id);
        }
        cursor.continue();
        return;
      }      
      // end of cursor list, this lets remove all corrupted ids
      this.purge_corrupted_ids(corrupted_ids);
    }
  }

  purge_corrupted_ids(ids) {
    let cfg = this.db_cfg;
    let store = this.db.transaction([cfg.store], 'readwrite').objectStore(cfg.store);
    for (let id of ids) {
      let request = store.delete(id);
    }
  }

  edit(index, name, ca_string) {
    let original = this.entries[index];
    if (!original) return;

    let replace = new StoredEntry(name, ca_string, original.id);

    let db = this.db;
    if (!db) {
      console.error(`${cfg.store} failed to load`);
      return;
    } 
    let cfg = this.db_cfg;

    let data = {id: original.id, name, ca_string};
    let transaction = db.transaction([cfg.store], 'readwrite');
    let store = transaction.objectStore(cfg.store);
    let request = store.put(data);

    let promise = new Promise((resolve, reject) => {
      transaction.oncomplete = (ev) => {
        this.entries[index] = replace;
        this.entries = [...this.entries];
        if (this.current_index === index) {
          this.notify(replace);
        }
        resolve(true);
      }
      transaction.onerror = () => {
        console.error(`Failed to update entry: ${original} to ${replace}`);
        reject(`Failed to update entry: ${original} to ${replace}`);
      }
    });
    return promise;
  }

  create(name, ca_string) {
    // id is undefined, add in later
    let entry = new StoredEntry(name, ca_string);

    let db = this.db;
    let cfg = this.db_cfg;
    if (!db) {
      console.error(`${cfg.store} failed to load`);
      return;
    }
    let data = {name, ca_string};
    let transaction = db.transaction([cfg.store], 'readwrite');
    let store = transaction.objectStore(cfg.store);
    let request = store.add(data);

    return new Promise((resolve, reject) => {
      request.onsuccess = (ev) => {
        let id = ev.target.result;
        entry.id = id;
        this.add_entry(entry);
        resolve(true);
      }
      request.onerror = () => {
        console.error(`Failed to add entry: ${name}, ${ca_string}`);
        reject(`Failed to add entry: ${name}, ${ca_string}`);
      }
    });
 }

  delete(idx) {
    // ignore invalid index
    if (idx < 0 || idx >= this.entries.length) return;
    // map expected current index after removal
    let current_index = this.current_index;
    // if same item, then we want the index to point to same location in list after change
    // this will be the next item
    if (this.current_index === idx) {
      current_index = this.current_index;
    // if an item behind selected item, then we want to keep the selected item
    // this will be now an index behind
    } else if (this.current_index > idx) {
      current_index = this.current_index-1; 
    // if selected item behind deleted item, then dont do anything
    } else {
      current_index = this.current_index;
    }
    // remove from db
    let entry = this.entries[idx];
    let cfg = this.db_cfg;
    let transaction = this.db.transaction([cfg.store], 'readwrite');
    let store = transaction.objectStore(cfg.store);
    let request = store.delete(entry.id);

    // if request was successful, then modify entries array inplace
    // send notification
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        let entries = this.entries;
        this.entries = [...entries.slice(0, idx), ...entries.slice(idx + 1)];
        // always try to figure out a viable selection before defaulting to nothing
        current_index = Math.max(current_index, 0);
        current_index = Math.min(current_index, this.entries.length-1);
        // if no entries left, then undefined entry
        if (this.entries.length === 0) {
          current_index = -1;
        }
        this.select(current_index);
        resolve(true);
      }
    });
  }

  get selected_entry() {
    return this.entries[this.current_index];
  }

  select(idx) {
    this.current_index = idx;
    if (this.current_index < 0 || this.current_index >= this.entries.length) {
      this.notify(undefined);
      return;
    }
    let entry = this.selected_entry;
    this.notify(entry);
  }

  add_entry(entry) {
    this.entries = [...this.entries, entry]; 
  }
}

class StoredEntry extends Entry {
  constructor(name, ca_string, id) {
    super(name, ca_string);
    this.id = id;
  }
}