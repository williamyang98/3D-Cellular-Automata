import { vec2 } from 'gl-matrix';

export class MouseController {
  constructor(camera) {
    this.camera = camera;
    this.listeners = {
      onMouseDown: ev => this.on_mouse_down(ev),
      onMouseUp: ev => this.on_mouse_up(ev),
      onMouseMove: ev => this.on_mouse_move(ev),
      onWheel: ev => this.on_wheel(ev)
    };

    this.rotating = false;
    this.zooming = false;

    this.mouse_start_pos = vec2.create(); 

  }

  on_mouse_down(ev) {
    this.rotating = true;
    this.mouse_start_pos[0] = ev.clientX;
    this.mouse_start_pos[1] = ev.clientY;
  }

  on_mouse_up(ev) {
    this.rotating = false;
  }

  on_mouse_move(ev) {
    if (!this.rotating || !this.mouse_start_pos) return;
    let factor = 5/1000;
    let curr_pos = vec2.fromValues(ev.clientX, ev.clientY);
    let delta = vec2.create();
    vec2.sub(delta, this.mouse_start_pos, curr_pos);
    vec2.scale(delta, delta, factor);

    this.camera.rotate(delta[0], delta[1]);
    
    this.mouse_start_pos = curr_pos;
  }

  on_wheel(ev) {
    let delta_zoom = ev.deltaY * 0.001;
    this.camera.zoom(delta_zoom);
    // ev.stopPropagation();
    // ev.preventDefault();
    // find a way to stop scrolling
  }
}