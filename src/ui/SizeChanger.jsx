import React, { useState } from 'react';
import { vec3 } from 'gl-matrix';
import { useDispatch, useSelector } from 'react-redux';

export function SizeChanger() {
  const dispatch = useDispatch();
  const app_size = useSelector(state => state.app.size);
  const [x, set_x] = useState(app_size[0]);
  const [y, set_y] = useState(app_size[1]);
  const [z, set_z] = useState(app_size[2]);

  const max_size = 1000;
  const min_size = 10;

  function clamp(val) {
    let clamped = Number(val);
    clamped = Math.max(clamped, min_size);
    clamped = Math.min(clamped, max_size);
    return clamped;
  }

  function on_size_change() {
    let X = clamp(x);
    let Y = clamp(y);
    let Z = clamp(z);
    let size = vec3.fromValues(X, Y, Z);
    dispatch({type: 'app.set_size', value: size});
  }

  return (
    <div>
        <input type="number" value={x} max={max_size} min={min_size} onChange={ev => set_x(clamp(ev.target.value))}></input> 
        <input type="number" value={y} max={max_size} min={min_size} onChange={ev => set_y(clamp(ev.target.value))}></input> 
        <input type="number" value={z} max={max_size} min={min_size} onChange={ev => set_z(clamp(ev.target.value))}></input> 
        <button onClick={() => on_size_change()}>Apply</button>
    </div>
  );
}