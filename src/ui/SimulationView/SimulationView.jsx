import React from 'react';
import { Controls } from '../Controls';
import { useSelector, useStore } from 'react-redux';
import { Canvas } from './Canvas';

export function SimulationView() {
  const store = useStore();
  const state = useSelector(state => state);

  function render_float_controls() {
    return (
      <div style={{zIndex:1, position:'absolute', bottom:'1.5rem', alignSelf:'center'}}>
        <div>
          <Controls></Controls>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow h-100">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Render</h6>
      </div>
      <Canvas store={store}></Canvas>
      {state ? render_float_controls() : <div></div>}
    </div>
  );
}

