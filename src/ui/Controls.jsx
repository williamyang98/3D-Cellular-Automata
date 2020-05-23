import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

export function Controls () {
  const is_running = useSelector(state => state.sim.running);
  const dispatch = useDispatch();

  const on_off = is_running ? 'Pause': 'Run';
  const run_btn = is_running ? 'danger' : 'success';

  return (
    <div className="btn-group">
      <button className="btn btn-secondary" onClick={() => dispatch({type: 'step'})}>Tick</button>
      <button className="btn btn-primary" onClick={() => dispatch({type: 'randomise'})}>Randomise</button>
      <button className="btn btn-warning" onClick={() => dispatch({type: 'clear'})}>Clear</button>
      <button className={"btn btn-"+run_btn} onClick={() => dispatch({type: 'toggle'})}>{on_off}</button>
    </div>
  );
}