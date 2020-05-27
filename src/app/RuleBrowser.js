import { Rule3D } from "../simulation/Rule3D";
import { RuleReader } from './RuleReader';
import { SeedCrystal, SeedCrystalAbsolute } from "../simulation/Randomiser3D";

export class RuleBrowser {
  constructor(randomiser_manager) {
    this.entries = [];
    this.randomiser_manager = randomiser_manager;
    this.add_entry(
      new RuleEntry(
        '445', 
        '4/4/5/M', 
        new SeedCrystal(0.05, 0.5)
      ));

    this.add_entry(
      new RuleEntry(
        '678 678', 
        '6-8/6-8/3/M',
        new SeedCrystal(0.3)
      ));
    this.add_entry(
      new RuleEntry(
        'Amoeba', 
        '9-26/5-7,12-13,15/5/M',
        new SeedCrystalAbsolute(0.3, 5),
      ));

    this.add_entry(
      new RuleEntry(
        'Builder 1', 
        '2,6,9/4,6,8-9/10/M',
        // '6,9/4,6,8-9/10/M',
        new SeedCrystalAbsolute(0.35, 7) 
      )
    );

    this.add_entry(
      new RuleEntry(
        'Builder 2', 
        // '2,6,9/4,6,8-9/10/M',
        '6,9/4,6,8-9/10/M',
        new SeedCrystalAbsolute(0.35, 7) 
      )
    );

    this.add_entry(
      new RuleEntry(
        'Clouds 1', 
        '13-26/13-14,17-19/2/M',
        new SeedCrystal(0.5, 0.5)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Spiky Growth', 
        '0-3,7-9,11-13,18,21-22,24-26/4,13,17,20-24,24/4/M',
        new SeedCrystalAbsolute(0.8, 1)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Crystal Growth 1',
        '0-6/1,3/2/VN',
        new SeedCrystalAbsolute(1.0, 1)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Crystal Growth 2',
        '1-3/1-3/5/VN',
        new SeedCrystalAbsolute(1.0, 1)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Pyroclastic',
        '4-7/6-8/10/M',
        new SeedCrystalAbsolute(0.2, 5)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Slow Decay',
        // '1,4,8,11,13-26/13-26/5/M',
        '8,11,13-26/13-26/5/M',
        new SeedCrystal(0.45, 1.0)
      )
    );

    this.select_entry(0);
  }

  get_selected_entry() {
    return this.entries[this.selected_entry];
  }

  select_entry(idx) {
    this.selected_entry = idx;
    let randomiser = this.get_selected_entry().randomiser;
    this.randomiser_manager.select_randomiser(randomiser);
  }

  add_entry(entry) {
    let randomiser = entry.randomiser;
    let rule = entry.rule;
    randomiser.alive_state = rule.alive_state;
    randomiser.dead_state = rule.dead_state;
    this.entries.push(entry);
  }
}

class RuleEntry {
  constructor(name, ca_string, randomiser) {
    this.name = name;
    this.description = ca_string;
    this.rule_reader = new RuleReader(ca_string);
    this.rule = new Rule3D(
      n => this.rule_reader.remain_alive[n],
      n => this.rule_reader.become_alive[n],
      this.rule_reader.total_states,
      this.rule_reader.neighbour_type
    );
    this.randomiser = randomiser;
  }
}

