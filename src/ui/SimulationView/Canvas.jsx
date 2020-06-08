import React from 'react';
import { App } from '../../app/App';

import { rules_reducer, app_reducer, shader_reducer, stats_reducer, randomiser_reducer } from '../reducers/app';
import { combineReducers } from 'redux';

import { MouseController } from './MouseController';
import { TouchScreenController } from './TouchScreenController';

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas_ref = React.createRef();
    this.mouse_controller = new MouseController();
    this.touch_controller = new TouchScreenController();
  }

  componentDidMount() {
    let canvas = this.canvas_ref.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.create_app(gl);
  }

  create_app(gl) {
    let store = this.props.store;
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

    let camera = app.camera;
    this.mouse_controller.camera = camera;
    this.touch_controller.camera = camera;
  }

  render() {
    return (
      <canvas 
        className="w-100 h-100" ref={this.canvas_ref} 
        {...this.mouse_controller.listeners} {...this.touch_controller.listeners}></canvas>
    );
  }
}