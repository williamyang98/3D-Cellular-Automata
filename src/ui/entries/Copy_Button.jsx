import { useState } from 'react';
import { copy_to_clipboard } from './copy_to_clipboard.js';

let Copy_Button = ({ string, tooltip }) => {
  let [is_show_copy_done, set_is_show_copy_done] = useState(false);

  let tooltip_style = {
    transform: 'translate(-100%, -100%)',
    float: 'left',
    minWidth: '10rem',
    textAlign: 'center',
    wordWrap: 'normal',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  let on_click = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    copy_to_clipboard(string, () => {
      set_is_show_copy_done(true);
    });
  }

  return (
    <div>
      <button 
        className="btn btn-circle btn-sm btn-light"  
        onClick={on_click} 
        onMouseLeave={() => set_is_show_copy_done(false)}
      >
        <span className="icon text-gray-600"><i className="fas fa-copy"></i></span>
      </button>
      <div 
        className={`tooltip ${is_show_copy_done ? 'show' : 'd-none'}`} 
        style={tooltip_style} role="tooltip"
      >
        <div className="tooltip-inner">Copied {tooltip}!</div>
      </div>
    </div>
  )
}

export { Copy_Button };
