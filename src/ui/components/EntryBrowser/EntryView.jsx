import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import "./Entry.css";
import { select_entry, delete_entry } from '../../actions';

/**
 * Render entry with controls for editing, deleting and copying 
 */
export function EntryView(props) {
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
      <button className="btn btn-circle btn-sm btn-light"  
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
      {del && <button className="btn btn-circle btn-sm btn-danger"  onClick={on_delete}><i className="fas fa-trash"></i></button>}
      {edit && <button className="btn btn-circle btn-sm btn-primary"  onClick={on_edit}><i className="fas fa-edit"></i></button>}
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