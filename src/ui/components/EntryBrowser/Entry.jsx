import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import "./Entry.css";
import { edit_entry } from '../../actions';
import { EntryEditor } from './EntryEditor';
import { EntryView } from './EntryView';

/**
 * Swap between a basic view and editable form 
 */
export function Entry(props) {
  const dispatch = useDispatch();

  const entry = props.entry;
  const { browser, index } = props;

  // for editing
  let [editing, set_editing] = useState(false);
  let [errors, set_errors] = useState(undefined);

  let [name, set_name] = useState(entry.name);
  let [ca_string, set_ca_string] = useState(entry.description);

  const on_submit = (name, ca_string) => {
    dispatch(edit_entry(browser, index, name, ca_string, err => {
      set_errors(err);
      err ? set_editing(true) : set_editing(false);
      if (!err) {
        set_name(name);
        set_ca_string(ca_string);
      }
    }))
  }

  const on_exit = () => {
    set_editing(false);
    set_errors(false);
  }

  const render_editable_body = () => (
    <li className="list-group-item">
      <EntryEditor name={name} ca_string={ca_string} onSubmit={on_submit} onExit={on_exit} errors={errors}></EntryEditor>
    </li>
  )

  const render_normal_body = () => (
    <EntryView
      browser={browser} index={index}
      name={name} ca_string={ca_string}
      actions={props.actions}
      selected={props.selected}
      onEdit={() => set_editing(true)}></EntryView>
  );

  return editing ? render_editable_body() : render_normal_body();
}