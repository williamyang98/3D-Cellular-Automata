import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function ShaderMenu() {
  const shader_manager = useSelector(state => state.shader_manager);
  const current_shader = useSelector(state => state.shader_manager.current_shader);
  const dispatch = useDispatch();

  function render_entry(entry, index) {
    let selected = current_shader === index;
    let class_name = selected ? 'active' : '';
    return (
      <li className={"list-group-item "+class_name} key={index} onClick={() => dispatch({type:'shader.select', value:index})}>
        <div>Name: {entry.name}</div>
      </li>
    );
  }

  const entries = shader_manager.shaders.map((e, i) => render_entry(e, i));
  return (
    <ul className='list-group'>{entries}</ul>
  );
}