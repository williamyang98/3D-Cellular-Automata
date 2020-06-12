import { DefaultEntryBrowser } from './DefaultEntryBrowser';
import { StoredEntryBrowser } from './StoredEntryBrowser';

export class EntryBrowser {
  constructor() {
    this.listeners = new Set();

    this.browsers = {
      'System': new DefaultEntryBrowser(),
      'User': new StoredEntryBrowser(),
    };

    this.current_browser_key = 'System';

    this.browsers['System'].listen_select((entry) => {
      this.notify(entry);
    })

    this.browsers['User'].listen_select((entry) => {
      if (entry === undefined) {
        this.select('System', 0);  
      } else {
        this.notify(entry);
      }
    })
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
    let entry = this.selected_browser.selected_entry;
    return entry;
  }

  get selected_browser() {
    let browser = this.browsers[this.current_browser_key];
    return browser;
  }

  get_entries(key) {
    return this.browsers[key].entries;
  }

  select(key, index) {
    this.current_browser_key = key;
    this.selected_browser.select(index);
  }

  // wrap around stored database
  delete(key, index) {
    return new Promise((resolve, reject) => {
      if (key !== 'User') {
        reject('Can only delete user defined rules');
        return;
      }
      let stored = this.browsers['User'];
      stored.delete(index)
        .then(v => resolve(v), err => reject(err));
    });
  }

  create(name, ca_string) {
    return new Promise((resolve, reject) => {
      try {
        let stored = this.browsers['User'];
        stored.create(name, ca_string)
          .then(v => resolve(v), err => reject(err));
      } catch (ex) {
        reject(String(ex.message));
      }
    });
  }

  edit(key, index, name, ca_string) {
    let stored = this.browsers[key];
    return new Promise((resolve, reject) => {
      try {
        let promise = stored.edit(index, name, ca_string);
        promise.then((val) => resolve(val), (err) => reject(err));
      } catch (ex) {
        reject(String(ex.message));
      }
    });
  }
}





