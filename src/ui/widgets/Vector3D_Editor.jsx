import { useState } from 'react';

const DEFAULT_MIN = { x:-1, y:-1, z:-1 };
const DEFAULT_MAX = { x:+1, y:+1, z:+1 };
const DEFAULT_STEP = { x:0.1, y:0.1, z:0.1};

let Vector3D_Editor = ({ value, min, max, step, external_on_change }) => {
  min = (min !== undefined) ? min : DEFAULT_MIN;
  max = (max !== undefined) ? max : DEFAULT_MAX;
  step = (step !== undefined) ? step : DEFAULT_STEP;

  let [dim_x, set_dim_x] = useState(value.x);
  let [dim_y, set_dim_y] = useState(value.y);
  let [dim_z, set_dim_z] = useState(value.z);

  let on_dim_x_change = (x) => {
    value.x = x;
    set_dim_x(x);
    if (external_on_change !== undefined) {
      external_on_change({ x, y: dim_y, z: dim_z });
    }
  }

  let on_dim_y_change = (y) => {
    value.y = y;
    set_dim_y(y);
    if (external_on_change !== undefined) {
      external_on_change({ x: dim_x, y, z: dim_z });
    }
  }

  let on_dim_z_change = (z) => {
    value.z = z;
    set_dim_z(z);
    if (external_on_change !== undefined) {
      external_on_change({ x: dim_x, y: dim_y, z });
    }
  }

  let input_style = { width: '3.5em' };
  return (
    <div className="d-flex flex-row">
      <div className="flex-1">
        <input type="number" style={input_style} value={`${dim_x}`} max={max.x} min={min.x} step={step.x} onChange={(ev) => on_dim_x_change(Number(ev.target.value))}></input> 
      </div>
      <div className="flex-1">
        <input type="number" style={input_style} value={`${dim_y}`} max={max.y} min={min.y} step={step.y} onChange={(ev) => on_dim_y_change(Number(ev.target.value))}></input> 
      </div>
      <div className="flex-1">
        <input type="number" style={input_style} value={`${dim_z}`} max={max.z} min={min.z} step={step.z} onChange={(ev) => on_dim_z_change(Number(ev.target.value))}></input> 
      </div>
    </div>
  )
}

export { Vector3D_Editor }