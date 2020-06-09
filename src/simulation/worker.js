import { Engine } from "./Engine";

const engine = new Engine();
engine.attach_listener((data) => {
    postMessage({action:'stats', data});
});

onmessage = (ev) => {
    let msg = ev.data;
    let action = msg.action;
    let id = msg.id;
    try {
        switch (action) {
            case 'set_size':
                engine.set_shape(msg.data);
                send_grid(action, id);
                return;
            case 'set_rule':
                engine.set_rule(msg.data);
                send_acknowledge(action, id);
                return;
            case 'set_randomiser':
                engine.set_randomiser(msg.data);
                send_acknowledge(action, id);
                return;
            case 'clear':
                engine.clear();
                send_grid(action, id);
                return;
            case 'randomise':
                engine.randomise();
                send_grid(action, id);
                return;
            case 'step':
                engine.step();
                send_grid(action, id);
                return;
            // manual get
            case 'get_grid':
                send_grid(action, id);
                return;
            case 'set_grid':
                engine.set_grid(msg.data);
                send_acknowledge(action, id);
                return;
            default:
                break;
        }
    } catch (ex) {
        postMessage({error: ex, action, id});
    }
}

function send_acknowledge(action, id) {
    postMessage({action, id});
}

function send_grid(action, id) {
    if (!engine.grid) throw new Error('Grid not initialised');
    postMessage({action, id, grid:engine.grid}, engine.grid.transferables);
}

