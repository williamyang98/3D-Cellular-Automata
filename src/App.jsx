import React, { useState } from 'react';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { SimulationView } from './ui/SimulationView/SimulationView';
import { EntryBrowser } from './ui/EntryBrowser/EntryBrowser';
import { ShaderMenu } from './ui/ShaderMenu';
import { SizeChanger } from './ui/SizeChanger';
import { Statistics } from './ui/Statistics';
import { RandomiserMenu } from './ui/Randomiser';
import { gui_reducer } from './ui/reducers/app';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      combineReducers({gui: gui_reducer()}),
      compose(
        applyMiddleware(thunk),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    );

    this.canvas = React.createRef();
  }

  render() {
    return (
      <Provider store={this.store}>
        <Main canvas={this.canvas}></Main>
      </Provider>
    );
  }

}

function Main(props) {
  const app = useSelector(store => store.app);
  const fullscreen = useSelector(store => store.gui.fullscreen);
  const gui = useSelector(store => store.gui);
  
  function render_left_panel() {
    return (
      <div className={`col-sm-3 overflow-auto vh-100 ${fullscreen ? 'd-none' : ''}`}>
        <SizeChanger></SizeChanger>
        <ShaderMenu></ShaderMenu>
        <RandomiserMenu></RandomiserMenu>
        <Statistics></Statistics>
      </div>
    );
  }

  function render_right_panel() {
    return (
      <div className={`col-sm-3 overflow-auto vh-100 ${fullscreen ? 'd-none' : ''}`}>
        <EntryBrowser></EntryBrowser>
      </div>
    );
  }

  const canvas = <SimulationView canvas={props.canvas}></SimulationView>;

  return (
    <div className="vh-100 vw-100">
      <div className="row px-0 mx-0">
        {app ? render_left_panel() : <div></div>}
        <div className="col vh-100 mx-0 px-0">{canvas}</div>
        {app ? render_right_panel() : <div></div>}
      </div>
    </div>
  );
}