import React from 'react';
import { App } from '../../app/App';

import { app_reducer, shader_reducer, stats_reducer, randomiser_reducer, gui_reducer, entry_reducer } from '../reducers/app';
import { combineReducers } from 'redux';

import { MouseController } from './MouseController';
import { TouchScreenController } from './TouchScreenController';

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.mouse_controller = new MouseController();
    this.touch_controller = new TouchScreenController();
  }

  componentDidMount() {
    let canvas = this.props.canvas.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    let app = this.create_app(gl);
    let camera = app.camera;
    this.mouse_controller.camera = camera;
    this.touch_controller.camera = camera;
    this.focus_timeout = this.create_focus_timeout();
  }

  componentWillUnmount() {
    clearTimeout(this.focus_timeout);
  }

  create_focus_timeout(delay=3000) {
    let id = setTimeout(() => this.change_focus(false), delay);
    return id;
  }

  // mouse moves, update focus
  on_mouse_move() {
    clearTimeout(this.focus_timeout);
    this.focus_timeout = this.create_focus_timeout();
    this.change_focus(true);
  }

  change_focus(focused) {
    let store = this.props.store;
    store.dispatch({type:'gui.focused', value:focused});
  }

  create_app(gl) {
    let store = this.props.store;
    let app = store.getState().app;
    let gui = store.getState().gui;
    if (app) {
      return app;
    }

    app = new App(gl, store);
    let reducers = combineReducers({
      app: app_reducer(app),
      entry_browser: entry_reducer(app.entry_browser),
      shader_manager: shader_reducer(app.shader_manager),
      stats: stats_reducer(app.stats),
      randomiser: randomiser_reducer(app.randomiser_manager),
      gui: gui_reducer(gui),
    });
    store.replaceReducer(reducers);
    app.run();
    return app;
  }

  render() {
    const listener = ev => this.on_mouse_move();
    const hooks = ['onMouseMove', 'onMouseDown', 'onMouseUp', 'onTouchMove', 'onTouchStart', 'onTouchEnd'];
    let listeners = {};
    for (let hook of hooks) {
      listeners[hook] = listener;
    }
    
    return (
      <div className='w-100 h-100' {...listeners}>
        <canvas 
          className="w-100 h-100" ref={this.props.canvas} 
          {...this.mouse_controller.listeners} {...this.touch_controller.listeners}></canvas>
      </div>
    );
  }
}