import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { create_entry } from '../../actions';

export function EntryEditor() {
  const dispatch = useDispatch();  
  const [name, set_name] = useState('');
  const [ca_string, set_ca_string] = useState('');
  const [error, set_error] = useState(false);

  const entry_browser = useSelector(store => store.entry_browser);

  function on_submit(ev) {
    dispatch(create_entry(name, ca_string, err => set_error(err)));
    ev.preventDefault();
  }

  let err_fmt = error ? 'is-invalid' : '';
 
  function render_errors(str) {
    let lines = String(str).split('\n');
    return (
      <div className="invalid-feedback">
        {lines.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    );
  }

  return (
    <form className="px-4 pb-4" onSubmit={on_submit}>
      <h6 className="m-0 font-weight-bold text-secondary mt-3">User Entry</h6>
      <div className="dropdown-divider"></div>
      <div className="form-group row mb-2 mt-2">
        <label className="col-sm col-form-label">Name</label>
        <div className="col-sm-10">
          <input type="text" className="form-control form-control-sm" value={name} onChange={ev => set_name(ev.target.value)}/>
        </div>
      </div>
      <div className="form-group row mb-2">
        <label className="col-sm col-form-label">Rule</label>
        <div className="col-sm-10">
          <input type="text" className={`form-control form-control-sm ${err_fmt}`} id="ca_string" value={ca_string} onChange={ev => set_ca_string(ev.target.value)}/>
          {error ? render_errors(error) : <div></div>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-sm" style={{float:'right'}}>Add</button>
    </form>
  );
}