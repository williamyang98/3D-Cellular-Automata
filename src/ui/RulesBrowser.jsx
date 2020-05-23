import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

export function RulesBrowser() {
  const browser = useSelector(state => state.rule_browser);
  const selected_entry = useSelector(state => state.rule_browser.selected_entry);
  const dispatch = useDispatch();

  function render_entry(entry, index) {
    let selected = index === selected_entry;
    let class_name = selected ? 'active' : '';
    return (
      <li className={"list-group-item "+class_name} key={index} onClick={() => dispatch({type:'rule.select', value:index})}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </li>
    );
  }

  const rule_items = browser.entries.map((e, i) => render_entry(e, i));

  return (
    <ul className="list-group">{rule_items}</ul>
  );
}