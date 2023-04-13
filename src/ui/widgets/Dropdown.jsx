import { useState } from 'react';
import { Help } from './Help';

/**
 * 
 * @param {Array(Object(name, value))} options 
 */
let Dropdown = ({ object, object_key, options, label, help_text, external_on_change }) => {
  label = (label !== undefined) ? label : object_key;

  let [value, set_value] = useState(object[object_key]);

  let on_change = (ev) => {
    let new_value = ev.target.value;
    object[object_key] = new_value;
    set_value(new_value);
    if (external_on_change !== undefined) {
      external_on_change(new_value);
    }
  }

  return (
    <div className="row w-100">
      <div className="col-sm-6">
        <label>{label}</label>
      </div>
      <div className="col-sm">
        <select className='custom-select custom-select-sm' value={value} onChange={on_change}>
          {
            options.map((option, i) => {
              return (
                <option value={option.value} key={i}>{option.name}</option>
              );
            })
          }
        </select>
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

export { Dropdown };