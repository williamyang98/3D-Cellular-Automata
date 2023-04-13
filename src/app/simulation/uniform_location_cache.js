class Uniform_Location_Cache {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.cache = {};
    }

    find = (key) => {
        if (key in this.cache) {
            return this.cache[key];
        }
        let loc = this.gl.getUniformLocation(this.program, key);
        this.cache[key] = loc;
        return loc;
    }
}

export { Uniform_Location_Cache };