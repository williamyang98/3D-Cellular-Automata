import worker from 'worker-loader!./worker.js'; // eslint-disable-line import/no-webpack-loader-syntax 

/**
 * Frontend to communicate with the web worker
 */
export class CellularAutomaton3D {
    constructor(size, stats) {
        this.size = size;
        this.stats = stats;

        this.worker = worker();
        this.promise_id = 0;
        this.is_running = false;

        this.set_size(this.size.value);
        this.size.listen(size => {
            this.set_size(size.value);
        })

        this.worker.addEventListener('message', (event) => {
            let msg = event.data;

            if (msg.error) {
                // throw msg.error;
                console.error(msg);
                return;
            }

            switch (msg.action) {
                case 'stats':
                    this.stats.recieve(msg.data);
                    break;
                case 'grid':
                    this.notify(msg.grid, msg.local);
                    break;
                default:
                    break;
            }
        });

        this.worker.addEventListener('error', ev => {
            console.error(ev.message, ev);
        })

        this.listeners = new Set();
    }

    notify(grid, local) {
        for (let listener of this.listeners) {
            listener(grid, local);
        }
        this.set_grid(grid);
    }

    listen_available_frame(listener) {
        return this.listeners.add(listener);
    }

    unlisten_available_frame(listener) {
        return this.listeners.delete(listener);
    }

    set_size(size) {
        this.use_worker('set_size', size);
    }

    set_rule(rule) {
        this.use_worker('set_rule', rule);
    }

    set_randomiser(randomiser) {
        this.use_worker('set_randomiser', randomiser);
    }

    clear() {
        this.use_worker('clear');
    }

    randomise() {
        this.use_worker('randomise');
    }

    step() {
        this.use_worker('step');
    }

    start() {
        this.use_worker('start');
        this.is_running = true;
    }

    stop() {
        this.use_worker('stop');
        this.is_running = false;
    }

    toggle() {
        this.is_running ? this.stop() : this.start();
    }

    set_grid(grid) {
        this.use_worker('set_grid', grid, grid.transferables);
    }

    request_frame() {
        this.use_worker('request_frame');
    }

    use_worker(action, data={}, transferables=[]) {

        let id = this.promise_id;
        this.promise_id += 1;

        this.worker.postMessage({action, id, data}, transferables);
    }
};