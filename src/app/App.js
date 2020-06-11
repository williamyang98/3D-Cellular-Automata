import { Renderer } from '../gl/Renderer';
import { Camera } from './Camera';
import { vec3 } from 'gl-matrix';

import { SimulationRenderer } from './SimulationRenderer';
import { Border } from './Border';
import { ShaderManager } from './ShaderManager';
import { EntryBrowser } from './entry_browser/EntryBrowser';
import { Statistics } from './Statistics';
import { RandomiserManager } from './RandomiserManager';
import { Toggle } from '../ui/AdjustableValues';

export class App {
  constructor(gl, store) {
    this.gl = gl;
    this.store = store;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    this.renderer = new Renderer(gl); 
    this.camera = new Camera();

    this.shader_manager = new ShaderManager(gl, this.camera);
    this.randomiser_manager = new RandomiserManager();
    this.entry_browser = new EntryBrowser();
    this.stats = new Statistics(this.store);
    this.sim = new SimulationRenderer(gl, this.camera, this.shader_manager, this.entry_browser, this.randomiser_manager, this.stats);

    let x = 100;
    this.set_size(vec3.fromValues(x, x, x));

    this.show_border = new Toggle(true);
    this.show_render = new Toggle(true);

    this.entry_browser.listen_select((entry) => {
      let randomiser = entry.randomiser;
      if (randomiser) {
        this.randomiser_manager.update_randomiser(randomiser);
      }
    });

    // select amoeba with layer colouring
    this.entry_browser.select('System', 3);
    this.shader_manager.update_params({colouring: 0});
    this.sim.randomise();
  }

  set_size(size) {
    let gl = this.gl;
    this.size = size;
    this.sim.set_size(size);
    this.shader_manager.set_size(size);
    this.border = new Border(gl, this.size, this.renderer, this.camera);

    this.camera.model_translation = vec3.create();
    vec3.scale(this.camera.model_translation, this.size, -0.5);
    // this.camera.view_position[2] = -this.size[2] * 2.5;
    // zoom along minimum axis
    // zoom by maximum axis
    let distance = Math.max(...size);
    let min_index = argmin([...size]); 

    this.camera.view_position = vec3.create();
    this.camera.view_position[min_index] = distance*1.5;
    // glitchy around y axis due to euler angle rotation, so add offset
    if (min_index === 1) {
      this.camera.view_position[2] = 1;
    }
    // vec3.scale(this.camera.view_position, this.size, 0.5);
    // vec3.add(this.camera.view_position, this.camera.view_position, vec3.fromValues(20, 20, 20));
  }

  run() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop() {
    this.on_update();
    this.on_render();
    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    let gl = this.gl;
    let canvas = gl.canvas;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    if (width === canvas.width && height === canvas.height)
      return;

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    this.camera.aspect_ratio = width/height;
  }

  on_update() {
    this.sim.on_update();
  }
    
  on_render() {
    this.resize();
    this.renderer.clear();
    if (this.show_border.value) {
      this.border.on_render();
    }
    if (this.show_render.value) {
      this.sim.on_render();
    }
  }
}

function argmin(list) {
  let min_i = 0;
  let min_val = list[0];
  for (let i = 1; i < list.length; i++) {
    let val = list[i];
    if (val < min_val) {
      min_val = val;
      min_i = i;
    }
  } 
  return min_i;
}



