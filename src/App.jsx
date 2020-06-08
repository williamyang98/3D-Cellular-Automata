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

export function App() {
  const [store, setStore] = useState(
    createStore(
      () => {}, 
      compose(
        applyMiddleware(thunk),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    )
  );

  return (
    <Provider store={store}>
      <Main></Main>
    </Provider>
  );
}

function Main() {
  const state = useSelector(state => state);
  
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

  return (
    <div className="container-fluid">
      <div className="row">
        {state ? render_left_panel() : <div></div>}
        <div className="col"><SimulationView></SimulationView></div>
        {state ? render_right_panel() : <div></div>}
      </div>
    </div>
  );
}