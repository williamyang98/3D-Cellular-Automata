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
          let entry = new Entry(name, ca_string);
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
    console.log('Purging ids:', ids);
    let cfg = this.db_cfg;
    let store = this.db.transaction(cfg.store).objectStore(cfg.store);
    for (let id of ids) {
      let request = store.delete(id);
    }
  }

  create_entry(name, ca_string) {
    let entry = new Entry(name, ca_string);

    let db = this.db;
    if (!db) {
      console.error('entries_db failed to load');
      return;
    }
    let data = {name, ca_string};
    let transaction = db.transaction(['entries_os'], 'readwrite');
    let store = transaction.objectStore('entries_os');
    let request = store.add(data);
    request.onsuccess = () => {
      this.add_entry(entry);
    }
    request.onerror = () => {
      console.error(`Failed to add entry: ${name}, ${ca_string}`);
    }
  }

  listen_select(listener) {
    this.listeners.add(listener);
  }

  notify(entry) {
    for (let listener of this.listeners) {
      listener(entry);
    }
  }

  get selected_entry() {
    return this.entries[this.current_index];
  }

  select(idx) {
    this.current_index = idx;
    let entry = this.selected_entry;
    this.notify(entry);
  }

  add_entry(entry) {
    this.entries = [...this.entries, entry]; // dont mutate, create a new instance
    // this.entries.push(entry);
  }
}