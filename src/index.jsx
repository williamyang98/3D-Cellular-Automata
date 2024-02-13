import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { App } from './ui/App';
import { Recoil_State } from './recoil_state.js';

import { App as AppMain } from './app/App.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

let app = new AppMain();
app.init_default();
let recoil_state = new Recoil_State(app);

window.app = app;
window.recoil_state = recoil_state;

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App app={app} recoil_state={recoil_state}></App>
    </RecoilRoot>
  </React.StrictMode>
);