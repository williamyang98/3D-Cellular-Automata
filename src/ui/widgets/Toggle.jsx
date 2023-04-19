import { useState } from 'react';

let Toggle = ({ object, object_key, external_on_change }) => {
  let [is_checked, set_is_checked] = useState(object[object_key]);

  let on_change = (ev) => {
    let value = Boolean(ev.target.checked);
    object[object_key] = value;
    set_is_checked(value);
    if (external_on_change !== undefined) {
      external_on_change(value);
    }
  }
  
  const style = { width: '1.5rem', height: '1.5rem' };
  return (
    <div style={style}>
      <input 
        type='checkbox' className='form-check-input ml-0'
        checked={is_checked} onChange={on_change}/>
    </div>
  );
}

export { Toggle };