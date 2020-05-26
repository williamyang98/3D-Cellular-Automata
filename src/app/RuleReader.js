import { MooreNeighbour, VonNeumanNeighbour } from "../simulation/Neighbours3D";

const NeighbourRules = {
  'M': MooreNeighbour,
  'VN': VonNeumanNeighbour
};

export class RuleReader {
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


    if (!(neighbour_type in NeighbourRules)) {
      throw new Error(`Invalid neighbourhood rule: ${neighbour_type}`);
    }

    this.total_states = Number(total_states);
    this.remain_alive = this.retrieve_rule(remain_alive);
    this.become_alive = this.retrieve_rule(become_alive);
    this.neighbour_type = new NeighbourRules[neighbour_type]();
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