import { useState } from 'react';
import { copy_to_clipboard } from './copy_to_clipboard.js';
import { save_entries_to_string } from '../../app/entries/serialise_entries.js';

/**
 * Copies array of entries to clipboard as JSON string
 * @param {Array[Entry]} entries 
 */
let User_Entries_JSON_Copy = ({ entries }) => {
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

    let string = save_entries_to_string(entries, 2);
    copy_to_clipboard(string, () => {
        set_is_show_copy_done(true);
    });
  }

  let on_mouse_leave = (ev) => {
    set_is_show_copy_done(false);
  }

  return (
    <div>
      <button className="btn btn-sm btn-primary" onClick={on_click} onMouseLeave={on_mouse_leave}>
        Copy as JSON
      </button>
      <div 
        className={`tooltip ${is_show_copy_done ? 'show' : 'd-none'}`} 
        style={tooltip_style} role="tooltip"
      >
        <div className="tooltip-inner">Copied {entries.length} entries!</div>
      </div>
    </div>
  )
}

export { User_Entries_JSON_Copy };