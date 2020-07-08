import { vec2 } from 'gl-matrix';

export class TouchScreenController {
  constructor(camera) {
    this.camera = camera;

    this.listeners = {
      onTouchStart: ev => this.on_touch_start(ev), 
      onTouchMove: ev => this.on_touch_move(ev),
      onTouchEnd: ev => this.on_touch_end(ev),
    };

    this.rotating = false;
    this.zooming = false;

    this.total_touches = 0;
    this.touch_start_pos = vec2.create();
    this.touch_zoom_distance = 0;
    this.touch_list = [];
  }

  on_touch_start(ev) {
    let touches = ev.touches;
    this.touch_list.push(...touches);
    this.total_touches += touches.length;
    if (this.total_touches === 1) {
      this.rotating = true;
      this.zooming = false;
      let touch = this.touch_list[this.touch_list.length-1];
      this.touch_start_pos = vec2.fromValues(touch.clientX, touch.clientY);
    } else if (this.total_touches >= 2) {
      this.zooming = true;
      this.rotating = false;
      let zoom_touches = this.touch_list.slice(this.touch_list.length-2, this.touch_list.length);
      this.touch_zoom_distance = this.calculate_touch_distance(...zoom_touches);
    }
  }

  on_touch_end(ev) {
    this.rotating = false;
    this.zooming = false;
    this.touch_list = [];
    this.total_touches = 0;
    // this.touch_list.pop();
    // this.total_touches -= 1;
    if (this.total_touches < 2) {
      this.zooming = false;
    } 
    if (this.total_touches < 1) {
      this.rotating = false;
    }
  }

  on_touch_move(ev) {
    if (!this.rotating && !this.zooming) return;
    if (this.rotating) {
      this.on_touch_rotate(ev);
    } else if (this.zooming) {
      this.on_touch_zoom(ev);
    }
  }

  on_touch_rotate(ev) {
    let touches = ev.touches;
    if (touches.length < 1) return;

    let touch = ev.touches[0];
    let factor = 5/1000;
    let curr_pos = vec2.fromValues(touch.clientX, touch.clientY);
    let delta = vec2.create();
    vec2.sub(delta, this.touch_start_pos, curr_pos);
    vec2.scale(delta, delta, factor);

    this.camera.rotate(delta[0], delta[1]);
    
    this.touch_start_pos = curr_pos;
  }

  on_touch_zoom(ev) {
    let touches = ev.touches;
    let distance = this.touch_zoom_distance;
    if (touches.length >= 2) {
      distance = this.calculate_touch_distance(touches[0], touches[1]);
    } else {
      // find nearest
      let touch = touches[0];
      let touch_a = this.touch_list[this.touch_list.length-2];
      let touch_b = this.touch_list[this.touch_list.length-1];
      let dist_a = this.calculate_touch_distance(touch_a, touch);
      let dist_b = this.calculate_touch_distance(touch_b, touch);

      // update touch a
      if (dist_a < dist_b) {
        this.touch_list[this.touch_list.length-2] = touch;
        distance = dist_b;
      } else {
        this.touch_list[this.touch_list.length-1] = touch;
        distance = dist_a;
      }
      
    }
    let scale = distance / this.touch_zoom_distance;
    this.touch_zoom_distance = distance;
    this.camera.zoom(1.0-scale);
  }

  calculate_touch_distance(first, second) {
    let pos_start = vec2.fromValues(first.clientX, first.clientY);
    let pos_end = vec2.fromValues(second.clientX, second.clientY);
    let delta = vec2.create();
    vec2.sub(delta, pos_start, pos_end);
    let length = vec2.length(delta);
    return length;
  }
}