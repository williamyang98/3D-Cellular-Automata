import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

export function EntryBrowser() {
  const dispatch = useDispatch();
  const browser = useSelector(state => state.entry_browser);
  const current_index = useSelector(state => state.entry_browser.current_index);

  function render_entry(entry, index) {
    let selected = index === current_index;
    let class_name = selected ? 'active' : '';
    return (
      <li className={"list-group-item "+class_name} key={index} onClick={() => dispatch({type:'entry.select', value:index})}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </li>
    );
  }

  const rule_items = browser.entries.map((e, i) => render_entry(e, i));

  return (
    <div className="card shadow mb-2">
      <a href="#collapseRulesBrowser" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseRulesBrowser">
        <h6 className="m-0 font-weight-bold text-primary">Rules</h6>
      </a>
      <div className="collapse show" id="collapseRulesBrowser">
        <ul className="list-group">{rule_items}</ul>
      </div>
    </div>
  );
}