export class Renderer {
    constructor(gl) {
        this.gl = gl;
        this.clear_colour = new Float32Array([1, 1, 1, 1]);
    }

    clear() {
        let gl = this.gl;
        gl.clearColor(...this.clear_colour);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    draw(vertex_array, index_buffer, shader) {
        let gl = this.gl;

        shader.bind();
        vertex_array.bind();
        index_buffer.bind();

        gl.drawElements(gl.TRIANGLES, index_buffer.count, gl.UNSIGNED_INT, 0);
    }
}