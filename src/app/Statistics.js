export class Statistics {
    constructor(store) {
        this.store = store;
        this.completed_blocks = 0;
        this.frame_time = 0;
        this.total_blocks = 0;
    }

    recieve(event) {
        switch (event.type) {
            case 'total_blocks':
                this.total_blocks = event.value;
                break;
            case 'completed_blocks':
                this.completed_blocks = event.value;
                break;
            case 'frame_time': 
                this.frame_time = event.value;
                break;
            case undefined:
                throw new Error('Need to specify statistic type');
            default:
                console.warn(`Unknown statistics type: ${event.type}`);
        }

        this.store.dispatch((dispatch) => {
            setTimeout(() => {
                dispatch({
                    type: 'stats.update',
                    value: this
                });
            }, 0);
        });
    }

}