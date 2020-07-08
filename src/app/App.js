import { Camera } from './Camera';
import { CellularAutomaton3D } from '../simulation/CellularAutomaton3D';
import { vec3 } from 'gl-matrix';

import { SimulationRenderer } from './rendering/SimulationRenderer';
import { Border } from './rendering/Border';
import { ShaderManager } from './rendering/ShaderManager';
import { EntryBrowser } from './entry_browser/EntryBrowser';
import { Statistics } from './Statistics';
import { RandomiserManager } from './RandomiserManager';
import { Toggle, Color } from '../ui/util/AdjustableValues';


export class App {
  constructor(gl, store) {
    this.gl = gl;
    this.store = store;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.show_border = new Toggle(true, "Show an outlining border");
    this.show_render = new Toggle(true, "Show the grid of cells (Disable if you want to see result later)");
    this.background_colour = new Color([255,255,255], "Background Colour");

    this.camera = new Camera();

    this.shader_manager = new ShaderManager(gl, this.camera);
    this.randomiser_manager = new RandomiserManager();
    this.entry_browser = new EntryBrowser();
    this.stats = new Statistics(this.store);

    this.sim = new CellularAutomaton3D(this.stats);
    this.sim_renderer = new SimulationRenderer(gl, this.sim, this.shader_manager, this.stats);

    let x = 100;
    this.set_size(vec3.fromValues(x, x, x));

    this.randomiser_manager.listen_select((randomiser) => {
      this.sim.set_randomiser(randomiser.to_json());
    });

    this.entry_browser.listen_select((entry) => {
      let randomiser = entry.randomiser;
      let rule = entry.rule;
      if (randomiser) {
        this.randomiser_manager.update_randomiser(randomiser);
      }
      if (rule) {
        this.sim.set_rule(rule.to_json());
        this.sim_renderer.max_neighbours = rule.neighbour.max;
      }
    });

    // select amoeba with layer colouring
    this.entry_browser.select('Default', 0);
    this.shader_manager.update_params({colouring: 0});
    this.randomise();
  }

  randomise() {
    let randomiser = this.randomiser_manager.current_randomiser;
    this.sim.set_randomiser(randomiser.to_json());
    this.sim.randomise();
  }

  set_size(size) {
    let gl = this.gl;
    this.size = size;
    this.sim.set_size(size);
    this.sim_renderer.set_size(size);
    this.shader_manager.set_size(size);

    this.border = new Border(gl, this.size, this.camera);

    this.camera.model_translation = vec3.create();
    vec3.scale(this.camera.model_translation, this.size, -0.5);
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
  }

  // try render each frame
  run() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop() {
    this.on_update();
    this.on_render();
    requestAnimationFrame(this.loop.bind(this));
  }

  // when resizing the canvas element, we need to update opengl viewport
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
    this.camera.update();
  }
    
  on_render() {
    let gl = this.gl;
    this.resize();
    
    {
      let c = this.background_colour.value;
      gl.clearColor(c[0]/255, c[1]/255, c[2]/255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    if (this.show_border.value) {
      this.border.on_render();
    }
    if (this.show_render.value) {
      this.sim_renderer.on_render();
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



