import React from 'react';
import { Controls } from '../Controls';
import { useSelector, useStore } from 'react-redux';
import { Canvas } from './Canvas';
import { FullScreenButton } from './FullScreenButton';
import "./SimulationView.css";

export function SimulationView(props) {
  const store = useStore();
  const app = useSelector(store => store.app);
  const fullscreen = useSelector(store => store.gui.fullscreen);
  const focused = useSelector(store => store.gui.focused);
  const background_colour = useSelector(store => store.app && store.app.background_colour.value)

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
          rel="noopener noreferrer"
          data-toggle="tooltip"
          data-placement="left"
          title="Github Repository">
          <i className="fab fa-github"></i>
        </a>
      </div>
    )
  }

  const [r,g,b] = background_colour || [255, 255, 255]; 
  const rgb = `rgb(${r},${g},${b})`;

  return (
    <div className="card sim-view shadow h-100" style={{border: `1px solid ${rgb}`}}>
      <Canvas store={store} canvas={props.canvas}></Canvas>
      {app ? render_float_controls() : <div></div>}
      {render_fullscreen_button()}
      {render_links()}
    </div>
  );
}




