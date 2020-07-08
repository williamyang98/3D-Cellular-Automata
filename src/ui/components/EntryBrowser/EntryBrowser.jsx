import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { Entry } from './Entry';
import { AddButton } from './AddButton';

export function EntryBrowser() {
  const selected_browser_key = useSelector(state => state.entry_browser.current_browser_key);
  const selected_index = useSelector(state => state.entry_browser.selected_browser.current_index);

  let [browser_key, set_browser_key] = useState(selected_browser_key);

  const browsers = useSelector(state => state.entry_browser.browsers);
  const entries = useSelector(state => state.entry_browser.get_entries(browser_key));

  let is_user = (browser_key === 'User');

  let browser_keys = [];
  for (let key in browsers) {
    browser_keys.push(key);
  }

  function render_rule_items() { 
    return entries.map((e, i) => {
      let props = {
        entry: e, 
        browser: browser_key, index: i,
        actions: {del: is_user, copy: true, edit: is_user},
        selected: i === selected_index && browser_key === selected_browser_key,
      }
      let index = e.id === undefined ? i : e.id;
      return <Entry {...props} key={`${browser_key}_${index}`}></Entry>
    });
  }

  const render_controls = (
    <div className="d-flex flex-row my-0 py-0">
      <div className="btn-group py-0 my-0">
        {browser_keys.map((e, i) => { 
          let selected = e === browser_key;
          return (
            <button 
              className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline-secondary'}`} 
              key={i} onClick={() => set_browser_key(e)}>{e}</button>
          )
        })}
      </div>
    </div>
  );

  return (
    <div className="card shadow mb-2">
      <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Rules</h6>
        {render_controls}
      </div>
      <div className="collapse show" id="collapseRulesBrowser">
        <ul className="list-group">
          {render_rule_items()}
        </ul>
        {is_user && <AddButton></AddButton>}
      </div>
    </div>
  );
}
