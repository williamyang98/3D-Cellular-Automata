import React, { useState } from 'react';
import { vec3 } from 'gl-matrix';
import { useDispatch, useSelector } from 'react-redux';

export function SizeChanger() {
  const dispatch = useDispatch();
  const app_size = useSelector(state => state.app.size);
  let [x, set_x] = useState(app_size[0]);
  let [y, set_y] = useState(app_size[1]);
  let [z, set_z] = useState(app_size[2]);

  const max_size = 1000;
  const min_size = 10;

  function clamp(val) {
    let clamped = Number(val);
    clamped = Math.max(clamped, min_size);
    clamped = Math.min(clamped, max_size);
    return clamped;
  }

  function on_size_change(event) {
    let X = clamp(x);
    let Y = clamp(y);
    let Z = clamp(z);
    set_x(X);
    set_y(Y);
    set_z(Z);
    let size = vec3.fromValues(X, Y, Z);
    dispatch({type: 'app.set_size', value: size});
    event.preventDefault();
  }

  return (
    <form className='form-group' onSubmit={(event) => on_size_change(event)}>
        <input type="number" value={x} max={max_size} min={min_size} onChange={ev => set_x(ev.target.value)}></input> 
        <input type="number" value={y} max={max_size} min={min_size} onChange={ev => set_y(ev.target.value)}></input> 
        <input type="number" value={z} max={max_size} min={min_size} onChange={ev => set_z(ev.target.value)}></input> 
        <button type="submit" className='btn btn-primary'>Apply</button>
    </form>
  );
}