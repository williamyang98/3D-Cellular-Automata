import { combineReducers } from 'redux';
import { app_reducer } from './app';
import { entry_reducer } from './entry_manager';
import { shader_reducer } from './shader_manager';
import { stats_reducer } from './statistics';
import { randomiser_reducer } from './randomiser_manager';
import { gui_reducer } from './gui';

export function create_reducer(app) {
    let reducers = combineReducers({
      app: app_reducer(app),
      entry_browser: entry_reducer(app.entry_browser),
      shader_manager: shader_reducer(app.shader_manager),
      stats: stats_reducer(app.stats),
      randomiser: randomiser_reducer(app.randomiser_manager),
      gui: gui_reducer(),
    });

    return reducers;
}

export function create_preinit_reducer() {
    return combineReducers({
        gui: gui_reducer()
    })
}
