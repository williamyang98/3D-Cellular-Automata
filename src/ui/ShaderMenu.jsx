import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderAdjustableValue } from './AdjustableValueViews';

export function ShaderMenu() {
  const dispatch = useDispatch();
  const renderer_type = useSelector(state => state.shader_manager.renderer_type);
  const current_renderer_type = useSelector(state => state.shader_manager.renderer_type.value);

  return (
    <div className="card">
      <div className='card-header'>Shaders</div>
      <div className="card-body">
        <form className='form-inline'>
          {RenderAdjustableValue(renderer_type, 0, 'Renderer', value => {
            dispatch({type:'shader.select_renderer', value:value});
          })}
        </form>
        <hr></hr>
        <ShaderSettings></ShaderSettings>
      </div>
    </div>
  );
}

function ShaderSettings() {
  const dispatch = useDispatch();
  const params = useSelector(state => state.shader_manager.params);

  return (
    <form>{Object.entries(params).map(([name, param], index) => {
      return RenderAdjustableValue(param, index, name, value => {
        let data = {};
        data[name] = value;
        dispatch({type: 'shader.update_params', value: data}) 
      })
    })}</form>
  );
}