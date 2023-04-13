import { useState } from 'react';
import { Help } from './Help';

let Toggle = ({ object, object_key, label, help_text, external_on_change }) => {
  label = (label !== undefined) ? label : object_key;

  let [is_checked, set_is_checked] = useState(object[object_key]);

  let on_change = (ev) => {
    let value = Boolean(ev.target.checked);
    object[object_key] = value;
    set_is_checked(value);
    if (external_on_change !== undefined) {
      external_on_change(value);
    }
  }

  return (
    <div className="row w-100">
      <div className="col-sm-6">
        <label className='form-check-label'>{label}</label>
      </div>
      <div className="col-sm">
        <div>
          <input 
            type='checkbox' className='form-check-input ml-0'
            checked={is_checked} onChange={on_change}/>
        </div>
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

export { Toggle };