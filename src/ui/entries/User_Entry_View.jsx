import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Copy_Button } from './Copy_Button';
import { User_Entry_Edit } from './User_Entry_Edit';

import { Entry } from '../../app/entries/entry.js';

/**
 * @param {App} app 
 * @param {Entry} entry
 * @param {Number} index
 */
let User_Entry_View = ({ app, recoil_state, entry, index }) => {
  let [is_editing, set_is_editing] = useState(false);
  let [current_entry, set_current_entry] = useRecoilState(recoil_state.current_entry);
  let refresh_randomiser_list = useSetRecoilState(recoil_state.randomiser_list);
  let refresh_user_entries_list = useSetRecoilState(recoil_state.user_entries_list);

  const is_selected = (entry === current_entry);

  let on_select = () => {
    app.select_entry(entry);
    set_current_entry(entry);
    // NOTE: When we select an entry the randomiser presets are applied
    refresh_randomiser_list();
  }

  let on_edit = (ev) => {
    ev.stopPropagation();
    set_is_editing(true);
  }

  let on_close = () => {
    set_is_editing(false);
  }

  let on_delete = (ev) => {
    ev.stopPropagation();
    app.user_entries_list.delete_entry(index);
    refresh_user_entries_list();
    // NOTE: Deselect entry if we deleted it
    if (is_selected) {
      app.select_entry(null);
      set_current_entry(null);
    }
  }

  let on_save = (new_entry) => {
    set_is_editing(false);
    app.user_entries_list.replace_entry(index, new_entry);
    refresh_user_entries_list();
    // NOTE: Reselect entry after we replaced it
    if (is_selected) {
      app.select_entry(new_entry);
      set_current_entry(new_entry);
    }
  }

  // NOTE: Bootstrap adds rounded corners to first and last items in list
  let override_styles = { borderRadius: '0' };
  const is_highlight = is_selected && !is_editing;
  return (
    <li className={`list-group-item ${is_highlight ? 'active' : ''}`} style={override_styles}>
      <div className={`${is_editing ? 'd-none' : ''}`}>
        <div onClick={(ev) => on_select()}>
          <div>Name: {entry.label}</div>
          <div className="d-flex">
            <div className="d-inline-block">Rule: {entry.string}</div>
            <div className="d-inline-block ml-auto">
              <div className="ml-auto d-flex" style={{zIndex:1}}>
                <div className="d-inline-block">
                  <button className="btn btn-circle btn-sm btn-danger"  onClick={on_delete}><i className="fas fa-trash"></i></button>
                </div>
                <div className="d-inline-block">
                  <button className="btn btn-circle btn-sm btn-warning"  onClick={on_edit}><i className="fas fa-edit"></i></button>
                </div>
                <div className="d-inline-block">
                  <Copy_Button string={entry.string} tooltip={entry.label}></Copy_Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${!is_editing ? 'd-none' : ''}`}>
        <User_Entry_Edit label={entry.label} string={entry.string} on_save={on_save} on_close={on_close}></User_Entry_Edit>
      </div>
    </li>
  );
}

export { User_Entry_View };