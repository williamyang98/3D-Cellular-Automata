import { Texture2D } from '../../gl/Texture2D';
import colorsys from 'colorsys';

export function create_states_texture(gl) {
  let total_states = 40;
  let state_colours_data = new Uint8Array(4*total_states)
  for (let i = 0; i < total_states-1; i++) {
    let offset = (i+1)*4;
    
    const hue_range = 200;
    let hue = hue_range*(1.0-i/total_states);
    let saturation = 100;
    let value = 100;
    let {r, g, b} = colorsys.hsv_to_rgb(hue, saturation, value);
    state_colours_data[offset+0] = r;
    state_colours_data[offset+1] = g;
    state_colours_data[offset+2] = b;
    state_colours_data[offset+3] = 255;
  }

  for (let i = 0; i < 4; i++) {
    state_colours_data[i] = 0;
  }

  return new Texture2D(gl, state_colours_data, [total_states,1]);
}

export function create_radius_texture(gl) {
  let total_states = 360;
  let state_colours_data = new Uint8Array(4*total_states)
  for (let i = 0; i < total_states; i++) {
    let offset = (i)*4;
    
    const hue_range = 360;
    let hue = hue_range*(1.0-i/total_states);
    let saturation = 100;
    let value = 100;
    let {r, g, b} = colorsys.hsv_to_rgb(hue, saturation, value);
    state_colours_data[offset+0] = r;
    state_colours_data[offset+1] = g;
    state_colours_data[offset+2] = b;
    state_colours_data[offset+3] = 255;
  }
  
  return new Texture2D(gl, state_colours_data, [total_states,1]);
}