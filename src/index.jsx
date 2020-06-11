import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <App></App>,
  document.getElementById('root')
);

serviceWorker.unregister();
// serviceWorker.register();