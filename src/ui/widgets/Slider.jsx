import { useState } from 'react';

let Slider = ({ object, object_key, min, max, step, external_on_change }) => {
  if (step === undefined) {
    step = (max-min)/100.0;
  }

  let [value, set_value] = useState(object[object_key]);

  let on_change = (ev) => {
    let new_value = Number(ev.target.value);
    object[object_key] = new_value;
    set_value(new_value);
    if (external_on_change !== undefined) {
      external_on_change(new_value);
    }
  }

  // NOTE: Add margin top to center with text
  return (
    <input 
      className='form-control-range mt-1 w-100' type='range' 
      min={min} max={max} value={value} step={step} onChange={on_change}
    ></input> 
  );
}

export { Slider };