import { Compute_Volume } from "./compute_volume.js";
import { Volume_Data } from "./volume_data.js";
import { Render_Volume, Render_Volume_Params } from "./render_volume.js";
import { Randomise_Volume } from "./randomise_volume.js";
import { Clear_Volume } from "./clear_volume.js";

import { Camera } from "./camera/Camera.js";
import { CameraController } from "./camera/CameraController.js";

class Simulation {
    constructor() {
        // NOTE: initialised from this.set_canvas(...)
        this.canvas = null;
        this.gl = null;
        this.is_loop_started = false;

        this.shaders = {};
        this.shaders.compute_volume = null;
        this.shaders.randomise_volume = null;
        this.shaders.render_volume = null;
        this.shaders.clear_volume = null;

        // NOTE: Updated in render loop
        this.shader_data = null;
        // NOTE: initialised from this.set_size(...)
        this.size = null;
        // NOTE: initialised from this.set_rule(...)
        this.rule = null;

        this.camera = new Camera();
        this.camera_controller = new CameraController(this.camera);

        this.params = {}
        this.params.render_volume = new Render_Volume_Params();
        // NOTE: initialised from this.set_randomiser_params_getter(...)
        //       We use a getter to calculate correct parameters when simulation size changes between updates
        this.params.get_randomiser_volume_params = null;    

        this.statistics = {
            total_steps: 0,
            ms_frame_time: 0
        };
        this.ms_last_frame = null;

        this.action = {};
        this.action.is_randomise = false;
        this.action.is_clear = false;
        this.action.is_running = false;
        this.action.is_step = false;
        this.action.is_render = true;
        this.action.is_new_size = false;

        // NOTE: Emit updates per animation frame
        this.on_animation_frame = new Set();
    }

    /**
     * Binds application to a canvas element
     * @param {DOMElement} canvas 
     */
    set_canvas = (canvas) => {
        if (this.canvas !== null) {
            if (this.canvas === canvas) {
                console.error("Attempting to rebind same canvas twice in App.set_canvas");
            } else {
                console.error("Attempting to rebind different canvas in App.set_canvas");
            }
            return;
        }

        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");

        this.camera_controller.bind_to_element(canvas);

        this.shaders.compute_volume = new Compute_Volume(this.gl);
        this.shaders.randomise_volume = new Randomise_Volume(this.gl);
        this.shaders.render_volume = new Render_Volume(this.gl);
        this.shaders.clear_volume = new Clear_Volume(this.gl);
    }

    /**
     * @param {Rule} rule
     */
    set_rule = (rule) => {
        this.rule = rule;
    }

    /** 
     * Sets the callback that creates our parameteres for the randomise volume shader
     * @param {(Object{x,y,z}) => Randomise_Volume_Params} callback
     */
    set_randomiser_params_getter = (callback) => {
        this.params.get_randomiser_volume_params = callback;
    }

    set_size = (x, y, z) => {
        if (this.size !== null) {
            if ((this.size.x === x) && (this.size.y === y) && (this.size.z === z)) {
                return;
            }
        }
        this.size = { x, y, z };
        this.action.is_new_size = true;
    }

    randomise = () => {
        this.action.is_randomise = true;
    }

    clear = () => {
        this.action.is_clear = true;
    }

    perform_step = () => {
        this.action.is_step = true;
    }

    set_is_running = (is_running) => {
        this.action.is_running = is_running;
    }

    get_is_running = () => {
        return this.action.is_running;
    }

    get_size = () => {
        return this.size;
    }

    /**
     * Our render and compute pipeline
     * @private
     */
    render = () => {
        // Can only render when canvas is binded
        if (this.canvas === null) {
            return;
        }

        // NOTE: Set size within render loop so volume data size doesn't change 
        //       unexpectedly between shader invokations
        if (this.action.is_new_size) {
            this.action.is_new_size = false;
            let { x, y, z } = this.size;
            let gl = this.gl;
            this.shader_data = {};
            this.shader_data.volume_old = new Volume_Data(gl, x, y, z);
            this.shader_data.volume_new = new Volume_Data(gl, x, y, z);
            this.statistics.total_steps = 0;
        }

        // NOTE: Size of data structures must be set
        if (this.shader_data === null) {
            return;
        }

        // NOTE: Detect viewport size changes when the canvas resizes 
        //       This can occur when resizing or rotating the screen
        let viewport = {
            x: Math.floor(Number(this.canvas.clientWidth)), 
            y: Math.floor(Number(this.canvas.clientHeight))
        };
        this.canvas.width = viewport.x;
        this.canvas.height = viewport.y;

        // NOTE: Camera needs the viewport size to correctly compute projection matrix
        //       Otherwise we can end up with the incorrect aspect ratio
        this.camera.update(viewport);
        
        // Clear volume
        if (this.action.is_clear) {
            this.shaders.clear_volume.render(this.shader_data.volume_old);
            this.action.is_clear = false;
            this.statistics.total_steps = 0;
        }

        // Randomise volume with rule_entry parameters
        if (this.action.is_randomise) {
            this.action.is_randomise = false;
            let get_callback = this.params.get_randomiser_volume_params;
            if (get_callback !== null) {
                let params = get_callback(this.size);
                this.shaders.randomise_volume.render(this.shader_data.volume_old, params);
            }
        }

        // Compute single step of cellular automata
        // NOTE: Refer to Rule_Entry for when the entry is valid
        if ((this.action.is_running || this.action.is_step)) {
            this.action.is_step = false;
            if (this.rule !== null) {
                this.shaders.compute_volume.render(this.shader_data.volume_old, this.shader_data.volume_new, this.rule);
                this.statistics.total_steps++;

                // swap volume buffers
                let tmp = this.shader_data.volume_old;
                this.shader_data.volume_old = this.shader_data.volume_new;
                this.shader_data.volume_new = tmp;
            }
        }

        // Render volume to screen
        if (this.action.is_render) {
            this.shaders.render_volume.render(
                this.camera, viewport, 
                this.params.render_volume, 
                this.shader_data.volume_old
            );
        }
    }

    // NOTE: webgl performs draw calls at the end of the frame
    //       So we can only really benchmark the summation of all draw calls
    update_frame_time = () => {
        let ms_now = performance.now();
        if (this.ms_last_frame !== null) {
            const beta_update = 0.5;
            let ms_delta = ms_now - this.ms_last_frame;
            let old_ms_delta = this.statistics.ms_frame_time;
            let new_ms_delta = (1-beta_update)*old_ms_delta + beta_update*ms_delta;
            this.statistics.ms_frame_time = new_ms_delta;
        }
        this.ms_last_frame = ms_now;
    }

    listen_for_animation_frame = (callback) => {
        this.on_animation_frame.add(callback);
    }

    unlisten_for_animation_frame = (callback) => {
        this.on_animation_frame.delete(callback);
    }

    notify_on_animation_frame = () => {
        for (let listener of this.on_animation_frame) {
            listener();
        }
    }

    start_loop = () => {
        if (this.is_loop_started) {
            console.error('Simulation loop has already been started');
            return;
        }
        this.is_loop_started = true;
        this._loop();
    }

    // Render loop which is invoked by calling this.loop()
    // NOTE: You should only call this once otherwise you end up with two render loops
    _loop = () => {
        this.update_frame_time();
        this.render();
        this.notify_on_animation_frame();
        requestAnimationFrame(() => this._loop());
    }
}

export { Simulation };