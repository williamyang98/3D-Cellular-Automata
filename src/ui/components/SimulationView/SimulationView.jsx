import React, { useState }  from 'react';
import { Controls } from '../Controls';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Canvas } from './Canvas';
import { FullScreenButton } from './FullScreenButton';
import "./SimulationView.css";

export function SimulationView(props) {
  const dispatch = useDispatch();
  const store = useStore();
  const app = useSelector(store => store.app);
  const fullscreen = useSelector(store => store.gui.fullscreen);
  const focused = useSelector(store => store.gui.focused);

  let float_controls = (fullscreen && !focused) ? 'fade' : '';

  function render_float_controls() {
    return (
      <div className={float_controls} style={{zIndex:1, position:'absolute', bottom:'1.5rem', alignSelf:'center'}}>
        <div>
          <Controls></Controls>
        </div>
      </div>
    );
  }

  function render_fullscreen_button() {
    return (
      <div className={float_controls} style={{zIndex:2, position:'absolute', top:'1.5rem', right:'1.5rem'}}>
        <FullScreenButton></FullScreenButton>
      </div>
    );
  }

  function render_links() {
    return (
      <div className={float_controls} style={{zIndex:3, position:'absolute', top:'1.5rem', left:'1.5rem'}}>
        <a className="btn btn-dark btn-circle btn-md" 
          href="https://github.com/FiendChain/3D-Cellular-Automata"
          target="_blank"
          data-toggle="tooltip"
          data-placement="left"
          title="Github Repository">
          <i class="fab fa-github"></i>
        </a>
      </div>
    )
  }

  return (
    <div className="sim-view shadow h-100">
      <Canvas store={store} canvas={props.canvas}></Canvas>
      {app ? render_float_controls() : <div></div>}
      {render_fullscreen_button()}
      {render_links()}
    </div>
  );
}




