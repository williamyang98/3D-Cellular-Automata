import { Engine } from "./Engine";

const engine = new Engine();
engine.attach_listener((data) => {
    postMessage({action:'stats', data});
});
engine.run();

onmessage = (ev) => {
    let msg = ev.data;
    let action = msg.action;
    let id = msg.id;
    try {
        switch (action) {
            case 'set_size':        return engine.set_shape(msg.data);
            case 'set_rule':        return engine.set_rule(msg.data); 
            case 'set_randomiser':  return engine.set_randomiser(msg.data); 
            case 'clear':           return engine.clear(); 
            case 'randomise':       return engine.randomise(); 
            case 'step':            return engine.step(); 
            case 'start':           return engine.start(); 
            case 'stop':            return engine.stop(); 
            case 'request_frame':   return send_grid();
            case 'set_grid':        return engine.set_grid(msg.data);
            default:
                break;
        }
    } catch (ex) {
        postMessage({error: ex, action, id});
    }
}

function send_grid() {
    let res = engine.get_frame();
    if (!res) return;
    let {grid, unprocessed_blocks, local} = res;
    postMessage({action:'grid', grid, unprocessed_blocks, local}, grid.transferables);
}

