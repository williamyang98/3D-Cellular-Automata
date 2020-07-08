import { update_statistics } from "../ui/actions";

export class Statistics {
    constructor(store) {
        this.store = store;
        this.data = {
            completed_blocks: 0,
            frame_time: 0,
            total_blocks: 0,
            total_steps: 0,
            texture_data_update: 0,
            texture_data_upload: 0,
            draw_time: 0,
        };
        this.cooldown = false;
    }

    force_update() {
        if (this.cooldown) {
            return;
        }

        this.store.dispatch((dispatch) => {
            this.cooldown = true;
            setTimeout(() => {
                dispatch(update_statistics(this));
                setTimeout(() => this.cooldown = false, 30);
            }, 0);
        });
    }

    recieve(key, value=undefined) {
        if (value !== undefined) {
            this.recieve_key(key, value);
        } else {
            this.recieve_batch(key);
        }
    }

    recieve_key(key, value) {
        this.data[key] = value;
        this.data = {...this.data};
        this.force_update();
    }

    recieve_batch(data) {
        for (let key in data) {
            let value = data[key];
            this.data[key] = value;
        }
        this.data = {...this.data};
        this.force_update();
    }

}