import { useState } from 'react';
import { Entry } from '../../app/entries/entry.js';
import { load_entries_from_string } from '../../app/entries/serialise_entries.js';

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
 * Returns a list of entries from a JSON string through a callback
 * @param {(Array[Entry]) => {}} on_save
 * @param {() => {}} on_close
 */
let User_Entries_JSON_Add = ({ on_close, on_save }) => {
  let [string, set_string] = useState("");
  let [total_added, set_total_added] = useState(0);
  let [error, set_error] = useState(null);

  let on_submit = (ev) => {
    ev.preventDefault();
    try {
      let entries = load_entries_from_string(string);
      if (entries.length > 0) {
        on_save(entries);
        set_total_added(entries.length);
        set_error(null);
      } else {
        set_total_added(0);
        set_error('Got an empty array of entries');
      }
    } catch (exception) {
      set_total_added(0);
      set_error(exception.message);
    }
  }

  let on_string_change = (ev) => {
    let new_string = ev.target.value;
    set_string(new_string);
    set_total_added(0);
  }

  let on_cancel = (ev) => {
    on_close();
  }

  return (
    <div>
      <form onSubmit={on_submit} className="w-100">
        <textarea 
          id="string"
          name="string"
          type="text" 
          className={`form-control form-control-sm w-100 py-0 ${error ? 'is-invalid' : ''}`} 
          value={string} onChange={on_string_change}
          rows={4}
          required={true}
        ></textarea>
        {
          error &&
          <Form_Error string={error}></Form_Error>
        }
        <div className="row mt-1">
          <div className="ml-auto" style={{ paddingRight: '0.75rem'}}>
            <button className="btn btn-sm btn-outline-danger mr-2" onClick={on_cancel}>Cancel</button>
            <button className="btn btn-sm btn-outline-success" type="submit">Read</button>
          </div>
        </div>
      </form>
      {
        (total_added > 0) &&
        <div>Added {total_added} entries</div>
      }
    </div>
  );
}

export { User_Entries_JSON_Add };