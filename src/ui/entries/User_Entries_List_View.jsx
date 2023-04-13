import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { User_Entry_View } from './User_Entry_View.jsx';
import { User_Entry_Edit } from './User_Entry_Edit.jsx';
import { User_Entries_JSON_Add } from './User_Entries_JSON_Add.jsx';
import { User_Entries_JSON_Copy } from './User_Entries_JSON_Copy.jsx';

import { User_Entries_List } from '../../app/entries/user_entries_list.js';

/**
 * Controls panel at the bottom of a user entries list 
 * Allows for: 
 * - adding new entries
 * - adding new entries from a json string
 * - copying existing entries into a json string for sharing
 * @param {User_Entries_List} user_entries_list
 */
let User_Entries_List_Controls = ({ user_entries_list, recoil_state }) => {
  let [is_add_entry, set_is_add_entry] = useState(false);
  let [is_add_entries_from_json, set_is_add_entries_from_json] = useState(false);
  let refresh_user_entries_list = useSetRecoilState(recoil_state.user_entries_list);

  let entries = user_entries_list.entries;
  const is_busy = is_add_entry || is_add_entries_from_json;

  let on_add_entry_close = () => {
    set_is_add_entry(false);
  }

  let on_add_entry_save = (new_entry) => {
    set_is_add_entry(false);
    user_entries_list.add_entry(new_entry);
    refresh_user_entries_list();
  }

  let on_add_entries_from_json_save = (new_entries) => {
    user_entries_list.add_entries(new_entries);
    refresh_user_entries_list();
  }

  let on_add_entries_from_json_close = () => {
    set_is_add_entries_from_json(false);
  }

  // NOTE: Bootstrap adds rounded corners to first and last items in list
  let override_styles = { borderRadius: '0' };
  return (
    <li className='list-group-item' style={override_styles}>
      <div className={is_busy ? 'd-none' : ''}>
        <div className="d-flex justify-content-center">
          <div className="d-inline-block">
            <button className="btn btn-sm btn-primary mr-1" onClick={() => set_is_add_entry(true)}>Add Entry</button> 
          </div>
          <div className="d-inline-block">
            <button className="btn btn-sm btn-primary mr-1" onClick={() => set_is_add_entries_from_json(true)}>Add from JSON</button> 
          </div>
          <div className="d-inline-block">
            <User_Entries_JSON_Copy entries={entries}></User_Entries_JSON_Copy>
          </div>
        </div>
      </div>
      <div className={!is_add_entry ? 'd-none' : ''}>
        <User_Entry_Edit 
          label={""} string={""} 
          on_save={on_add_entry_save} 
          on_close={on_add_entry_close}
        ></User_Entry_Edit>
      </div>
      <div className={!is_add_entries_from_json ? 'd-none' : ''}>
        <User_Entries_JSON_Add 
          on_save={on_add_entries_from_json_save} 
          on_close={on_add_entries_from_json_close}
        ></User_Entries_JSON_Add>
      </div>
    </li>
  )
}

let User_Entries_List_View = ({ app, recoil_state }) => {
  let unique_key = useRecoilValue(recoil_state.user_entries_list);
  let entries_list = app.user_entries_list;
  let entries = entries_list.entries;

  return (
    <div key={unique_key}>
      <ul className="list-group">
        {
          entries.map((entry, index) => {
            return <User_Entry_View key={index} app={app} recoil_state={recoil_state} index={index} entry={entry}></User_Entry_View>;
          })
        }
        <User_Entries_List_Controls user_entries_list={entries_list} recoil_state={recoil_state}></User_Entries_List_Controls>
      </ul>
    </div>
  );
}

export { User_Entries_List_View };