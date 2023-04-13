import { useState } from 'react';
import { Help } from './Help';

let Slider = ({ object, object_key, min, max, step, label, help_text, external_on_change }) => {
  label = (label !== undefined) ? label : object_key;
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

  return (
    <div className="row w-100">
      <div className="col-sm-6">
        <label className='form-check-label'>{label}: {value.toFixed(2)}</label>
      </div>
      <div className="col-sm d-flex">
        <input 
          className='form-control-range my-auto' type='range' 
          min={min} max={max} value={value} step={step} onChange={on_change}
        ></input> 
      </div>
      {
        help_text && 
        <div className="col-sm-1 text-right">
          <Help text={help_text}></Help>
        </div>
      }
    </div>
  );
}

export { Slider };