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
      return <Entry {...props} key={`${browser_key}_${i}_${e.id}`}></Entry>
    });
  }

  function render_browser_select(key, index) {
    function onClick() {
      set_browser_key(key);
    }
    return (
      <a className="dropdown-item" href="#" key={index} onClick={onClick}>{key}</a>
    );
  }

  const render_controls = (
    <div className="d-flex flex-row">
      <div className="dropdown no-arrow">
        <a className="dropdown-toggle" href="#" role="button" id="category_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="fas fa-caret-square-down"></i>
        </a>
        <div className="dropdown-menu dropdown-menu-right shadow" aria-labelledby="category_dropdown">
          {browser_keys.map((e, i) => render_browser_select(e, i))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card shadow mb-2">
      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Rules ({browser_key})</h6>
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
