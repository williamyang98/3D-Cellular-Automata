import React, { useState } from 'react';
import { vec3 } from 'gl-matrix';
import { useDispatch, useSelector } from 'react-redux';
import { set_size } from '../actions';

export function SizeChanger() {
  const dispatch = useDispatch();
  const app_size = useSelector(state => state.app.size);
  let [x, set_x] = useState(app_size[0]);
  let [y, set_y] = useState(app_size[1]);
  let [z, set_z] = useState(app_size[2]);

  const max_size = 1000;
  const min_size = 1;

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
    dispatch(set_size(size));
    event.preventDefault();
  }

  const size_changer_form = (
    <form onSubmit={(event) => on_size_change(event)}>
      <div className="input-group mb-0">
        <input type="number" value={x} max={max_size} min={min_size} onChange={ev => set_x(ev.target.value)}></input> 
        <input type="number" value={y} max={max_size} min={min_size} onChange={ev => set_y(ev.target.value)}></input> 
        <input type="number" value={z} max={max_size} min={min_size} onChange={ev => set_z(ev.target.value)}></input> 
        <div className="input-group-append">
          <button type="submit" className='btn btn-primary btn-sm'>Apply</button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="card shadow mb-2">
      <a href="#collapseSizeChanger" className="card-header d-block" data-toggle="collapse" aria-expanded="true" aria-controls="collapseSizeChanger">
        <h6 className="m-0 font-weight-bold text-primary">Size Controls</h6>
      </a>
      <div className="collapse show" id="collapseSizeChanger">
        <div className="card-body">
          {size_changer_form}
        </div>
      </div>
    </div>
  );
}