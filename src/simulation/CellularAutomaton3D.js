import worker from 'worker-loader!./worker.js'; // eslint-disable-line import/no-webpack-loader-syntax 
import { Grid3D } from './Grid3D';

export class CellularAutomaton3D {
    constructor(shape, stats) {
        
        this.stats = stats;
        this.grid = new Grid3D(shape);

        this.should_update = new Set();
        this.should_update_buffer = new Set();
        this.remove_queue = [];


        this.worker = worker();
        this.worker_busy = false;
        this.promises = {};
        this.promise_id = 0;

        this.worker.addEventListener('message', (event) => {
            if (event.data.id !== undefined) {
                let {grid, id, action, err} = event.data;
                let promise = this.promises[id];
                let {resolve, reject} = promise;
                if (err) {
                    return reject(err);
                }
                console.log('Finished:', action, id);
                this.grid = grid;
                this.promises[id] = undefined;
                this.worker_busy = false;
                resolve(true);
            }
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.use_worker('clear', resolve, reject);
        });
    }

    randomise(randomiser, rule) {
        return new Promise((resolve, reject) => {
            this.use_worker('randomise', resolve, reject, {
                randomiser, rule
            });
        })
    }

    use_worker(action, resolve, reject, data={}) {
        // only send if worker available
        if (this.worker_busy) {
            return reject('worker busy');
        }

        let id = this.promise_id;
        this.promises[id] = {resolve, reject}; 

        this.promise_id += 1;
        this.worker.postMessage({
            grid:this.grid,
            id: id,
            action: action, 
            data: data,
        }, this.grid.transferables);
        console.log('Sent:', action, id);
        this.worker_busy = true;
    }
};