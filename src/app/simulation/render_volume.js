import { compile_program } from "./compile_shader.js"
import { Uniform_Location_Cache } from "./uniform_location_cache.js";
import { create_optimised_cube } from "./mesh/cube.js";
import { create_state_colours } from "./colours/state_colours.js";
import { create_radial_colours } from "./colours/radial_colours.js";

const Render_Volume_Colour_Schemes = {
    STATE: 0,
    XYZ: 1,
    LAYER: 2,
    RADIAL: 3, 
    NEIGHBOUR: 4,
    NEIGHBOUR_AND_ALIVE: 5,
};

class Render_Volume_Params {
    constructor() {
        this.colour_scheme = Render_Volume_Colour_Schemes.STATE;

        this.clear_colour = { r: 1, g: 1, b: 1};
        this.occlusion_factor = 0.65;

        this.border_thickness = 0.10;
        this.border_colour = { r: 0, g: 0, b: 0 };

        this.sky_colour_top = { r: 1.0, g: 1.0, b: 1.0 };
        this.sky_colour_bottom = { r: 0.5, g: 0.5, b: 0.5 };
        this.sun_colour = { r: 1, g: 1, b: 1 };
        this.sun_direction = { x: 0.5, y: 1, z: -0.1 };
        this.sun_strength = 0.9;
        this.sky_strength = 0.3;

        this.lighting_amount = 1.0;
    }
}

class Render_Volume {
    constructor(gl) {
        this.gl = gl;
        this.generate_mesh();
        this.generate_colours();
        this.programs = {};
    }

    generate_mesh = () => {
        let gl = this.gl;

        // Raycast using cube as psuedo screen
        let mesh = create_optimised_cube(-1,1,1,-1,1,-1);

        let vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertex_data, gl.STATIC_DRAW);

        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.index_data, gl.STATIC_DRAW);

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            let index = 0;
            let count = 3;
            let is_normalised = false; 
            let size = 4;
            let stride = count*size;
            let offset = 0;
            gl.vertexAttribPointer(index, count, gl.FLOAT, is_normalised, stride, offset);
            gl.enableVertexAttribArray(index);
        }

        this.mesh = mesh;
        this.ibo = ibo;
        this.vao = vao;
        this.vbo = vbo;
    }

    /**
     * @param {Number} width
     * @param {Number} height
     * @param {Number} total_channels
     * @param {Float32Array} data 
     * @param {WebGL2RenderingContext.WRAP_TYPE} wrap_type 
     * @returns 
     */
    create_texture_from_data = ({ width, height, total_channels, data }, wrap_type) => {
        let gl = this.gl;

        if (wrap_type === undefined) {
            wrap_type = gl.CLAMP_TO_EDGE;
        }

        let specifier = null;
        switch (total_channels) {
        case 1: specifier = { internal_format: gl.R8, format: gl.RED }; break;
        case 2: specifier = { internal_format: gl.RG8, format: gl.RG }; break;
        case 3: specifier = { internal_format: gl.RGB8, format: gl.RGB }; break;
        case 4: specifier = { internal_format: gl.RGBA8, format: gl.RGBA }; break;
        default:
            throw Error(`Unsupported number of channels: ${total_channels}`);
        }

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap_type);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap_type);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, total_channels);
        gl.pixelStorei(gl.PACK_ALIGNMENT, total_channels);
        gl.texImage2D(gl.TEXTURE_2D, 0, specifier.internal_format, width, height, 0, specifier.format, gl.UNSIGNED_BYTE, data);

        return texture;
    }

    generate_colours = () => {
        let gl = this.gl;

        let colour_data = {};
        let colour_textures = {};
        let shader_colour_textures = {};

        // NOTE: This is code that will be inserted into the fragment shader for colouring
        //       Expects the following code:
        //       - uniform sampler2D u_colour_lut;  // If the colouring scheme uses a texture lookup
        //       - bool is_ray_hit(vec4 cell) { ... }
        //       - vec3 get_cell_colour(vec4 cell, vec3 sample_pos) { ... }
        let get_cell_colour_src = {};

        colour_data.state = create_state_colours(255);
        colour_data.radial = create_radial_colours();
        colour_textures.state = this.create_texture_from_data(colour_data.state, gl.CLAMP_TO_EDGE);
        colour_textures.radial = this.create_texture_from_data(colour_data.radial, gl.REPEAT);

        // NOTE: Colouring schemes which don't need a texture will: 
        //       - store null as their texture id
        //       - exclude the 'uniform sampler2D u_colour_lut' definition in their fragment shader
        shader_colour_textures[Render_Volume_Colour_Schemes.STATE] = colour_textures.state;
        get_cell_colour_src[Render_Volume_Colour_Schemes.STATE] = `
            uniform sampler2D u_colour_lut;   // NOTE: webgl2 doesn't have 1D textures

            bool is_ray_hit(vec4 cell) {
                float state = cell[0];
                return state > 0.0;
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                float state = cell[0];
                vec3 colour = texture(u_colour_lut, vec2(state, 0.5)).rgb;
                return colour;
            }
        `;

        shader_colour_textures[Render_Volume_Colour_Schemes.XYZ] = null;
        get_cell_colour_src[Render_Volume_Colour_Schemes.XYZ] = `
            bool is_ray_hit(vec4 cell) {
                float state = cell[0];
                return state > 0.0;
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                vec3 colour = sample_pos;
                return colour;
            }
        `;

        shader_colour_textures[Render_Volume_Colour_Schemes.LAYER] = colour_textures.radial;
        get_cell_colour_src[Render_Volume_Colour_Schemes.LAYER] = `
            uniform sampler2D u_colour_lut;   // NOTE: webgl2 doesn't have 1D textures

            bool is_ray_hit(vec4 cell) {
                float state = cell[0];
                return state > 0.0;
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                const float layer_size = 40.0;

                const vec3 center = vec3(0.5);
                vec3 delta_from_center = abs(sample_pos-center);
                delta_from_center = delta_from_center*u_grid_size;  // convert to real coordinates

                float distance = length(delta_from_center);
                float layer_value = distance/layer_size;
                // NOTE: Texture uses mirror repeat
                vec3 colour = texture(u_colour_lut, vec2(layer_value, 0.5)).rgb;
                return colour;
            }
        `;

        shader_colour_textures[Render_Volume_Colour_Schemes.RADIAL] = colour_textures.radial;
        get_cell_colour_src[Render_Volume_Colour_Schemes.RADIAL] = `
            uniform sampler2D u_colour_lut;   // NOTE: webgl2 doesn't have 1D textures

            bool is_ray_hit(vec4 cell) {
                float state = cell[0];
                return state > 0.0;
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                const vec3 center = vec3(0.5);
                float distance = length(sample_pos-center);
                distance = distance * 2.0;
                // NOTE: Clamp maximum radius to edge of texture
                distance = min(distance, 1.0);
                vec3 colour = texture(u_colour_lut, vec2(distance, 0.5)).rgb;
                return colour;
            }
        `;

        shader_colour_textures[Render_Volume_Colour_Schemes.NEIGHBOUR] = colour_textures.state;
        get_cell_colour_src[Render_Volume_Colour_Schemes.NEIGHBOUR] = `
            uniform sampler2D u_colour_lut;   // NOTE: webgl2 doesn't have 1D textures

            bool is_ray_hit(vec4 cell) {
                float neighbour = cell[1];
                return neighbour > 0.0;
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                float neighbour = cell[1];
                vec3 colour = texture(u_colour_lut, vec2(neighbour, 0.5)).rgb;
                return colour;
            }
        `;

        shader_colour_textures[Render_Volume_Colour_Schemes.NEIGHBOUR_AND_ALIVE] = colour_textures.state;
        get_cell_colour_src[Render_Volume_Colour_Schemes.NEIGHBOUR_AND_ALIVE] = `
            uniform sampler2D u_colour_lut;   // NOTE: webgl2 doesn't have 1D textures

            bool is_ray_hit(vec4 cell) {
                float state = cell[0];
                float neighbour = cell[1];
                return (state > 0.0) && (neighbour > 0.0);
            }

            vec3 get_cell_colour(vec4 cell, vec3 sample_pos) {
                float neighbour = cell[1];
                vec3 colour = texture(u_colour_lut, vec2(neighbour, 0.5)).rgb;
                return colour;
            }
        `;
        
        this.colour_data = colour_data;
        this.colour_textures = colour_textures;
        this.shader_colour_textures = shader_colour_textures;
        this.get_cell_colour_src = get_cell_colour_src;
    }

    create_program = (colour_scheme, is_render_border) => {
        let gl = this.gl;

        if (!(colour_scheme in Object.values(Render_Volume_Colour_Schemes))) {
            throw Error(`Invalid colour scheme: ${colour_scheme}`);
        }

        let vertex_shader_src =
           `#version 300 es
            precision highp float;

            layout(location = 0) in vec3 position;
            out vec3 v_position;
            out vec3 v_ray_start_pos; // relative to 0...1 texture coordinates

            uniform vec3 u_norm_size;
            uniform mat4 u_model;
            uniform mat4 u_view;
            uniform mat4 u_projection;
            uniform vec3 u_view_position;
            uniform float u_is_inside;

            // Convert real coordinates to 0 to +1 texture coordinates
            vec3 norm_to_texture_coord(vec3 x) {
                x = x / abs(u_norm_size);
                return (x+1.0)/2.0;
            }

            void main() {
                vec3 vertex_pos = position*u_norm_size;
                v_position = (u_model * vec4(vertex_pos, 1.0)).xyz;

                mat4 MVP = u_projection * u_view * u_model;
                vec4 screen_pos = MVP * vec4(vertex_pos, 1.0);
                gl_Position = screen_pos;

                // NOTE: When inside, ray goes from camera to back face
                //       When outside, ray goes from front face to back face
                vec3 inside_pos = norm_to_texture_coord(u_view_position);
                vec3 outside_pos = norm_to_texture_coord(vertex_pos);
                v_ray_start_pos = mix(outside_pos, inside_pos, u_is_inside);
            } 
        `;

        
        let fragment_shader_src = 
           `#version 300 es
            precision highp sampler3D;
            precision highp sampler2D;
            precision highp float;

            in vec3 v_position;
            in vec3 v_ray_start_pos;
            out vec4 v_frag_colour;

            uniform sampler3D u_volume_in;

            uniform vec3 u_grid_size;
            uniform vec3 u_view_position;
            uniform float u_occlusion_factor;
            uniform int u_max_march_steps;

            uniform vec3 u_sky_colour_top;
            uniform vec3 u_sky_colour_bottom;
            uniform vec3 u_sun_colour;
            uniform vec3 u_sun_direction;
            uniform float u_sky_strength;
            uniform float u_sun_strength;
            uniform float u_lighting_amount;

            // NOTE: Border code is optional
            ${
                is_render_border ? `
                uniform float u_border_thickness;
                uniform vec3 u_border_colour;
                ` : ''
            }

            ${this.get_cell_colour_src[colour_scheme]}

            bool is_ray_outside(vec3 pos) {
                return 
                    (pos.x < 0.0) || 
                    (pos.x > 1.0) || 
                    (pos.y < 0.0) || 
                    (pos.y > 1.0) ||
                    (pos.z < 0.0) || 
                    (pos.z > 1.0);
            }

            vec3 calculate_march_step(
                vec3 pos, 
                vec3 dir_norm, vec3 dir_abs, vec3 dir_sign, 
                vec3 march_dir, vec3 one_minus_march_dir, vec3 march_res, vec3 march_res_oversample
            ) {
                vec3 rel_pos = mod(pos, march_res);

                vec3 march_bounds = march_dir*(march_res-rel_pos) + one_minus_march_dir*rel_pos;
                march_bounds = march_bounds + march_res_oversample;

                // How much we should scale each axis to meet maximum march distance
                vec3 axis_scale = march_bounds / dir_abs;
                float scale = min(min(axis_scale.x, axis_scale.y), axis_scale.z);

                vec3 step = dir_norm*scale;
                return step;
            }

            vec3 get_normal(vec3 norm_pos) {
                // Position between -0.5 and +0.5
                vec3 v = norm_pos - 0.5;
                vec3 q = abs(v);

                // We can simplify face detection by taking the absolute of the coordinates
                // Consider the following 2D example
                // 1. line given by y = x
                // 2. region given by y > x
                // 3. region given by y > |x|: This mirrors the region for x > 0
                // 4. region given by |y| > |x|: This mirrors the region for y > 0
                // This produces a Voronoi nearest search which is what we want for face detection
                
                // Produce 3D Voronoi region covering x-axis faces
                if ((q.x > q.y) && (q.x > q.z)) {
                    return vec3(sign(v.x), 0.0, 0.0); 
                } 

                // Produce 2D Voronoi region covering y-axis faces
                if (q.y > q.z) {
                    return vec3(0.0, sign(v.y), 0.0);
                }
                
                return vec3(0.0, 0.0, sign(v.z));
            }

            vec3 get_sun_lighting(const vec3 normal) {
                vec3 light_direction = -normalize(u_sun_direction);
                float angle = max(dot(normal, -light_direction), 0.0);
                return u_sun_colour * u_sun_strength * angle;
            }

            vec3 get_sky_lighting(const vec3 normal) {
                float sky_blend = normal.y * 0.5 + 0.5;
                vec3 sky_light = mix(u_sky_colour_bottom, u_sky_colour_top, sky_blend);
                return sky_light * u_sky_strength;  
            }

            vec3 get_sky_colour(vec3 view_direction) {
                vec3 sky_colour = mix(u_sky_colour_bottom, u_sky_colour_top, max(view_direction.y, 0.0));
                return sky_colour * u_sky_strength;
            }

            vec3 get_lighting(vec3 normal, vec3 view_direction) {
                vec3 sky_lighting = get_sky_lighting(normal);
                vec3 sky_colour = get_sky_colour(view_direction);
                vec3 sun_lighting = get_sun_lighting(normal);
                vec3 total_lighting = sky_lighting + sun_lighting + sky_colour;
                return mix(vec3(1.0), total_lighting, u_lighting_amount);
            }

            // Returns a value from 0 to 1
            float get_border_distance(vec3 norm_pos, vec3 normal) {
                vec3 one_minus_norm_pos = vec3(1.0) - norm_pos;
                vec3 border_pos = min(norm_pos, one_minus_norm_pos);
                border_pos = abs(border_pos);

                // NOTE: We mask out the dimension where the border resides
                //       By adding the absolute of the normal, that dimension
                //       will never factor into the minimum distance calculation
                border_pos += abs(normal);  

                float distance = min(min(border_pos.x, border_pos.y), border_pos.z);
                // Normalise distance 0...0.5 to 0...1
                float norm_distance = 2.0f * distance;
                return norm_distance;
            }

            vec3 get_ray_colour(vec4 cell, vec3 sample_pos, vec3 march_res, vec3 view_direction) {
                vec3 norm_pos = mod(sample_pos, march_res) / march_res;
                vec3 normal = get_normal(norm_pos);

                ${
                    is_render_border ? `
                    float border_distance = get_border_distance(norm_pos, normal);
                    if (border_distance < u_border_thickness) {
                        return u_border_colour;
                    }
                    ` : ""
                }

                float state = cell[0];
                float neighbours = cell[1];

                float brightness = 1.0 - neighbours*u_occlusion_factor;
                vec3 cell_colour = get_cell_colour(cell, sample_pos);
                vec3 lighting = get_lighting(normal, view_direction);

                vec3 result = lighting * cell_colour * brightness;
                return result;
            }

            vec4 shoot_ray() {
                vec3 march_res = 1.0/u_grid_size;
                // NOTE: We add padding to the march in order to prevent infinite loops
                //       This can occur since we can undershoot continuously without padding
                //       This oversampling factor is constant across any grid size, and depends on the floating precision type
                vec3 march_res_oversample = vec3(1e-6f);

                // NOTE: The step direction needs to be rescaled to aspect-ratio of texture
                vec3 dir_norm = normalize((v_position - u_view_position) * march_res);
                vec3 dir_abs = abs(dir_norm);
                vec3 dir_sign = sign(dir_norm);   

                vec3 march_dir = abs((dir_sign+1.0)/2.0);    // 0 for negative, 1 for positive
                vec3 one_minus_march_dir = abs(1.0 - march_dir);

                vec3 ray_pos = v_ray_start_pos;
                // NOTE: Prevent sampling on wrong side of volume by moving starting ray forward slightly
                ray_pos += (march_res_oversample * dir_norm);

                for (int i = 0; i < u_max_march_steps; i++) {
                    vec3 step = calculate_march_step(
                        ray_pos, 
                        dir_norm, dir_abs, dir_sign, 
                        march_dir, one_minus_march_dir, march_res, march_res_oversample
                    );

                    // NOTE: We sample volume at midpoint of march to avoid sampling neighbouring texel
                    step = step * 0.5;
                    vec3 sample_pos = ray_pos;
                    ray_pos += step;
                    vec4 cell = texture(u_volume_in, ray_pos);
                    ray_pos += step;

                    if (is_ray_hit(cell)) {
                        vec3 colour = get_ray_colour(cell, sample_pos, march_res, dir_norm);
                        return vec4(colour, 1.0);
                    }

                    if (is_ray_outside(ray_pos)) {
                        break;
                    }

                }
                return vec4(0,0,0,0);
            }

            void main() {
                v_frag_colour = shoot_ray();
            }
        `;

        return compile_program(gl, vertex_shader_src, fragment_shader_src);
    }

    get_program = (colour_scheme, is_render_border) => {
        let key = `${colour_scheme}-${is_render_border}`;
        if (key in this.programs) {
            return this.programs[key];
        }

        let program = this.create_program(colour_scheme, is_render_border);
        let uniform_location_cache = new Uniform_Location_Cache(this.gl, program);
        let value = { program, uniform_location_cache };
        this.programs[key] = value;
        return value;
    }

    get_normalised_size = (size) => {
        let norm_size = [size.x, size.y, size.z];
        let max_dim = Math.max(...norm_size);
        norm_size = norm_size.map(dim => dim/max_dim);
        return norm_size;
    }

    check_is_camera_inside = (camera, norm_size) => {
        let [x, y, z] = camera.view_position.map(Math.abs);
        let [nx, ny, nz] = norm_size;
        return (x < nx) && (y < ny) && (z < nz);
    }

    calculate_max_march_steps = (size) => {
        let max_dim = Math.max(size.x, size.y, size.z);
        // sqrt(3 * 2^2) = 3.464;
        return Math.ceil(max_dim * 3.5);
    }

    /**
     * @param {Camera} camera
     * @param {Vector2} viewport
     * @param {Render_Volume_Params} params 
     * @param {Volume_Data} volume_in 
     */
    render = (camera, viewport, params, volume_in) => {
        let gl = this.gl;

        // NOTE: Prevent raytrace from wrapping around
        volume_in.set_wrap(false);
        let size = volume_in.size;
        let norm_size = this.get_normalised_size(size);
        const is_camera_inside = this.check_is_camera_inside(camera, norm_size);
        const max_march_steps = this.calculate_max_march_steps(size);
        const is_render_border = (params.border_thickness > 0.0);

        let { program, uniform_location_cache: loc } = this.get_program(params.colour_scheme, is_render_border);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // NOTE: When inside, we use the 3 back faces
        //       When outside, we use the 3 front faces
        if (is_camera_inside) {
            gl.cullFace(gl.FRONT);
        } else {
            gl.cullFace(gl.BACK);
        }

        gl.viewport(0, 0, viewport.x, viewport.y);

        gl.useProgram(program);
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        let texture_slot_volume = 0;
        gl.activeTexture(gl.TEXTURE0+texture_slot_volume);
        gl.bindTexture(gl.TEXTURE_3D, volume_in.texture);

        // NOTE: Some colouring schemes don't need a texture lookup
        let colour_lut_texture = this.shader_colour_textures[params.colour_scheme];
        if (colour_lut_texture !== null) {
            let texture_slot_colour_lut = 1;
            gl.activeTexture(gl.TEXTURE0+texture_slot_colour_lut);
            gl.bindTexture(gl.TEXTURE_2D, colour_lut_texture);
            gl.uniform1i(loc.find("u_colour_lut"), texture_slot_colour_lut);
        }

        gl.uniformMatrix4fv(loc.find("u_model"), false, camera.model);
        gl.uniformMatrix4fv(loc.find("u_view"), false, camera.view);
        gl.uniformMatrix4fv(loc.find("u_projection"), false, camera.projection);
        gl.uniform3f(loc.find("u_view_position"), ...camera.view_position);

        gl.uniform3f(loc.find("u_norm_size"), ...norm_size);
        gl.uniform3f(loc.find("u_grid_size"), size.x, size.y, size.z);
        gl.uniform1i(loc.find("u_volume_in"), texture_slot_volume);
        gl.uniform1f(loc.find("u_occlusion_factor"), params.occlusion_factor);
        gl.uniform1f(loc.find("u_is_inside"), is_camera_inside ? 1.0 : 0.0);
        gl.uniform1i(loc.find("u_max_march_steps"), max_march_steps);

        let rgb_to_arr = (v) => [v.r, v.g, v.b];
        let xyz_to_arr = (v) => [v.x, v.y, v.z];

        gl.uniform3f(loc.find("u_sky_colour_top"), ...rgb_to_arr(params.sky_colour_top));
        gl.uniform3f(loc.find("u_sky_colour_bottom"), ...rgb_to_arr(params.sky_colour_bottom));
        gl.uniform3f(loc.find("u_sun_colour"), ...rgb_to_arr(params.sun_colour));
        gl.uniform3f(loc.find("u_sun_direction"), ...xyz_to_arr(params.sun_direction));
        gl.uniform1f(loc.find("u_sun_strength"), params.sun_strength);
        gl.uniform1f(loc.find("u_sky_strength"), params.sky_strength);
        gl.uniform1f(loc.find("u_lighting_amount"), params.lighting_amount);

        if (is_render_border) {
            gl.uniform1f(loc.find("u_border_thickness"), params.border_thickness);
            gl.uniform3f(loc.find("u_border_colour"), ...rgb_to_arr(params.border_colour));
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(params.clear_colour.r, params.clear_colour.g, params.clear_colour.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.mesh.index_data.length, gl.UNSIGNED_INT, 0);
    }
}

export { Render_Volume, Render_Volume_Params, Render_Volume_Colour_Schemes };