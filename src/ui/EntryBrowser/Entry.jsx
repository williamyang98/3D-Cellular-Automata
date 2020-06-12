import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export function Entry(props) {
  const dispatch = useDispatch();

  const entry = props.entry;
  const {browser, index} = props;
  const {del, copy, edit} = props;
  const selected = props.selected;

  let data = {key: browser, index};

  let [show_actions, set_show_actions] = useState(false);
  let [copy_success, set_copy_success] = useState(false);

  function on_select(ev) {
    dispatch({type:'entry.select', value:data});
    ev.preventDefault();
  }

  function on_delete(ev) {
    dispatch({type:'entry.delete', value:data});
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
    ev.preventDefault();
  }

  const copy_tooltip = copy_success ? {'data-toggle': 'tooltip', 'data-placement': 'top', 'title': `Copied ${entry.name}`} : {};

  const actions = (
    <div className={`${show_actions ? '' : 'fade'}`}
         style={{zIndex:1, position:'absolute', top: '0.5rem', right: '0.5rem'}}>

      {copy ? 
        <div className="btn btn-circle btn-sm btn-light" role="button" 
             onClick={on_copy} onMouseLeave={() => set_copy_success(false)}>
          <span className="icon text-gray-600" {...copy_tooltip}>
            <i className="fas fa-copy"></i>
          </span>
        </div> 
        : <div></div>}
      {del ? <div className="btn btn-circle btn-sm btn-danger" role="button" onClick={on_delete}><i className="fas fa-trash"></i></div> : <div></div>}
      {edit ? <div className="btn btn-circle btn-sm btn-warning" role="button" onClick={on_edit}><i className="fas fa-edit"></i></div> : <div></div>}
    </div>
  );


  return (
    <li className={`list-group-item ${selected ? 'active' : ''}`}
        onMouseEnter={() => set_show_actions(true)} onMouseLeave={() => set_show_actions(false)}>
      <div onClick={on_select}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </div>
      {actions}
    </li>
  );
}
