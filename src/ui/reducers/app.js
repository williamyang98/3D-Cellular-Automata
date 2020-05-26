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
        }

        return stats;
    }

    return reducer;
}

export function rules_reducer(rules_browser) {
    const reducer = (browser=rules_browser, action) => {
        switch (action.type) {
            case 'rule.select':
                let index = action.value;
                browser.select_entry(index);
                break;
        }

        return browser;
    } 

    return reducer;
}

export function shader_reducer(shader_manager) {
    const reducer = (manager=shader_manager, action) => {
        switch (action.type) {
            case 'shader.select_colouring':
                manager.select_colouring(action.value);
                break;
            case 'shader.select_shading':
                manager.select_shading(action.value);
                break;
            case 'shader.set_param':
                manager.set_param(action.name, action.value);
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
                manager.set_params(action.value);
                break;
        }
        return manager;
    }
    return reducer;
}