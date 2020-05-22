export class Texture1D {
    constructor(gl, data, length) {
        this.gl = gl;
        this.data = data;
        this.length = length;
        this.texture = gl.createTexture();
         
        gl.bindTexture(gl.TEXTURE_1D, this.texture);
        // The R32F type works only with gl.RED and gl.FLOAT
        // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        gl.texParameteri(gl.TEXTURE_1D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_1D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_1D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, shape[0], shape[1], 0, gl.RED, gl.UNSIGNED_BYTE, this.data);
        gl.texImage1D(gl.TEXTURE_1D, 0, gl.RGBA8, length, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.data);
    }

    bind(slot=0) {
        let gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_1D, this.texture);
    }
}