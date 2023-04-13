import { Vector2D } from "./Vector2D.js";

class MouseController {
    constructor() {
        this.rotating = false;
        this.zooming = false;
        this.mouse_start_pos = new Vector2D(0,0); 

        this.ev_rotate = new Set(); // (dx,dy) => {}
        this.ev_zoom = new Set();   // (d_zoom) => {}
    }

    bind_to_element = (elem) => {
        elem.addEventListener("mousedown",  ev => this.on_mouse_down(ev));
        elem.addEventListener("mouseup",    ev => this.on_mouse_up(ev));
        elem.addEventListener("mousemove",  ev => this.on_mouse_move(ev));
        elem.addEventListener("mousewheel", ev => this.on_wheel(ev));
    }

    on_mouse_down = (ev) => {
        this.rotating = true;
        this.mouse_start_pos = new Vector2D(ev.clientX, ev.clientY);
    }

    on_mouse_up = (ev) => {
        this.rotating = false;
    }

    on_mouse_move = (ev) => {
        if (!this.rotating || !this.mouse_start_pos) return;
        let factor = 5/1000;

        let curr_pos = new Vector2D(ev.clientX, ev.clientY);
        let delta = this.mouse_start_pos.sub(curr_pos);
        delta = delta.scale(factor);
        this.mouse_start_pos = curr_pos;

        for (let listener of this.ev_rotate) {
            listener(delta.x, delta.y);
        }
    }

    on_wheel = (ev) => {
        let delta_zoom = ev.deltaY * 0.001;
        for (let listener of this.ev_zoom) {
            listener(delta_zoom);
        }
        ev.stopPropagation();
        ev.preventDefault();

    }
}

export { MouseController };