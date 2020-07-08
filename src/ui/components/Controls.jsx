import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { sim } from '../actions';

export function Controls () {
  const is_running = useSelector(state => state.app.sim.is_running);
  const dispatch = useDispatch();

  const on_off = is_running ? 'Pause': 'Run';
  const run_btn = is_running ? 'danger' : 'success';

  return (
    <div className="btn-group">
      <button className="btn btn-secondary" onClick={() => dispatch(sim.step())}>Step</button>
      <button className="btn btn-primary" onClick={() => dispatch(sim.randomise())}>Randomise</button>
      <button className="btn btn-warning" onClick={() => dispatch(sim.clear())}>Clear</button>
      <button className={"btn btn-"+run_btn} onClick={() => dispatch(sim.toggle())}>{on_off}</button>
    </div>
  );
}