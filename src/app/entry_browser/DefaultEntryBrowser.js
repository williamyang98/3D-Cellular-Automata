import { SeedCrystalSerialized, SeedCrystalAbsoluteSerialized } from "../../simulation/Serialised";
import { Entry } from "./Entry";

export class DefaultEntryBrowser {
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