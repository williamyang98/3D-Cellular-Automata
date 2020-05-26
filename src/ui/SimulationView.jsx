import React from 'react';
import { App } from '../app/App';

import { rules_reducer, app_reducer, shader_reducer, stats_reducer, randomiser_reducer } from './reducers/app';
import { combineReducers } from 'redux';
import { store } from '../index';

import { vec2 } from 'gl-matrix';

export class SimulationView extends React.Component {
  constructor(props) {
    super(props);
    this.canvas_ref = React.createRef();
    this.rotating = false;
    this.mouse_start_pos = vec2.create(); 
  }

  componentDidMount() {
    let canvas = this.canvas_ref.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    let app = new App(gl, store);
    let reducers = combineReducers({
      app: app_reducer(app),
      rule_browser: rules_reducer(app.rule_browser),
      shader_manager: shader_reducer(app.shader_manager),
      stats: stats_reducer(app.stats),
      randomiser: randomiser_reducer(app.randomiser_manager),
    });

    store.replaceReducer(reducers);

    app.run();
    this.camera = app.camera;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    this.camera.aspect_ratio = width/height;
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

    this.camera.rotate(delta[0], delta[1]);
    
    this.mouse_start_pos = curr_pos;
  }

  on_wheel(ev) {
    let delta_zoom = ev.deltaY * 0.001;
    this.camera.zoom(delta_zoom);
    // ev.stopPropagation();
    // ev.preventDefault();
    // find a way to stop scrolling
  }

  render() {
    return (
      <canvas 
        width={800}
        height={550}
        ref={this.canvas_ref} 
        onMouseDown={ev => this.on_mouse_down(ev)}
        onMouseUp={ev => this.rotating = false}
        onMouseMove={ev => this.on_mouse_move(ev)}
        onWheel={ev => this.on_wheel(ev)}></canvas>
    );
  }
}