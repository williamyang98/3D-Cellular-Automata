export class IndexBuffer {
    constructor(gl, data) {
        this.gl = gl;

        this.buffer = gl.createBuffer();
        this.count = data.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW); // gluint is 4 bytes
    }

    bind() {
        let gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}