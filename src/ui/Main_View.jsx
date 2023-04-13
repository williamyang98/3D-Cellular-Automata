import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { open_fullscreen, close_fullscreen } from './fullscreen.js';

let Fullscreen_Button = ({ recoil_state }) => {
  let [is_fullscreen, set_is_fullscreen] = useRecoilState(recoil_state.is_fullscreen);

  const font = !is_fullscreen ? 'arrows-alt' : 'compress-arrows-alt';
  let on_click = () => {
    let new_setting = !is_fullscreen;
    if (new_setting) {
      open_fullscreen();
    } else {
      close_fullscreen();
    }
    set_is_fullscreen(new_setting);
  }

  return (
    <button className={`btn btn-secondary`} onClick={on_click}>
      <i className={`fas fa-${font} fa-sm`}></i>
    </button>
  );
}

let Simulation_Controls = ({ simulation, recoil_state }) => {
  let [is_running, set_is_running] = useRecoilState(recoil_state.is_running);

  const run_button_text = is_running ? 'Pause': 'Run';
  const run_button_class = is_running ? 'danger' : 'success';

  let toggle_is_running = () => {
    simulation.set_is_running(!is_running);
    set_is_running(!is_running);
  }

  return (
    <div className="btn-group">
      <button className="btn btn-secondary" onClick={() => simulation.perform_step()}>Step</button>
      <button className="btn btn-primary" onClick={() => simulation.randomise()}>Randomise</button>
      <button className="btn btn-warning" onClick={() => simulation.clear()}>Clear</button>
      <button className={`btn btn-${run_button_class}`} onClick={toggle_is_running}>{run_button_text}</button>
    </div>
  );
}

let Github_Button = () => {
  let link = "https://github.com/FiendChain/3D-Cellular-Automata";
  let title = "Github Repository";
  return (
    <a 
      className="btn btn-dark btn-circle btn-md" 
      href={link} title={title}
      target="_blank" rel="noopener noreferrer" data-toggle="tooltip" data-placement="left"
    >
      <i className="fab fa-github"></i>
    </a>
  );
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas_ref = React.createRef();
  }

  componentDidMount = () => {
    let elem = this.canvas_ref.current;
    let simulation = this.props.simulation;
    simulation.set_canvas(elem);
    simulation.start_loop();
  }

  render = () => {
    return (
      <div className='w-100 h-100 pb-2' style={{cursor:'grab'}}>
        <canvas className="w-100 h-100" ref={this.canvas_ref}></canvas>
      </div>
    );
  }
}

// Contains our webgl canvas and some controls
let Main_View = ({ simulation, recoil_state }) => {
  let is_fullscreen = useRecoilValue(recoil_state.is_fullscreen);
  let is_focused = useRecoilValue(recoil_state.is_focused);
  let button_class_name = (is_fullscreen && !is_focused) ? 'fade' : '';

  return (
    <div className="d-flex flex-column h-100 shadow">
      <Canvas simulation={simulation}></Canvas>
      <div className={button_class_name} style={{zIndex:1, position:'absolute', bottom:'1.5rem', alignSelf:'center'}}>
        <Simulation_Controls simulation={simulation} recoil_state={recoil_state}></Simulation_Controls>
      </div>
      <div className={button_class_name} style={{zIndex:2, position:'absolute', top:'1.5rem', right:'1.5rem'}}>
        <Fullscreen_Button recoil_state={recoil_state}></Fullscreen_Button>
      </div>
      <div className={button_class_name} style={{zIndex:3, position:'absolute', top:'1.5rem', left:'1.5rem'}}>
        <Github_Button></Github_Button>
      </div>
    </div>
  );
}

export { Main_View };