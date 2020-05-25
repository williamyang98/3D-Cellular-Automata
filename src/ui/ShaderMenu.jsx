import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function ShaderMenu() {
  const dispatch = useDispatch();

  const colourings = useSelector(state => state.shader_manager.colourings);
  const current_colouring = useSelector(state => state.shader_manager.current_colouring);
  const shadings = useSelector(state => state.shader_manager.shadings);
  const current_shading = useSelector(state => state.shader_manager.current_shading);

  const shader_params = useSelector(state => state.shader_manager.params);

  function select_colouring(event) {
    let index = event.target.value;
    dispatch({type:'shader.select_colouring', value:index});
  }

  function select_shading(event) {
    let index = event.target.value;
    dispatch({type:'shader.select_shading', value:index});
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
            </div>
          );
        }
      case 'toggle':
        return (
          <div className='form-check' key={index}>
            <input 
              type='checkbox' className='form-check-input'
              checked={param.value}
              onChange={ev => set_param(name, ev.target.checked)}></input>
            <label className='form-check-label'>{name}</label>
          </div>
        )
    }
  }


  const colouring_options = colourings.map((name, i) => {
    return <option value={i} key={i}>{name}</option>
  })

  const shading_options = shadings.map((name, i) => {
    return <option value={i} key={i}>{name}</option>
  })

  const params = Object
    .entries(shader_params)
    .map(([name, param], index) => render_param(index, name, param));

  return (
    <div>
      <form>
        <label>Colouring: </label>
        <select value={current_colouring} onChange={select_colouring}>
          {colouring_options}
        </select>
      </form>
      <form>
        <label>Shading: </label>
        <select value={current_shading} onChange={select_shading}>
          {shading_options}
        </select>
      </form>
      <form>{params}</form>
    </div>
  );
}