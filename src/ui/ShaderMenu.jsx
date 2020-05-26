import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderAdjustableValue } from './AdjustableValueViews';

export function ShaderMenu() {
  const dispatch = useDispatch();

  const colourings = useSelector(state => state.shader_manager.colourings);
  const current_colouring = useSelector(state => state.shader_manager.current_colouring);
  const shadings = useSelector(state => state.shader_manager.shadings);
  const current_shading = useSelector(state => state.shader_manager.current_shading);

  function select_colouring(event) {
    let index = event.target.value;
    dispatch({type:'shader.select_colouring', value:index});
  }

  function select_shading(event) {
    let index = event.target.value;
    dispatch({type:'shader.select_shading', value:index});
  }

  const colouring_options = colourings.map((name, i) => {
    return <option value={i} key={i}>{name}</option>
  })

  const shading_options = shadings.map((name, i) => {
    return <option value={i} key={i}>{name}</option>
  })

  return (
    <div className="card">
      <div className='card-header'>Shaders</div>
      <div className="card-body">
        <form className='form-inline'>
          <div className='form-group'>
            <label className='mr-2'>Colouring </label>
            <select className='custom-select custom-select-sm' value={current_colouring} onChange={select_colouring}>
              {colouring_options}
            </select>
          </div>
        </form>
        <form className='form-inline'>
          <div className='form-group'>
            <label className='mr-2'>Shading </label>
            <select className='custom-select custom-select-sm' value={current_shading} onChange={select_shading}>
              {shading_options}
            </select>
          </div>
        </form>
        <hr></hr>
        <ShaderSettings></ShaderSettings>
      </div>
    </div>
  );
}

function ShaderSettings() {
  const dispatch = useDispatch();
  const shader_params = useSelector(state => state.shader_manager.params);

  function set_param(name, value) {
    let action = {type:'shader.set_param', name:name, value:value};
    dispatch(action);
  }

  const params = Object
    .entries(shader_params)
    .map(([name, param], index) => {
      return RenderAdjustableValue(param, index, name, value => {
        set_param(name, value);
      })
    });

  return (
    <form>{params}</form>
  );
}