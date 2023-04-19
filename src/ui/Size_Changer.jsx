import React, { useState } from 'react';

let Size_Changer = ({ simulation }) => {
  const DEFAULT_DIM = 64;
  let size = simulation.get_size();

  let [dim_x, set_dim_x] = useState((size !== null) ? size.x : DEFAULT_DIM);
  let [dim_y, set_dim_y] = useState((size !== null) ? size.y : DEFAULT_DIM);
  let [dim_z, set_dim_z] = useState((size !== null) ? size.z : DEFAULT_DIM);

  let is_different = true;
  if (size !== null) {
    is_different = (size.x !== dim_x) || (size.y !== dim_y) || (size.z !== dim_z);
  }

  const MAX_SIZE = 2048;
  const MIN_SIZE = 1;

  let clamp = (x) => {
    x = Math.max(x, MIN_SIZE);
    x = Math.min(x, MAX_SIZE);
    return x;
  }

  let submit_size_change = (event) => {
    event.preventDefault();
    dim_x = clamp(dim_x);
    dim_y = clamp(dim_y);
    dim_z = clamp(dim_z);
    simulation.set_size(dim_x, dim_y, dim_z);
    set_dim_x(dim_x);
    set_dim_y(dim_y);
    set_dim_z(dim_z);
  }

  return (
    <div className="card shadow mb-2">
      <a href="#collapseSizeChanger" className="card-header d-block" data-toggle="collapse" aria-expanded="true" aria-controls="collapseSizeChanger">
        <h6 className="m-0 font-weight-bold text-primary">Size Controls</h6>
      </a>
      <div className="collapse show" id="collapseSizeChanger">
        <div className="card-body">
          <form onSubmit={(ev) => submit_size_change(ev)}>
            <div className="input-group mb-0">
              <input type="number" value={`${dim_x}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_x(Number(ev.target.value))}></input> 
              <input type="number" value={`${dim_y}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_y(Number(ev.target.value))}></input> 
              <input type="number" value={`${dim_z}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_z(Number(ev.target.value))}></input> 
              <div className="input-group-append">
                <button type="submit" className={`btn btn-primary btn-sm ${is_different ? '' : 'disabled'}`}>Apply</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { Size_Changer };