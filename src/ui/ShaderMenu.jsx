import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function ShaderMenu() {
  const shaders = useSelector(state => state.shader_manager.shaders);
  const current_shader = useSelector(state => state.shader_manager.current_shader);
  const shader_params = useSelector(state => state.shader_manager.params);
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

  function set_param(name, value) {
    let action = {type:'shader.set_param', name:name, value:value};
    dispatch(action);
  }

  function render_param(index, name, param) {
    switch (param.type) {
      case 'slider':
        {
          let step = (param.max-param.min)/100.0;
          let onChange = (event) => {
            set_param(name, Number(event.target.value));
          }
          return (
            <div className='form-group' key={index}>
              <label>{name}: {param.value.toFixed(2)}</label>
              <input 
                className='form-control-range' type='range' 
                min={param.min} max={param.max} value={param.value} step={step}
                onChange={onChange}></input> 
            </div>);
          }
    }
  }


  const entries = shaders.map((e, i) => render_entry(e, i));
  const params = Object
    .entries(shader_params)
    .map(([name, param], index) => render_param(index, name, param));

  return (
    <div>
      <ul className='list-group'>{entries}</ul>
      <form>{params}</form>
    </div>
  );
}