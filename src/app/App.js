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
import { Observable } from './Observable';


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

    let x = 100;
    this.size = new Observable(vec3.fromValues(x, x, x));
    this.camera = new Camera(this.size);

    this.shader_manager = new ShaderManager(gl, this.size, this.camera);
    this.randomiser_manager = new RandomiserManager();
    this.entry_browser = new EntryBrowser();
    this.stats = new Statistics(this.store);

    this.sim = new CellularAutomaton3D(this.size, this.stats);
    this.sim_renderer = new SimulationRenderer(gl, this.size, this.sim, this.shader_manager, this.stats);
    this.border = new Border(gl, this.size, this.camera);

    // everytime randomiser is changed, we update randomiser
    this.randomiser_manager.listen_select((randomiser) => {
      this.sim.set_randomiser(randomiser.to_json());
    });

    // when changing entries, we have a new randomiser and rule
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

    this.size.notify();

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
    let [xi, yi, zi] = this.size.value;
    let [xf, yf, zf] = size;
    if (xi !== xf || yi !== yf || zi !== zf) {
      this.size.value = size;
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


