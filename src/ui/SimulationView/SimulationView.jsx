import React from 'react';
import { Controls } from '../Controls';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Canvas } from './Canvas';

export function SimulationView(props) {
  const store = useStore();
  const app = useSelector(store => store.app);

  function render_float_controls() {
    return (
      <div style={{zIndex:1, position:'absolute', bottom:'1.5rem', alignSelf:'center'}}>
        <div>
          <Controls></Controls>
        </div>
      </div>
    );
  }

  function render_fullscreen_button() {
    return (
      <div style={{zIndex:2, position:'absolute', top:'3.5rem', right:'1.5rem'}}>
        <FullScreenButton></FullScreenButton>
      </div>
    );
  }

  return (
    <div className="card shadow" style={{height:'calc(100vh - 1.0rem)'}}>
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Render</h6>
      </div>
      <Canvas store={store} canvas={props.canvas}></Canvas>
      {app ? render_float_controls() : <div></div>}
      {render_fullscreen_button()}
    </div>
  );
}

function FullScreenButton() {
  const dispatch = useDispatch();
  const fullscreen = useSelector(state => state.gui.fullscreen);

  const font = !fullscreen ? 'arrows-alt' : 'compress-arrows-alt';

  const onClick = () => dispatch({type:'fullscreen', value: !fullscreen});

  return (
    <button className={`btn btn-secondary`} onClick={onClick}>
      <i className={`fas fa-${font} fa-sm`}></i>
    </button>
  );
}

