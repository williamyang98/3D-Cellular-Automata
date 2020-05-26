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
    </div>
  );
}

export function ShaderSettings() {
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