import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { EntryEditor } from './EntryEditor';
import { create_entry } from '../../actions';

export function AddButton() {
  let dispatch = useDispatch();
  let [editing, set_editing] = useState(false);
  let [errors, set_errors] = useState(false);

  const render_add_button = () => (
    <li className="list-group-item" style={{textAlign:'center'}}>
      <button className="btn btn-circle btn-md btn-secondary shadow" onClick={() => set_editing(true)}>
        <span className="icon text-white-600 m-0">
          <i className="fas fa-plus"></i>
        </span>
      </button>
    </li>
  );

  const on_submit = (name, ca_string) => {
    dispatch(create_entry(name, ca_string, err => {
      set_errors(err);
      err ? set_editing(true) : set_editing(false);
    }));
  }

  const on_exit = () => {
    set_editing(false);
    set_errors(false);
  }

  const render_form = () => (
    <li className="list-group-item">
      <EntryEditor errors={errors} onSubmit={on_submit} onExit={on_exit}></EntryEditor>
    </li>
  );

  return editing ? render_form() : render_add_button()
}