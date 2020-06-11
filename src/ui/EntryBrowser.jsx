import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { EntryEditor } from './EntryEditor';

export function EntryBrowser() {
  const dispatch = useDispatch();

  const selected_browser_key = useSelector(state => state.entry_browser.current_browser_key);
  const selected_index = useSelector(state => state.entry_browser.selected_browser.current_index);

  const browsers = useSelector(state => state.entry_browser.browsers);

  let [browser_key, set_browser_key] = useState(selected_browser_key);

  const entries = browsers[browser_key].entries;

  let browser_keys = [];
  for (let key in browsers) {
    browser_keys.push(key);
  }

  const rule_items = entries.map((e, i) => render_entry(e, i));

  function render_browser_select(key, index) {
    function onClick() {
      set_browser_key(key);
    }
    return (
      <a className="dropdown-item" href="#" key={index} onClick={onClick}>{key}</a>
    );
  }

  function render_entry(entry, index) {
    let selected = selected_index === index && selected_browser_key === browser_key;
    let class_name = selected ? 'active' : '';
    function onClick() {
      let data = {key: browser_key, index: index};
      dispatch({type:'entry.select', value:data});
    }
    return (
      <li className={"list-group-item "+class_name} key={index} onClick={onClick}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </li>
    );
  }


  const controls = (
    <div className="d-flex flex-row">
      {/* Add button */}
      {/* <i className={`fas fa-plus-square mr-2`}></i> */}
      <div className="dropdown no-arrow">
        <a className="dropdown-toggle" href="#" role="button" id="add_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className={`fas fa-plus-square mr-2`}></i>
        </a>
        <div className="dropdown-menu dropdown-menu-right shadow col-sm-10" aria-labelledby="add_dropdown" style={{minWidth:'25.0rem'}}>
          <EntryEditor></EntryEditor>
        </div>
      </div>
      {/* Categories */}
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
        {controls}
      </div>
      <div className="collapse show" id="collapseRulesBrowser">
        <ul className="list-group">{rule_items}</ul>
      </div>
    </div>
  );
}