import { 
    Rule, 
    Neighbourhood, 
    get_neighbourhood_name, get_neighbourhood_size
} from "../simulation/compute_volume.js";

let to_number = (string, field_name) => {
    if (isNaN(string)) {
        throw new Error(`${field_name} must be a valid number (${string})`);
    }
    return Number(string);
}

let parse_range_string = (string, neighbourhood, field_name) => {
    let max_neighbours = get_neighbourhood_size(neighbourhood);
    let neighbourhood_name = get_neighbourhood_name(neighbourhood);

    let validate_neighbour_count = (count) => {
        if (count < 0 || count > max_neighbours) {
            throw new Error(`${field_name} must be between 0 and ${max_neighbours} for ${neighbourhood_name} neighbourhood (${count})`);
        }
    };

    let range_buffer = new Float32Array(max_neighbours+1); 
    const STATE_TRUE = 1.0;
    const STATE_FALSE = 0.0;

    range_buffer.fill(STATE_FALSE, 0, -1);

    let sub_strings = string.split(',');
    for (let string of sub_strings) {
        if (string.length === 0) {
            throw new Error(`${field_name} cannot be empty and should be x-y or x`);
        }

        if (string[0] === '-') {
            throw new Error(`${field_name} must be of form x-y or x (${string})`);
        }

        if (string[string.length-1] === '-') {
            throw new Error(`${field_name} must be of form x-y or x (${string})`);
        }

        let range = string.split('-');
        range = range.map(n => to_number(n, field_name));

        if (range.length === 1) {
            let i = range[0];
            validate_neighbour_count(i);
            range_buffer[i] = STATE_TRUE;
            continue;
        } 
        
        if (range.length === 2) {
            let [start, end] = range;
            if (end < start) {
                throw new Error(`${field_name} must be ascending (${start}-${end})`);
            }
            validate_neighbour_count(start);
            validate_neighbour_count(end);
            for (let i = start; i <= end; i++) {
                range_buffer[i] = STATE_TRUE;
            }
            continue;
        } 

        throw new Error(`${field_name} must be of form x-y or x (${string})`);
    }

    return range_buffer;
}

let read_rule_from_string = (string) => {
    let substrings = string.split('/');
    if (substrings.length !== 4) {
        throw new Error(`Expected rule string format: Range/Range/Number/(VN or M).\nEg: 0,1-4,5/0-26/5/VN`);
    }
    let [stay_alive_string, dead_to_alive_string, total_states_string, neighbour_string] = substrings;

    const neighbour_to_key = {
        'M': Neighbourhood.MOORE,
        'VN': Neighbourhood.VON_NEUMANN 
    };

    if (!(neighbour_string in neighbour_to_key)) {
        throw new Error(`Neighbourhood must be one of [${Object.keys(neighbour_to_key).join(',')}].`);
    }

    let total_states = to_number(total_states_string, 'Total states');
    if (total_states <= 1) {
        throw new Error(`Number of states must be 2 or more`);
    }

    let neighbourhood = neighbour_to_key[neighbour_string];
    let alive_rule = parse_range_string(stay_alive_string, neighbourhood, 'Remain alive range');
    let dead_rule = parse_range_string(dead_to_alive_string, neighbourhood, 'Become alive range');

    let rule = new Rule();
    rule.alive_rule = alive_rule;
    rule.dead_rule = dead_rule;
    rule.total_states = total_states;
    rule.neighbourhood = neighbourhood;
    return rule;
}

export { read_rule_from_string };