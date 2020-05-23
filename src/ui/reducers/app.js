export function simulation_reducer(init_sim) {
    const reducer = (sim=init_sim, action) => {
        switch (action.type) {
            case 'step': sim.step(); break;
            case 'stop': sim.stop(); break;
            case 'start': sim.start(); break;
            case 'toggle': sim.toggle(); break;
            case 'clear': sim.clear(); break;
            case 'randomise': sim.randomise(); break;
        }

        return sim;
    }

    return reducer;
} 

export function rules_reducer(rules_browser) {
    const reducer = (browser=rules_browser, action) => {
        switch (action.type) {
            case 'select':
                let index = action.value;
                browser.select_entry(index);
                break;
        }

        return browser;
    } 

    return reducer;
}

export function app_reducer(app) {
    return  (state=app, action) => {
        return state;
    }
}