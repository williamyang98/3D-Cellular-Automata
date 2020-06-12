import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import "./Entry.css";

export function Entry(props) {
  const dispatch = useDispatch();

  const entry = props.entry;
  const {browser, index} = props;
  const {del, copy, edit} = props;
  const selected = props.selected;

  let data = {key: browser, index};

  let [show_actions, set_show_actions] = useState(false);
  let [copy_success, set_copy_success] = useState(false);

  function on_select(ev) {
    dispatch({type:'entry.select', value:data});
    ev.preventDefault();
  }

  function on_delete(ev) {
    dispatch({type:'entry.delete', value:data});
    ev.preventDefault();
  }

  function on_copy(ev) {
    navigator.permissions.query({name: 'clipboard-write'}).then(res => {
      if (res.state === 'granted' || res.state === 'prompt') {
        navigator.clipboard.writeText(entry.description)
          .then(() => set_copy_success(true));
      }
    });
    ev.preventDefault();
  }

  function on_edit(ev) {
    ev.preventDefault();
  }

  const actions = (
    <div className={`actions ${show_actions ? '' : 'fade'}`}>
      {copy && 
        <button className="btn btn-circle btn-sm btn-light" role="button" 
            onClick={on_copy} onMouseLeave={() => set_copy_success(false)}>
        <span className="icon text-gray-600">
          <i className="fas fa-copy"></i>
        </span>
        <div className={`tooltip copy-text ${copy_success ? 'show' : 'fade'}`} role="tooltip">
          <div className="tooltip-inner">Copied {entry.name}!</div>
        </div>
      </button>}

      {del && <button className="btn btn-circle btn-sm btn-danger" role="button" onClick={on_delete}><i className="fas fa-trash"></i></button>}
      {edit && <button className="btn btn-circle btn-sm btn-warning" role="button" onClick={on_edit}><i className="fas fa-edit"></i></button>}
    </div>
  );


  return (
    <li className={`list-group-item ${selected ? 'active' : ''}`}
        onMouseEnter={() => set_show_actions(true)} onMouseLeave={() => set_show_actions(false)}>
      <div onClick={on_select}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </div>
      {actions}
    </li>
  );
}
