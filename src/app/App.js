import { Renderer } from '../gl/Renderer';
import { Camera } from './Camera';
import { vec3 } from 'gl-matrix';

import { SimulationRenderer } from './SimulationRenderer';
import { Border } from './Border';
import { ShaderManager } from './ShaderManager';
import { RuleBrowser } from './RuleBrowser';
import { Statistics } from './Statistics';
import { RandomiserManager } from './RandomiserManager';
import { Toggle } from '../ui/AdjustableValues';

export class App {
  constructor(gl, store) {
    this.gl = gl;
    this.store = store;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    this.renderer = new Renderer(gl); 
    this.camera = new Camera();

    this.shader_manager = new ShaderManager(gl, this.camera);
    this.randomiser_manager = new RandomiserManager();
    this.rule_browser = new RuleBrowser(this.randomiser_manager);
    this.stats = new Statistics(this.store);

    let x = 100;
    this.set_size(vec3.fromValues(x, x, x));

    this.show_border = new Toggle(true);
    this.show_render = new Toggle(true);

    // select amoeba with layer colouring
    this.shader_manager.select_colouring(2);
    this.rule_browser.select_entry(2);
    this.sim.randomise();
  }

  set_size(size) {
    let gl = this.gl;

    this.size = size;

    this.shader_manager.set_size(this.size);
    this.sim = new SimulationRenderer(gl, this.size, this.camera, this.shader_manager, this.rule_browser, this.randomiser_manager, this.stats);
    this.border = new Border(gl, this.size, this.renderer, this.camera);

    this.camera.model_translation = vec3.create();
    vec3.scale(this.camera.model_translation, this.size, -0.5);
    // this.camera.view_position[2] = -this.size[2] * 2.5;
    vec3.scale(this.camera.view_position, this.size, 0.5);
    vec3.add(this.camera.view_position, this.camera.view_position, vec3.fromValues(20, 20, 20));
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
    this.sim.on_update();
  }
    
  on_render() {
    this.renderer.clear();
    if (this.show_border.value) {
      this.border.on_render();
    }
    if (this.show_render.value) {
      this.sim.on_render();
    }
  }
}




