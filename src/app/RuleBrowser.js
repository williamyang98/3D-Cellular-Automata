import { Rule3D } from "../simulation/Rule3D";
import { SeedCrystal } from "../simulation/Randomiser3D";

export class RuleBrowser {
  constructor() {
    this.entries = [];
    this.add_entry(
      new RuleEntry(
        '445', '4/4/5/M', 
        new Rule3D(n => n === 4, n => n === 4, 5),
        new SeedCrystal(0.3, 0.5)
      ));
    this.add_entry(
      new RuleEntry(
        '678 678', '6-8/6-8/3/M',
        new Rule3D(n => range(n,6,8), n => range(n,6,8), 3),
        new SeedCrystal(0.3)
      ));
    this.add_entry(
      new RuleEntry(
        'Amoeba', '9-26/5-7,12-13,15/5/M',
        new Rule3D(n => range(n,9,26), n => range(n,5,7) || range(n,12,13) || (n === 15), 5),
        new SeedCrystal(0.3),
      ));

    this.add_entry(
      new RuleEntry(
        'Builder', '2,6,9/4,6,8-9/10/M',
        new Rule3D(n => n === 2 || n === 6 || n === 9, n => n === 4 || n === 8 || range(n,8,9), 10),
        new SeedCrystal(0.3, 0.15)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Clouds 1', '13-26/13-14,17-19/2/M',
        new Rule3D(n => range(n,13,26), n => range(n,13,14) || range(17,19), 4),
        new SeedCrystal(0.75, 0.5)
      )
    );

    this.add_entry(
      new RuleEntry(
        'Spiky Growth', 'Long',
        new Rule3D(n => range(n,0,3) || range(n,7,9) || range(n,11,13) || n == 18 || range(n,21,22) || range(n,24,26),
                   n => n === 4 || n === 13 || n === 17 || range(n,20,24) || n === 26, 4),
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
  constructor(name, description, rule, randomiser) {
    this.name = name;
    this.description = description;
    this.rule = rule;
    this.randomiser = randomiser;
  }
}

function range(n, a, b) {
    return (n >= a && n <= b);
}