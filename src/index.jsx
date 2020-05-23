import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';

import { SimulationView } from './ui/SimulationView';
import { Controls } from './ui/Controls';
import { RulesBrowser } from './ui/RulesBrowser';

const redux_debugging = false;
export const store = createStore(() => {}, redux_debugging && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function Main() {
  const state = useSelector(state => state);
  return (
    <div>
      <SimulationView></SimulationView>
      {state ? (
        <div>
          <Controls></Controls>
          <RulesBrowser></RulesBrowser>
        </div>
      ) : <div>Loading WebGL2</div>}
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Main></Main>
  </Provider>,
  document.getElementById('root')
);