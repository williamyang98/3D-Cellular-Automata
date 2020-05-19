import { Renderer } from '../gl/Renderer';
import { Camera } from './Camera';
import { vec3 } from 'gl-matrix';

import { SimulationWindow } from './SimulationWindow';
import { Border } from './Border';

export class App {
  constructor(gl) {
    this.gl = gl;
    
    this.fps = 30;
    this.frame_time_ms = 1000/this.fps;

    this.camera = new Camera();


    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.renderer = new Renderer(gl); 

    let x = 30;
    this.size = vec3.fromValues(x, x, x);
    this.border = new Border(gl, this.size, this.renderer, this.camera);
    this.simulation_window = new SimulationWindow(gl, this.size, this.renderer, this.camera);

    this.camera.model_translation = vec3.create();
    vec3.scale(this.camera.model_translation, this.size, -0.5);

    this.camera.view_position[2] = -this.size[2] * 2.5;
  }

  run() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop() {
    this.on_update();
    this.on_render();
    requestAnimationFrame(this.loop.bind(this));
  }

  on_update() {
    this.simulation_window.on_update();
  }
    
  on_render() {
    this.renderer.clear();
    this.border.on_render();
    this.simulation_window.on_render();
  }
}




