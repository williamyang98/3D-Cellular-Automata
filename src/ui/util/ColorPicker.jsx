import React from 'react';
import { useState } from 'react';
import "./ColorPicker.css";
import { ChromePicker } from 'react-color';

export function ColorPicker({color, valueChanged}) {
    let [show_picker, set_show_picker] = useState(false);
    let rgba = {r: color[0], g: color[1], b: color[2], a:1};

    const on_click = () => set_show_picker(!show_picker);
    const on_change = colour => {
        let rgb = colour.rgb;
        valueChanged([rgb.r, rgb.g, rgb.b]);
    } 

    const on_close = () => set_show_picker(false);

    return (
        <div>
            <div className="swatch" onClick={on_click}>
                <div className="color-display" style={{background: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}}></div>
            </div>
            {show_picker && 
            <div className="popover">
                <div className="cover" onClick={on_close}/>
                <ChromePicker color={rgba} onChange={on_change} disableAlpha={true}></ChromePicker>
            </div>}

        </div>
    )
}