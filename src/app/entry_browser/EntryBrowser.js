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
    this.create_errors = undefined;

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
    if (key !== 'User') {
      return;
    }
    let stored = this.browsers['User'];
    stored.delete(index);
  }

  create(name, ca_string) {
    try {
      let stored = this.browsers['User'];
      stored.create(name, ca_string);
      this.create_errors = undefined;
    } catch (ex) {
      this.create_errors = String(ex.message);
    }
  }
}





