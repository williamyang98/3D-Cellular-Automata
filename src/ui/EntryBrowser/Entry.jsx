import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import "./Entry.css";

export function Entry(props) {
  const dispatch = useDispatch();
  const entry_browser = useSelector(store => store.entry_browser);

  const entry = props.entry;
  const {browser, index} = props;
  const {del, copy, edit} = props;
  const selected = props.selected;

  let data = {key: browser, index};

  let [show_actions, set_show_actions] = useState(false);
  let [copy_success, set_copy_success] = useState(false);
  let [editing, set_editing] = useState(false);
  let [error, set_error] = useState(undefined);

  let [name, set_name] = useState(entry.name);
  let [description, set_description] = useState(entry.description);

  function on_select(ev) {
    dispatch({type:'entry.select', value:data});
    ev.preventDefault();
  }

  function on_delete(ev) {
    dispatch(() => {
      entry_browser.delete(browser, index)
        .then(() => dispatch({type: 'entry.refresh'}));
    });
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
    set_editing(true);
    ev.preventDefault();
  }

  function stop_edit(ev) {
    set_editing(false);
    set_name(entry.name);
    set_description(entry.description);
    ev.preventDefault();
  }

  function on_submit(ev) {
    if (ev) {
      ev.preventDefault();
    }
    dispatch(() => {
      entry_browser.edit(browser, index, name, description)
        .then(() => {
          set_editing(false);
          set_error(false);
          dispatch({type: 'entry.refresh'});
        }, (err) => set_error(err));
    });
  }

  const copy_action = copy && 
    <div className="d-inline">
      <button className="btn btn-circle btn-sm btn-light" role="button" 
          onClick={on_copy} onMouseLeave={() => set_copy_success(false)}>
        <span className="icon text-gray-600">
          <i className="fas fa-copy"></i>
        </span>
      </button>
      <div className={`tooltip copy-text ${copy_success ? 'show' : 'fade'}`} role="tooltip">
        <div className="tooltip-inner">Copied {entry.name}!</div>
      </div>
    </div>;

  const actions = (
    <div className={`actions ${show_actions ? '' : 'fade'}`} onMouseOver={() => set_show_actions(true)}>
      {copy_action}
      {/* Delete entry */}
      {!editing && del && <button className="btn btn-circle btn-sm btn-danger" role="button" onClick={on_delete}><i className="fas fa-trash"></i></button>}
      {/* Start Editing */}
      {edit && !editing && <button className="btn btn-circle btn-sm btn-primary" role="button" onClick={on_edit}><i className="fas fa-edit"></i></button>}
      {/* End editing or Submit Edit*/}
      {edit && editing && <button className="btn btn-circle btn-sm btn-warning" role="button" onClick={stop_edit}><i className="fas fa-ban"></i></button>}
      {edit && editing && <button className="btn btn-circle btn-sm btn-success" role="button" onClick={on_submit}><i className="fas fa-check-circle"></i></button>}
    </div>
  );

  const render_normal_body = () => 
    (
      <div onClick={on_select}>
        <div>Name: {name}</div>
        <div>Rule: {description}</div>
      </div>
    );
  
  let err_fmt = error ? 'is-invalid' : '';
 
  function render_errors(str) {
    let lines = String(str).split('\n');
    return (
      <div className="invalid-feedback">
        {lines.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    );
  }

  function on_key_down(ev) {
    if(ev.keyCode === 13) {
      on_submit(ev);
    }
  }

  const render_editable_body = () => (
    <form onSubmit={on_submit} onKeyDown={on_key_down} className="w-75">
      <div className="form-group row mb-0 mt-0">
        <label className="col-sm-3 col-form-label py-0">Name:</label>
        <div className="col-sm py-0">
          <input type="text" className="form-control form-control-sm w-100 py-0" value={name} onChange={ev => set_name(ev.target.value)}/>
        </div>
      </div>
      <div className="form-group row mt-0 mb-0">
        <label className="col-sm-3 col-form-label py-0">Rule:</label>
        <div className="col-sm py-0">
          <input type="text" className={`form-control form-control-sm w-100 py-0 ${err_fmt}`} id="ca_string" value={description} onChange={ev => set_description(ev.target.value)}/>
          {error ? render_errors(error) : <div></div>}
        </div>
      </div>
    </form>
  );

  const body = editing ? render_editable_body() : render_normal_body();

  return (
    <li className={`list-group-item ${selected ? 'active' : ''}`}
        onMouseEnter={() => set_show_actions(true)} onMouseLeave={() => set_show_actions(false)}>
      {body}
      {actions}
    </li>
  );
}
