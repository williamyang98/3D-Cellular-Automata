import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { SimulationView } from './ui/SimulationView';
import { Controls } from './ui/Controls';
import { RulesBrowser } from './ui/RulesBrowser';
import { ShaderMenu } from './ui/ShaderMenu';
import { SizeChanger } from './ui/SizeChanger';
import { Statistics } from './ui/Statistics';
import { RandomiserMenu } from './ui/Randomiser';
import { BorderControls } from './ui/BorderControls';

export const store = createStore(
  () => {}, 
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
);

function Main() {
  const state = useSelector(state => state);
  
  function render_left_panel() {
    return (
      <div className='col-sm'>
        <Controls></Controls>
        <SizeChanger></SizeChanger>
        <BorderControls></BorderControls>
        <ShaderMenu></ShaderMenu>
        <RandomiserMenu></RandomiserMenu>
        <Statistics></Statistics>
      </div>
    );
  }

  function render_right_panel() {
    return <RulesBrowser></RulesBrowser>;
  }

  return (
    <div>
      <div className="row">
        {state ? render_left_panel() : <div></div>}
        <div className="col-sm">
          <SimulationView></SimulationView>
        </div>
        {state ? <div className="col-sm">{render_right_panel()}</div> : <div></div>}
      </div>
    </div>
  )
}





ReactDOM.render(
  <Provider store={store}>
    <Main></Main>
  </Provider>,
  document.getElementById('root')
);