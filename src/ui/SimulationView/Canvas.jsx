import React from 'react';
import { App } from '../../app/App';

import { rules_reducer, app_reducer, shader_reducer, stats_reducer, randomiser_reducer, gui_reducer } from '../reducers/app';
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
  }

  create_app(gl) {
    let store = this.props.store;
    let app = store.getState().app;
    if (app) {
      return app;
    }

    app = new App(gl, store);
    let reducers = combineReducers({
      app: app_reducer(app),
      rule_browser: rules_reducer(app.rule_browser),
      shader_manager: shader_reducer(app.shader_manager),
      stats: stats_reducer(app.stats),
      randomiser: randomiser_reducer(app.randomiser_manager),
      gui: gui_reducer(store.gui),
    });
    store.replaceReducer(reducers);
    app.run();
    return app;
  }

  render() {
    return (
      <canvas 
        className="w-100 h-100" ref={this.props.canvas} 
        {...this.mouse_controller.listeners} {...this.touch_controller.listeners}></canvas>
    );
  }
}