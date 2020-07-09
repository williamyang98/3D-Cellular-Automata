import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderAdjustableValue } from '../util/AdjustableValueViews';
import { BorderControls } from './BorderControls';
import { update_shader_params, select_renderer } from '../actions';

export function ShaderMenu() {
  const dispatch = useDispatch();
  const renderer_type = useSelector(state => state.shader_manager.renderer_type);
  const _ = useSelector(state => state.shader_manager.renderer_type.value);

  const card_body = (
    <div>
      <div>
        {RenderAdjustableValue(renderer_type, 0, 'Renderer', value => {
          dispatch(select_renderer(value));
        })}
      </div>
      <BorderControls></BorderControls>
      <hr></hr>
      <ShaderSettings></ShaderSettings>
    </div>
  );

  return (
    <div className="card shadow mb-2">
      <a href="#collapseGraphicsMenu" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseGraphicsMenu">
        <h6 className="m-0 font-weight-bold text-primary">Graphics</h6>
      </a>
      <div className="collapse show" id="collapseGraphicsMenu">
        <div className="card-body">
          {card_body}
        </div>
      </div>
    </div>
  );
}

function ShaderSettings() {
  const dispatch = useDispatch();
  const params = useSelector(state => state.shader_manager.params);
  const renderer_type = useSelector(state => state.shader_manager.renderer_type.value);

  return (
    <div>
      {Object.entries(params).map(([name, param], index) => {
        return RenderAdjustableValue(param, `${renderer_type}_${index}`, name, value => {
          let data = {};
          data[name] = value;
          dispatch(update_shader_params(data)); 
        })
      })}
    </div>
  );
}