import React, { useState } from 'react';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { SimulationView } from './ui/SimulationView/SimulationView';
import { RulesBrowser } from './ui/RulesBrowser';
import { ShaderMenu } from './ui/ShaderMenu';
import { SizeChanger } from './ui/SizeChanger';
import { Statistics } from './ui/Statistics';
import { RandomiserMenu } from './ui/Randomiser';
import { gui_reducer } from './ui/reducers/app';

export function App() {
  const [store, setStore] = useState(
    createStore(
      () => ({
        gui: gui_reducer()
      }), 
      compose(
        applyMiddleware(thunk),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    )
  );

  const [canvas, setCanvas] = useState(React.createRef());

  return (
    <Provider store={store}>
      <Main canvas={canvas}></Main>
    </Provider>
  );
}

function Main(props) {
  const app = useSelector(store => store.app);
  const fullscreen = useSelector(store => store.gui.fullscreen);
  
  function render_left_panel() {
    return (
      <div className='col-sm-3'>
        <SizeChanger></SizeChanger>
        <ShaderMenu></ShaderMenu>
        <RandomiserMenu></RandomiserMenu>
        <Statistics></Statistics>
      </div>
    );
  }

  function render_right_panel() {
    return (
      <div className="col-sm-3">
        <RulesBrowser></RulesBrowser>
      </div>
    );
  }

  const canvas = <SimulationView canvas={props.canvas}></SimulationView>;

  return (
    <div className="container-fluid">
      <div className="row">
        {app && !fullscreen ? render_left_panel() : <div></div>}
        <div className="col">{canvas}</div>
        {app && !fullscreen ? render_right_panel() : <div></div>}
      </div>
    </div>
  );
}