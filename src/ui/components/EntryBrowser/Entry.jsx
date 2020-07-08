import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import "./Entry.css";
import { select_entry, edit_entry, delete_entry } from '../../actions';
import { EntryEditor } from './EntryEditor';

/**
 * Swap between a basic view and editable form 
 */
export function Entry(props) {
  const dispatch = useDispatch();

  const entry = props.entry;
  const {browser, index} = props;

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

/**
 * Render entry with controls for editing, deleting and copying 
 */
function EntryView(props) {
  let dispatch = useDispatch();
  let [show_actions, set_show_actions] = useState(false);
  let [copy_success, set_copy_success] = useState(false);

  const {browser, index} = props;
  const {name, ca_string} = props;
  const selected = props.selected;
  const {del, copy, edit} = props.actions;
  const onEdit = props.onEdit;


  const on_select = ev => {
    dispatch(select_entry(browser, index));
    ev.preventDefault();
  }
  // base actions
  const on_delete = ev => {
    dispatch(delete_entry(browser, index));
    ev.preventDefault();
  }

  const on_copy = ev => {
    navigator.permissions.query({name: 'clipboard-write'}).then(res => {
      if (res.state === 'granted' || res.state === 'prompt') {
        navigator.clipboard.writeText(ca_string)
          .then(() => set_copy_success(true));
      }
    });
    ev.preventDefault();
  }

  const on_edit = ev => {
    ev.preventDefault();
    onEdit && onEdit();
  }

  const render_copy_tooltip = () => (
    <div className={`tooltip copy-text ${copy_success ? 'show' : 'fade'}`} role="tooltip">
      <div className="tooltip-inner">Copied {name}!</div>
    </div>
  );

  const render_copy_button = () => ( 
    <div className="d-inline">
      <button className="btn btn-circle btn-sm btn-light" role="button" 
          onClick={on_copy} onMouseLeave={() => set_copy_success(false)}>
        <span className="icon text-gray-600">
          <i className="fas fa-copy"></i>
        </span>
      </button>
      {render_copy_tooltip()}
    </div>
  );


  const render_actions = () => (
    <div className={`actions ${!show_actions && 'fade'}`} onMouseOver={() => set_show_actions(true)}>
      {copy && render_copy_button()}
      {del && <button className="btn btn-circle btn-sm btn-danger" role="button" onClick={on_delete}><i className="fas fa-trash"></i></button>}
      {edit && <button className="btn btn-circle btn-sm btn-primary" role="button" onClick={on_edit}><i className="fas fa-edit"></i></button>}
    </div>
  );

  return (
    <li className={`list-group-item ${selected ? 'active' : ''}`}>
      <div 
        onMouseEnter={() => set_show_actions(true)}
        onMouseLeave={() => set_show_actions(false)}>
        <div onClick={on_select}>
          <div>Name: {name}</div>
          <div>Rule: {ca_string}</div>
        </div>
        {render_actions()}
      </div>
    </li>
  );
}
