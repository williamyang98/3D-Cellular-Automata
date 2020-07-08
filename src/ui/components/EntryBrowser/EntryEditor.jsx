import React, { useState } from 'react';
import "./Entry.css";

export function EntryEditor(props) {
  const [name, set_name] = useState(props.name || '');
  const [ca_string, set_ca_string] = useState(props.ca_string || '');
  let [show_actions, set_show_actions] = useState(false);
  const onSubmit = props.onSubmit;
  const onExit = props.onExit;
  const errors = props.errors;

  function on_key_down(ev) {
    if(ev.keyCode === 13) {
      on_submit(ev);
    }
  }

  function on_submit(ev) {
    if (ev) ev.preventDefault();
    onSubmit && onSubmit(name, ca_string);
  }

  function on_exit() {
    onExit && onExit();
  }
 
  function render_errors(str) {
    let lines = String(str).split('\n');
    return (
      <div className="invalid-feedback">
        {lines.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    );
  }

  const err_fmt = errors ? 'is-invalid' : '';

  const form = (
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
          <input type="text" className={`form-control form-control-sm w-100 py-0 ${err_fmt}`} id="ca_string" value={ca_string} onChange={ev => set_ca_string(ev.target.value)}/>
          {errors && render_errors(errors)}
        </div>
      </div>
    </form>
  );

  const actions = (
    <div 
      className={`actions ${!show_actions && 'fade'}`} 
      onMouseOver={() => set_show_actions(true)}>
      <button className="btn btn-circle btn-sm btn-warning" role="button" onClick={on_exit}><i className="fas fa-ban"></i></button>
      <button className="btn btn-circle btn-sm btn-success" role="button" onClick={on_submit}><i className="fas fa-check-circle"></i></button>
    </div>
  );

  return (
    <div 
      onMouseEnter={() => set_show_actions(true)}
      onMouseLeave={() => set_show_actions(false)}>
      {form}
      {actions}
    </div>
  )
}