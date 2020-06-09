import worker from 'worker-loader!./worker.js'; // eslint-disable-line import/no-webpack-loader-syntax 
import { Grid3D } from './Grid3D';

export class CellularAutomaton3D {
    constructor(stats) {
        this.stats = stats;

        this.worker = worker();
        this.promise_id = 0;

        this.worker.addEventListener('message', (event) => {
            let msg = event.data;

            if (msg.error) {
                // throw msg.error;
                console.error(msg.error);
                return;
            }

            switch (msg.action) {
                case 'stats':
                    this.stats.recieve(msg.data);
                    return;
                case 'grid':
                    this.notify(msg.grid, msg.unprocessed_blocks, msg.local);
                default:
                    break;
            }
        });

        this.listeners = new Set();
    }

    notify(grid, unprocessed_blocks, local) {
        for (let listener of this.listeners) {
            listener(grid, unprocessed_blocks, local);
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
    }

    stop() {
        this.use_worker('stop');
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