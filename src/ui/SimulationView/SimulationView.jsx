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
      <div style={{zIndex:2, position:'absolute', top:'1.5rem', right:'1.5rem'}}>
        <FullScreenButton></FullScreenButton>
      </div>
    );
  }

  return (
    <div className="card shadow h-100">
      {/* <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Render</h6>
      </div> */}
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

  function set_fullscreen(is_fullscreen) {
    const e = document.documentElement;
    const d = document;
    const request_fullscreen = e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen || e.msRequestFullscreen;
    const cancel_fullscreen = d.exitFullscreen || d.mozCancelFullScreen || d.webkitCancelFullScreen || d.msExitFullscreen;
    if (is_fullscreen) request_fullscreen.bind(e)();
    else               cancel_fullscreen.bind(d)();
  }

  const onClick = () => {
    let is_fullscreen = !fullscreen;
    set_fullscreen(is_fullscreen);
    dispatch({type:'fullscreen', value: is_fullscreen});
  };

  return (
    <button className={`btn btn-secondary`} onClick={onClick}>
      <i className={`fas fa-${font} fa-sm`}></i>
    </button>
  );
}


