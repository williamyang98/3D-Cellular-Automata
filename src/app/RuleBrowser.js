import { Rule3D } from "../simulation/Rule3D";
import { SeedCrystal } from "../simulation/Randomiser3D";

export class RuleBrowser {
  constructor() {
    this.entries = [];
    this.add_entry(
      new RuleEntry(
        '445', 
        '4/4/5/M', 
        new SeedCrystal(0.3, 0.5)
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
        new SeedCrystal(0.3, 0.15),
      ));

    this.add_entry(
      new RuleEntry(
        'Builder', 
        '2,6,9/4,6,8-9/10/M',
        new SeedCrystal(0.3, 0.25)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Clouds 1', 
        '13-26/13-14,17-19/5/M',
        new SeedCrystal(0.60, 0.5)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Spiky Growth', 
        '0-3,7-9,11-13,18,21-22,24-26/4,13,17,20-24,24/4/M',
        new SeedCrystal(0.4, 0.05)
      )
    );

    this.selected_entry = 0;
  }

  get_selected_entry() {
    return this.entries[this.selected_entry];
  }

  select_entry(idx) {
    this.selected_entry = idx;
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
      this.rule_reader.total_states
    );
    this.randomiser = randomiser;
  }
}

class RuleReader {
  constructor(string) {
    this.generate(string);
  }

  generate(string) {
    string = string.replace(' ', '');
    let substrings = string.split('/');
    if (substrings.length !== 4) {
      throw new Error(`Invalid string rule: ${string}`);
    }
    let [remain_alive, become_alive, total_states, neighbour_type] = substrings;

    this.total_states = Number(total_states);
    this.remain_alive = this.retrieve_rule(remain_alive);
    this.become_alive = this.retrieve_rule(become_alive);
    this.neighbour_type = neighbour_type;
  }

  retrieve_rule(number_range) {
    let N = new Array(27); 
    N.fill(false, 0, -1);

    let numbers = number_range.split(',');
    for (let number of numbers) {
      let range = number.split('-').map(Number);
      if (range.length === 1) {
        let n = range[0];
        this.assert_number(n);

        N[n] = true;
      } else if (range.length === 2) {
        let [start, end] = range;
        if (end < start) {
          throw new Error(`Invalid range: ${start}-${end}. Must be ordered.`);
        }
        for (let n = start; n <= end; n++) {
          this.assert_number(n);
          N[n] = true;
        }
      } else {
        throw new Error(`Too many numbers in range: ${number_range}. Must be 1 or 2`);
      }
    }


    return N;
  }

  // 3**3 - 1 = 26 possible neighbours, 27 possible values 0-26
  assert_number(n) {
    if (n < 0 || n > 26) {
      throw new Error(`Invalid number: ${n}. Must be between 0 to 26`);
    }
  }


}