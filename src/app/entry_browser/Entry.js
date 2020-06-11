import { RuleReader } from "../RuleReader";

export class Entry {
  constructor(name, ca_string, randomiser) {
    this.name = name;
    this.description = ca_string;
    let reader = new RuleReader();
    let rule = reader.generate(ca_string);
    this.rule = rule;
    this.randomiser = randomiser;
  }
}

