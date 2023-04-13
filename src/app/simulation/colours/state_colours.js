import { hsv_to_rgb } from './hsv_to_rgb.js';

let create_state_colours = (total_states) => {
    const total_channels = 4;
    const hue_range = 200;

    let rgba_data = new Uint8Array(total_states * total_channels);
    for (let i = 0; i < (total_states-1); i++) {
        let offset = (i+1)*total_channels;
        let hue = hue_range * (1.0 - i/total_states);
        let saturation = 100;
        let value = 100;

        let {r,g,b} = hsv_to_rgb(hue, saturation, value);
        rgba_data[offset+0] = r;
        rgba_data[offset+1] = g;
        rgba_data[offset+2] = b;
        rgba_data[offset+3] = 255;
    }

    for (let i = 0; i < total_channels; i++) {
        rgba_data[i] = 0;
    }

    return {
        width: total_states,
        height: 1,
        total_channels,
        data: rgba_data
    }
}

export { create_state_colours };