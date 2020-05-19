import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/App';
import { vec2 } from 'gl-matrix';


class Main extends React.Component {

  constructor(props) {
    super(props);
    this.canvas_ref = React.createRef();
    this.rotating = false;
    this.mouse_start_pos = vec2.create(); 

    this.state = {};
  }

  componentDidMount() {
    let canvas = this.canvas_ref.current;
    const gl = canvas.getContext('webgl2', {
      premultipliedAlpha: false
    });
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.app = new App(gl);
    this.app.run();
    this.camera = this.app.camera;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    this.camera.aspect_ratio = width/height;

    this.setState({app: this.app});
  }
  
  on_mouse_down(ev) {
    this.rotating = true;
    this.mouse_start_pos[0] = ev.clientX;
    this.mouse_start_pos[1] = ev.clientY;
  }

  on_mouse_move(ev) {
    if (!this.rotating || !this.mouse_start_pos) return;
    let factor = 5/1000;
    let curr_pos = vec2.fromValues(ev.clientX, ev.clientY);
    let delta = vec2.create();
    vec2.sub(delta, this.mouse_start_pos, curr_pos);
    vec2.scale(delta, delta, factor);

    vec2.add(this.camera.model_rotation, this.camera.model_rotation, delta);
    
    this.mouse_start_pos = curr_pos;
  }

  on_wheel(ev) {
    let delta_zoom = ev.deltaY * 0.01;
    this.camera.pos[2] -= delta_zoom;
    ev.stopPropagation();
  }

  render_simulation() {
    if (this.state.app === undefined) {
      return <div>Loading WebGL2...</div>;
    }

    let sim = this.state.app.simulation_window;
    let browser = sim.rule_browser;

    return (
      <div>
        <Controls sim={sim}></Controls>
        <RulesMenu browser={browser} sim={sim}></RulesMenu>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <canvas 
          width={1000}
          height={800}
          ref={this.canvas_ref} 
          onMouseDown={ev => this.on_mouse_down(ev)}
          onMouseUp={ev => this.rotating = false}
          onMouseMove={ev => this.on_mouse_move(ev)}
          onWheel={ev => this.on_wheel(ev)}></canvas>
        {this.render_simulation()}
      </div>
    );
  }
};

class Controls extends React.Component {
  toggle_simulation() {
   this.props.sim.running = !this.props.sim.running;
   this.forceUpdate();
  }

  render() {
    let on_off =  this.props.sim.running ? 'Pause': 'Run';
    let run_btn = this.props.sim.running ? 'danger' : 'success';

    return (
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => this.props.sim.step()}>Tick</button>
        <button className="btn btn-primary" onClick={() => this.props.sim.randomise()}>Randomise</button>
        <button className="btn btn-warning" onClick={() => this.props.sim.clear()}>Clear</button>
        <button className={"btn btn-"+run_btn} onClick={() => this.toggle_simulation()}>{on_off}</button>
      </div>
    );
  }
}

class RulesMenu extends React.Component {
  on_select(index) {
    this.props.browser.select_entry(index);
    this.forceUpdate();
  }

  render_entry(entry, index) {
    let selected = index === this.props.browser.selected_entry;
    let class_name = selected ? 'active' : '';
    return (
      <li className={"list-group-item "+class_name} key={index} onClick={() => this.on_select(index)}>
        <div>Name: {entry.name}</div>
        <div>Rule: {entry.description}</div>
      </li>
    );
  }

  render() {
    const rule_items = this.props.browser.entries.map((e, i) => this.render_entry(e, i));

    return (
      <ul className="list-group">{rule_items}</ul>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Main></Main>
  </React.StrictMode>,
  document.getElementById('root')
);