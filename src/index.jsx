import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';

import { SimulationView } from './ui/SimulationView';
import { Controls } from './ui/Controls';
import { RulesBrowser } from './ui/RulesBrowser';
import { ShaderMenu } from './ui/ShaderMenu';
import { SizeChanger } from './ui/SizeChanger';
import { Statistics } from './ui/Statistics';

export const store = createStore(
  () => {}, 
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
);

function Main() {
  const state = useSelector(state => state);

  return (
    <div>
      <div className="row">
        {state ? <div className="col-sm">
          <div>
            <Controls></Controls>
            <SizeChanger></SizeChanger>
            <ShaderMenu></ShaderMenu>
            <Statistics></Statistics>
          </div>
        </div> : <div></div>}
        <div className="col-sm">
          <SimulationView></SimulationView>
        </div>
        {state ? <div className="col-sm">
          <RulesBrowser></RulesBrowser>
        </div> : <div></div>}
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