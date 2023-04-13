import { Vector2D } from "./Vector2D.js";

class TouchScreenController {
    static Control_Status = {
        NONE: 0,
        ROTATING: 1,
        ZOOMING: 2
    };

    constructor() {
        this.touch_start_pos = new Vector2D(0,0);
        this.touch_zoom_distance = 0;
        this.status = TouchScreenController.Control_Status.NONE;
        this.touch_list = [];

        this.ev_rotate = new Set(); // (dx, dy) => {}
        this.ev_zoom = new Set();   // (d_zoom) => {}
    }

    bind_to_element = (elem) => {
        elem.addEventListener("touchstart", ev => this.on_touch_start(ev));
        elem.addEventListener("touchend",   ev => this.on_touch_end(ev));
        elem.addEventListener("touchmove",  ev => this.on_touch_move(ev));
    }

    on_touch_start = (ev) => {
        ev.preventDefault();
        let touches = ev.touches;
        this.touch_list.push(...touches);
        let total_touches = this.touch_list.length;
        if (total_touches === 1) {
            this.status = TouchScreenController.Control_Status.ROTATING;
            let touch = this.touch_list[total_touches-1];
            this.touch_start_pos = new Vector2D(touch.clientX, touch.clientY);
        } else if (total_touches >= 2) {
            this.status = TouchScreenController.Control_Status.ZOOMING;
            let zoom_touches = this.touch_list.slice(total_touches-2, total_touches);
            this.touch_zoom_distance = this._calculate_touch_distance(...zoom_touches);
        }
    }

    on_touch_end = (ev) => {
        // NOTE: https://stackoverflow.com/a/1232046
        //       This is the fastest way to clear an array
        ev.preventDefault();
        this.touch_list.length = 0;
        this.status = TouchScreenController.Control_Status.NONE;
    }

    on_touch_move = (ev) => {
        ev.preventDefault();
        switch (this.status) {
        case TouchScreenController.Control_Status.ROTATING:
            this._on_touch_rotate(ev);
            break;
        case TouchScreenController.Control_Status.ZOOMING:
            this._on_touch_zoom(ev);
            break;
        case TouchScreenController.Control_Status.NONE:
        default:
            break;
        }
    }

    _on_touch_rotate = (ev) => {
        let touches = ev.touches;
        if (touches.length < 1) {
            return;
        }

        let touch = ev.touches[0];
        let factor = 5/1000;

        let new_pos = new Vector2D(touch.clientX, touch.clientY);
        let delta_pos = this.touch_start_pos.sub(new_pos);
        delta_pos = delta_pos.scale(factor);
        this.touch_start_pos = new_pos;

        for (let listener of this.ev_rotate) {
            listener(delta_pos.x, delta_pos.y);
        }
    }

    _on_touch_zoom = (ev) => {
        let touches = ev.touches;

        let new_distance = 0;
        if (touches.length >= 2) {
            new_distance = this._calculate_touch_distance(touches[0], touches[1]);
        } else {
            let touch = touches[0];
            // NOTE: Always at least two touches registered when rotating
            //       Find which touch this is referencing when only one touch moved
            let touch_a = this.touch_list[this.touch_list.length-2];
            let touch_b = this.touch_list[this.touch_list.length-1];
            let dist_a = this._calculate_touch_distance(touch_a, touch);
            let dist_b = this._calculate_touch_distance(touch_b, touch);

            let is_touch_a_moved = (dist_a < dist_b);
            if (is_touch_a_moved) {
                this.touch_list[this.touch_list.length-2] = touch;
                new_distance = dist_b;
            } else {
                this.touch_list[this.touch_list.length-1] = touch;
                new_distance = dist_a;
            }
        }

        let scale = new_distance / this.touch_zoom_distance;
        this.touch_zoom_distance = new_distance;
        let delta_zoom = 1.0 - scale;
        for (let listener of this.ev_zoom) {
            listener(delta_zoom);
        }
    }

    _calculate_touch_distance = (first, second) => {
        let pos_start = new Vector2D(first.clientX, first.clientY);
        let pos_end = new Vector2D(second.clientX, second.clientY);
        let delta = pos_start.sub(pos_end);
        let length = delta.length();
        return length;
    }
}

export { TouchScreenController };