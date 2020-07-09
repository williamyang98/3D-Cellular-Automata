import React from 'react';

import { createStore, applyMiddleware, compose } from 'redux';
import { create_preinit_reducer } from './ui/reducers';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { SimulationView } from './ui/components/SimulationView/SimulationView';
import { EntryBrowser } from './ui/components/EntryBrowser/EntryBrowser';
import { ShaderMenu } from './ui/components/ShaderMenu';
import { SizeChanger } from './ui/components/SizeChanger';
import { Statistics } from './ui/components/Statistics';
import { RandomiserMenu } from './ui/components/Randomiser';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      create_preinit_reducer(),
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
  
  function render_left_panel() {
    return (
      <div className={`col-sm-3 overflow-auto vh-100 ${fullscreen && 'd-none'}`}>
        <SizeChanger></SizeChanger>
        <ShaderMenu></ShaderMenu>
        <RandomiserMenu></RandomiserMenu>
        <Statistics></Statistics>
      </div>
    );
  }

  function render_right_panel() {
    return (
      <div className={`col-sm-3 overflow-auto vh-100 ${fullscreen && 'd-none'}`}>
        <EntryBrowser></EntryBrowser>
      </div>
    );
  }

  const canvas = <SimulationView canvas={props.canvas}></SimulationView>;

  return (
    <div className="vh-100 vw-100">
      <div className="row px-0 mx-0">
        {app && render_left_panel()}
        <div className="col vh-100 mx-0 px-0">{canvas}</div>
        {app && render_right_panel()}
      </div>
    </div>
  );
}