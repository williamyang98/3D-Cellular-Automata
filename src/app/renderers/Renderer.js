import { vec3 } from "gl-matrix";
import { UniformMat4f, UniformVec3f, Uniform } from "../../gl/Uniform";

export class Renderer {
    constructor(gl, props, params) {
        this.gl = gl;
        this.props = {
            size: vec3.create(),
            ...props};
        this.params = params;
    }

    // arbitary values
    update_props(props) {
        this.props = {...this.props, ...props};
    } 

    add_params(params) {
        this.params = {...this.params, ...params};
    }

    // adjustable values
    update_params(params) {
        for (let key in params) {
            let param = this.params[key];
            param.value = params[key];
        }
        this.params = {...this.params};
    }

    // base uniforms
    add_uniforms(shader) {
        let gl = this.gl;
        // camera data
        shader.add_uniform("uModel", new UniformMat4f(gl, this.props.camera.model));
        shader.add_uniform("uView", new UniformMat4f(gl, this.props.camera.view));
        shader.add_uniform("uProjection", new UniformMat4f(gl, this.props.camera.projection));
        shader.add_uniform("uViewPosition", new UniformVec3f(gl, this.props.camera.view_position));
        shader.add_uniform("uGridSize", new Uniform(loc => gl.uniform3f(loc, this.props.size[0], this.props.size[1], this.props.size[2])));
        // default texture slots
        shader.add_uniform("uStateTexture",         new Uniform(loc => gl.uniform1i(loc, 0)));
        shader.add_uniform("uStateColourTexture",   new Uniform(loc => gl.uniform1i(loc, 1)));
        shader.add_uniform("uRadiusColourTexture",  new Uniform(loc => gl.uniform1i(loc, 2)));
    }

    bind() {

    }

    on_render() {

    }
}