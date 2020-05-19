export class UniformMat4f {
    constructor(gl, data) {
        this.gl = gl;
        this.data = data;
    }

    apply(location) {
       this.gl.uniformMatrix4fv(location, false, this.data);
    }
}

export class UniformVec3f {
    constructor(gl, data) {
        this.gl = gl;
        this.data = data;
    }

    apply(location) {
        this.gl.uniform3f(location, this.data[0], this.data[1], this.data[2]);
    }
}

export class UniformVec4f {
    constructor(gl, data) {
        this.gl = gl;
        this.data = data;
    }

    apply(location) {
        this.gl.uniform4f(location, this.data[0], this.data[1], this.data[2], this.data[3]);
    }
}

export class Uniform {
    constructor(callback) {
        this.callback = callback;
    }

    apply(location) {
        this.callback(location);
    }
}