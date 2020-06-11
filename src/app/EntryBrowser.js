import { RuleReader } from './RuleReader';
import { SeedCrystalSerialized, SeedCrystalAbsoluteSerialized } from "../simulation/Serialised";


export class EntryBrowser {
  constructor() {
    this.listeners = new Set();

    this.browsers = {
      'System': new DefaultEntryBrowser(),
      'User': new StoredEntryBrowser(),
    };

    this.current_browser_key = 'System';
    this.selected_browser_key = 'System';
    this.create_errors = undefined;

    for (let key in this.browsers) {
      let browser = this.browsers[key];
      browser.listen_select((entry) => {
        this.notify(entry);
      });
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
    let browser = this.browsers[this.selected_browser_key];
    let entry = browser.selected_entry;
    return entry;
  }

  get current_browser() {
    let browser = this.browsers[this.current_browser_key];
    return browser;
  }

  select_browser(key) {
    this.current_browser_key = key;
  }

  select(idx) {
    this.selected_browser_key = `${this.current_browser_key}`;
    this.current_browser.select(idx);
  }

  create_entry(name, ca_string) {
    try {
      let stored = this.browsers['User'];
      stored.create_entry(name, ca_string);
      this.create_errors = undefined;
    } catch (ex) {
      this.create_errors = String(ex.message);
    }
  }
}

class DefaultEntryBrowser {
  constructor() {
    this.entries = [];
    this.listeners = new Set();
    // our default entries
    this.add_entry(new Entry('445',       '4/4/5/M',                new SeedCrystalSerialized(0.05, 0.5)));
    this.add_entry(new Entry('678 678',   '6-8/6-8/3/M',            new SeedCrystalSerialized(0.3)));
    this.add_entry(new Entry('Amoeba',    '9-26/5-7,12-13,15/5/M',  new SeedCrystalAbsoluteSerialized(0.3, 5)));
    this.add_entry(new Entry('Builder 1', '2,6,9/4,6,8-9/10/M',     new SeedCrystalAbsoluteSerialized(0.35, 7)));
    this.add_entry(new Entry('Builder 2', '6,9/4,6,8-9/10/M',       new SeedCrystalAbsoluteSerialized(0.35, 7)));
    this.add_entry(new Entry('Clouds 1',  '13-26/13-14,17-19/2/M',  new SeedCrystalSerialized(0.5, 0.5)));
    this.add_entry(new Entry('Spiky Growth', '0-3,7-9,11-13,18,21-22,24-26/4,13,17,20-24,24/4/M', new SeedCrystalAbsoluteSerialized(0.8, 1)));
    this.add_entry(new Entry('Crystal Growth 1', '0-6/1,3/2/VN', new SeedCrystalAbsoluteSerialized(1.0, 1)));
    this.add_entry(new Entry('Crystal Growth 2', '1-3/1-3/5/VN', new SeedCrystalAbsoluteSerialized(1.0, 1)));
    this.add_entry(new Entry('Pyroclastic', '4-7/6-8/10/M',         new SeedCrystalAbsoluteSerialized(0.2, 5)));
    this.add_entry(new Entry('Slow Decay', '8,11,13-26/13-26/5/M', new SeedCrystalSerialized(0.45, 1.0)));

    this.select(0);
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
    this.entries.push(entry);
  }
}

class StoredEntryBrowser {
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

class Entry {
  constructor(name, ca_string, randomiser) {
    this.name = name;
    this.description = ca_string;
    let reader = new RuleReader();
    let rule = reader.generate(ca_string);
    this.rule = rule;
    this.randomiser = randomiser;
  }
}

