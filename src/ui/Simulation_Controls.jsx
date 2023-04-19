import { useState } from 'react';
import { Editor_Layout } from './editor/Editor_Layout';
import { Slider } from './widgets/Slider';

import { Simulation } from '../app/simulation/simulation.js';

/**
 * @param {Simulation} simulation 
 */
let Size_Changer = ({ simulation }) => {
  const DEFAULT_DIM = 64;
  const MAX_SIZE = 2048;
  const MIN_SIZE = 1;

  let size = simulation.get_size();
  let [dim_x, set_dim_x] = useState((size !== null) ? size.x : DEFAULT_DIM);
  let [dim_y, set_dim_y] = useState((size !== null) ? size.y : DEFAULT_DIM);
  let [dim_z, set_dim_z] = useState((size !== null) ? size.z : DEFAULT_DIM);

  const is_different = (size === null) || (size.x !== dim_x) || (size.y !== dim_y) || (size.z !== dim_z);

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

  const input_style = { width: '4em' };
  const button_style = { borderTopLeftRadius: 0, borderBottomLeftRadius: 0};
  return (
    <form onSubmit={(ev) => submit_size_change(ev)}>
      <div className="d-flex flex-row">
        <div className="flex-1">
          <input type="number" style={input_style} value={`${dim_x}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_x(Number(ev.target.value))}></input> 
        </div>
        <div className="flex-1">
          <input type="number" style={input_style} value={`${dim_y}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_y(Number(ev.target.value))}></input> 
        </div>
        <div className="flex-1">
          <input type="number" style={input_style} value={`${dim_z}`} max={MAX_SIZE} min={MIN_SIZE} onChange={(ev) => set_dim_z(Number(ev.target.value))}></input> 
        </div>
        <div className="flex-1">
          <button type="submit" className={`btn btn-primary btn-sm ${is_different ? '' : 'disabled'}`} style={button_style}>✓</button>
        </div>
      </div>
    </form>
  );
}

/**
 * @param {Simulation} simulation 
 */
let Tickrate_Controls = ({ simulation }) => {
  const MAX_TICKRATE = 144;
  const MIN_TICKRATE = 1;
  let params = simulation.params;

  let create_label = (tick_rate) => {
    const is_unlimited_tick_rate = (tick_rate >= MAX_TICKRATE);
    if (is_unlimited_tick_rate) {
      return `tick_rate: UNLIMITED`;
    }
    return `tick_rate: ${tick_rate.toFixed(0)}`
  }

  let [label, set_label] = useState(create_label(params.tick_rate));

  let on_tickrate_change = (tick_rate) => {
    const is_unlimited_tick_rate = (tick_rate >= MAX_TICKRATE);
    params.is_unlimited_tick_rate = is_unlimited_tick_rate;
    set_label(create_label(tick_rate));
  }

  return (
    <Editor_Layout label={label}>
      <Slider 
        object={params} object_key={'tick_rate'} 
        min={MIN_TICKRATE} max={MAX_TICKRATE} step={1} 
        external_on_change={on_tickrate_change}
      ></Slider>
    </Editor_Layout>
  )
}

/**
 * @param {Simulation} simulation 
 */
let Simulation_Controls = ({ simulation }) => {
  return (
    <div className="card shadow mb-2">
      <a href="#collapseSizeChanger" className="card-header d-block" data-toggle="collapse" aria-expanded="true" aria-controls="collapseSizeChanger">
        <h6 className="m-0 font-weight-bold text-primary">Controls</h6>
      </a>
      <div className="collapse show" id="collapseSizeChanger">
        <div className="card-body">
          <Editor_Layout label="size" width={2}>
            <Size_Changer simulation={simulation}></Size_Changer>
          </Editor_Layout>
          <Tickrate_Controls simulation={simulation}></Tickrate_Controls>
        </div>
      </div>
    </div>
  )
}

export { Simulation_Controls };