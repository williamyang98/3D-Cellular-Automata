import { hsv_to_rgb } from './hsv_to_rgb.js';

let create_radial_colours = () => {
    const width = 360;
    const total_channels = 4;
    const hue_range = 359;

    let rgba_data = new Uint8Array(total_channels*width)
    for (let i = 0; i < width; i++) {
        let offset = i*total_channels;
        let hue = hue_range*(1.0-i/width);
        let saturation = 100;
        let value = 100;
        let {r,g,b} = hsv_to_rgb(hue, saturation, value);
        rgba_data[offset+0] = r;
        rgba_data[offset+1] = g;
        rgba_data[offset+2] = b;
        rgba_data[offset+3] = 255;
    }
    
    return { 
        width, 
        height: 1, 
        total_channels, 
        data: rgba_data 
    };
}

export { create_radial_colours };