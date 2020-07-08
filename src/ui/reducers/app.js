export function app_reducer(init_app) {
    const reducer = (app=init_app, action) => {
        switch (action.type) {
            case 'step': app.sim.step(); break;
            case 'stop': app.sim.stop(); break;
            case 'start': app.sim.start(); break;
            case 'toggle': app.sim.toggle(); break;
            case 'clear': app.sim.clear(); break;
            case 'randomise': app.randomise(); break;
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









