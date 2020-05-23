import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

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
            {state ? 
              <SizeChanger></SizeChanger> :
              <div></div>}
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

function SizeChanger() {
  const dispatch = useDispatch();
  const size = useSelector(state => state.app.size);

  function on_size_change(ev) {
    const value = ev.target.value;
    let size = Number(value);
    size = Math.min(size, 120);
    size = Math.max(size, 20); 
    dispatch({type: 'app.set_size', value: size});
  }

  return (
    <input type="number" value={size[0]} onChange={on_size_change} max={120} min={20}></input> 
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Main></Main>
  </Provider>,
  document.getElementById('root')
);