import { useState } from 'react';
import { ChromePicker } from 'react-color';

/**
 * Directly modify rgb object
 * @param {Object{r,g,b}} rgb 
 */
let Colour_Picker = ({ rgb, external_on_change }) => {
  // NOTE: App uses 0 to 1, react chrome picker uses 0 to 255
  const SCALE = 255.0;

  let [is_show_picker, set_is_show_picker] = useState(false);
  let [channel_r, set_channel_r] = useState(rgb.r * SCALE);
  let [channel_g, set_channel_g] = useState(rgb.g * SCALE);
  let [channel_b, set_channel_b] = useState(rgb.b * SCALE);

  let on_click = (ev) => {
    set_is_show_picker(!is_show_picker);
  }

  // NOTE: ChromePicker needs the alpha channel to be defined
  let on_change = (new_colour) => {
    let new_rgb = new_colour.rgb;
    rgb.r = new_rgb.r / SCALE;
    rgb.g = new_rgb.g / SCALE;
    rgb.b = new_rgb.b / SCALE;
    set_channel_r(new_rgb.r);
    set_channel_g(new_rgb.g);
    set_channel_b(new_rgb.b);
    if (external_on_change !== undefined) {
      external_on_change(new_rgb);
    }
  }

  let scaled_rgb = {
    r: channel_r, 
    b: channel_b,
    g: channel_g,
  };

  const style_picker_size = 14;
  const style_picker_padding = 5;

  const style_colour_picker_display = {
    width: `${style_picker_size}px`,
    height: `${style_picker_size}px`,
    borderRadius: '2px',
  };

  const style_colour_picker_swatch = {
    padding: `${style_picker_padding}px`,
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  };

  const style_popover = {
    position: 'absolute',
    zIndex: '3',
    transform: `translateX(calc(-100% + ${style_picker_size+style_picker_padding*2}px))`,
  };

  const style_cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    zIndex: '2',
  };

  let rgba_style = {background: `rgba(${channel_r}, ${channel_g}, ${channel_b})`};

  return (
    <div>
      <div style={style_colour_picker_swatch} onClick={on_click}>
        <div style={{...style_colour_picker_display, ...rgba_style}}></div>
      </div>
      {
        is_show_picker && 
        <div>
          <div style={style_cover} onClick={(ev) => set_is_show_picker(false)}></div>
          <div style={style_popover}>
            <ChromePicker color={scaled_rgb} disableAlpha={true} onChange={on_change}></ChromePicker>
          </div>
        </div>
      }
    </div>
  )
}

export { Colour_Picker };