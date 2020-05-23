import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';

import { SimulationView } from './ui/SimulationView';
import { Controls } from './ui/Controls';
import { RulesBrowser } from './ui/RulesBrowser';
import { ShaderMenu } from './ui/ShaderMenu';

const redux_debugging = false;
export const store = createStore(() => {}, redux_debugging && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function Main() {
  const state = useSelector(state => state);
  return (
    <div>
      <div className="row">
        {state ? <div className="col-sm">
          <div>
            <Controls></Controls>
          </div>
          <div>
            <ShaderMenu></ShaderMenu>
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