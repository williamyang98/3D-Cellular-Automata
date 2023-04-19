import { useState } from 'react';

/**
 * 
 * @param {Array(Object(name, value))} options 
 */
let Dropdown = ({ object, object_key, options, external_on_change }) => {
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
    <div className="w-100">
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
  );
}

export { Dropdown };