import { useState } from 'react';

import { Entry } from '../../app/entries/entry.js';
import { read_rule_from_string } from '../../app/entries/read_rule_from_string';

let Form_Error = ({ string }) => {
  let lines = String(string).split('\n');
  return (
    <div className="invalid-feedback">
      {
        lines.map((line, i) => {
          return <div key={i}>{line}</div>;
        })
      }
    </div>
  );
}

/**
 * @param {String} props.label 
 * @param {String} props.string 
 * @param {(Entry) => {}} props.on_save
 * @param {() => {}} props.on_close
 */
let User_Entry_Edit = (props) => {
  let [label, set_label] = useState(props.label);
  let [string, set_string] = useState(props.string);

  const string_tooltip = (
    "[Remain Alive]/[Become Alive]/[Total States]/[Neighbourhood]\n"+
    "[Remain Alive]: Range where a cell stays alive. E.g. 0-3,9\n"+
    "[Become Alive]: Range where a cell goes from dead to alive. E.g. 0-3,9\n"+
    "[Total States]: Number of states a cell goes through when dying. E.g. 10\n"+
    "[Neighbourhood]: Type of neighbour counting. 'M' counts all 26, and 'VN' counts 6"
  )

  // Validate inputs
  let error = null;
  try {
    let rule = read_rule_from_string(string);
  } catch (exception) {
    error = exception.message;
  }

  let attempt_save = () => {
    if ((props.on_save !== undefined) && (error === null)) {
      let entry = new Entry();
      entry.label = label;
      entry.set_string(string);
      props.on_save(entry);
    }
  }

  let on_label_change = (ev) => {
    let new_label = ev.target.value;
    set_label(new_label);
  }

  let on_string_change = (ev) => {
    let new_string = ev.target.value;
    set_string(new_string);
  }

  let on_key_down = (ev) => {
    const KEYCODE_ENTER = 13;
    if (ev.keyCode === KEYCODE_ENTER) {
      attempt_save();
    }
  }

  let on_submit = (ev) => {
    ev.preventDefault();
    attempt_save();
  }

  let on_cancel = (ev) => {
    ev.preventDefault();
    if (props.on_close !== undefined) {
      props.on_close();
    }
  }

  return (
    <form onSubmit={on_submit} onKeyDown={on_key_down} className="w-100">
      <div className="form-group row mb-0 mt-0">
        <label className="col-3 col-form-label py-0 text-nowrap">Name:</label>
        <div className="col-9 py-0">
          <input id="label" type="text" className="form-control form-control-sm w-100 py-0" value={label} onChange={on_label_change}/>
        </div>
      </div>
      <div className="form-group row mt-0 mb-0">
        <div className="col-3 col-form-label py-0">
          <div className="d-flex">
            <div className="d-inline-block mr-1">
              <label className="text-nowrap">Rule:</label>
            </div>
            <div className="d-inline-block">
              <span data-toggle="tooltip" data-placement="left" data-html={true} title={string_tooltip}>
                <i className="fas fa-question-circle"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-9 py-0">
          <input 
            id="string"
            type="text" 
            className={`form-control form-control-sm w-100 py-0 ${error ? 'is-invalid' : ''}`} 
            value={string} onChange={on_string_change}/>
          {
            error &&
            <Form_Error string={error}></Form_Error>
          }
        </div>
      </div>
      <div className="row mt-1">
        <div className="ml-auto" style={{ paddingRight: '0.75rem'}}>
          <button className="btn btn-sm btn-outline-danger mr-2" onClick={on_cancel}>Cancel</button>
          <button className="btn btn-sm btn-outline-success" type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}

export { User_Entry_Edit };