export function app_reducer(init_app) {
    const reducer = (app=init_app, action) => {
        switch (action.type) {
            case 'step': app.sim.step(); break;
            case 'stop': app.sim.stop(); break;
            case 'start': app.sim.start(); break;
            case 'toggle': app.sim.toggle(); break;
            case 'clear': app.sim.clear(); break;
            case 'randomise': app.sim.randomise(); break;
            case 'app.set_size':
                app.set_size(action.value);
                break;
            case 'app.show_border':
                app.show_border.value = action.value;
                break;
            case 'app.show_render':
                app.show_render.value = action.value;
                break;
            default: 
                break;
            }

        return app;
    }

    return reducer;
} 

export function stats_reducer(init_stats) {
    const reducer = (stats=init_stats, action) => {
        switch (action.type) {
            case 'stats.update':
                return action.value;
            default: 
                break;
        }

        return stats;
    }

    return reducer;
}

export function entry_reducer(entry_browser) {
    const reducer = (browser=entry_browser, action) => {
        switch (action.type) {
            case 'entry.select':
                {
                    let {key, index} = action.value;
                    browser.select(key, index);
                }
                break;
            case 'entry.create':
                {
                    let {name, ca_string} = action.value;
                    browser.create(name, ca_string);
                }
                break;
            case 'entry.delete':
                {
                    let {key, index} = action.value;
                    browser.delete(key, index);
                }
            default: 
                break;
        }

        return browser;
    } 

    return reducer;
}

export function shader_reducer(shader_manager) {
    const reducer = (manager=shader_manager, action) => {
        switch (action.type) {
            case 'shader.select_renderer':
                manager.select_renderer(action.value);
                break;
            case 'shader.update_params':
                manager.update_params(action.value);
                break;
            default: 
                break;
        }

        return manager;
    }

    return reducer;
}

export function randomiser_reducer(randomiser_manager) {
    const reducer = (manager=randomiser_manager, action) => {
        switch (action.type) {
            case 'randomiser.select':
                manager.select(action.value);
                break;
            case 'randomiser.update':
                manager.update_current(action.name, action.value);
                break;
            default: 
                break;
        }
        return manager;
    }
    return reducer;
}

export function gui_reducer(init) {
    let default_settings = {
        fullscreen: false, 
        focused: true,
        ...init
    };
    const reducer = (settings=default_settings, action) => {
        switch (action.type) {
            case 'gui.fullscreen':
                return {...settings, fullscreen: action.value};
            case 'gui.focused':
                return {...settings, focused: action.value};
            default:
                break;
        }
        return settings;
    }
    return reducer;
}