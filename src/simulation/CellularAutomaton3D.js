import worker from 'worker-loader!./worker.js'; // eslint-disable-line import/no-webpack-loader-syntax 
import { Grid3D } from './Grid3D';

export class CellularAutomaton3D {
    constructor(stats) {
        this.stats = stats;

        this.worker = worker();
        this.promises = {};
        this.promise_id = 0;

        this.worker.addEventListener('message', (event) => {
            let msg = event.data;
            if (msg.id !== undefined) {
                let action = msg.action;
                let id = msg.id;

                let promise = this.promises[id];
                let {resolve, reject} = promise;
                this.promises[id] = undefined;
                this.worker_busy = false;

                if (msg.error) {
                    return reject(msg.error);
                }

                resolve(msg.grid);
                return;
            }

            switch (msg.action) {
                case 'stats':
                    this.stats.recieve(msg.data);
                    return;
                default:
                    break;
            }
        });
    }

    set_size(size) {
        return new Promise((resolve, reject) => {
            this.use_worker('set_size', resolve, reject, size);
        });
    }

    set_rule(rule) {
        return new Promise((resolve, reject) => {
            this.use_worker('set_rule', resolve, reject, rule);
        });
    }

    set_randomiser(randomiser) {
        return new Promise((resolve, reject) => {
            this.use_worker('set_randomiser', resolve, reject, randomiser);
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.use_worker('clear', resolve, reject);
        });
    }

    randomise() {
        return new Promise((resolve, reject) => {
            this.use_worker('randomise', resolve, reject);
        });
    }

    step() {
        return new Promise((resolve, reject) => {
            if (this.worker_busy) {
                return reject('Busy');
            }
            this.use_worker('step', resolve, reject);
        });
    }

    set_grid(grid) {
        return new Promise((resolve, reject) => {
            this.use_worker('set_grid', resolve, reject, grid, grid.transferables);
        });
    }

    use_worker(action, resolve, reject, data={}, transferables=[]) {
        // only send if worker available
        if (this.worker_busy) {
            // return reject('worker busy');
        }

        let id = this.promise_id;
        this.promises[id] = {resolve, reject}; 

        this.promise_id += 1;
        this.worker.postMessage({action, id, data}, transferables);
        this.worker_busy = true;
    }
};