let prepend_line_numbers = (src) => {
    let lines = src.split('\n').map((v, i) => `${i+1}\t| ${v}`);
    let out = lines.join('\n');
    return out;
}

let validate_shader = (gl, shader, src) => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        console.error(prepend_line_numbers(src));
        return false;
    }
    return true;
}

let validate_program = (gl, program) => {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return false;
    }
    return true;
}

let compile_program = (gl, vertex_shader_src, fragment_shader_src) => {
    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vertex_shader_src);
    gl.compileShader(vertex_shader);
    if (!validate_shader(gl, vertex_shader, vertex_shader_src)) {
        throw new Error('Unable to compile vertex shader');
    }

    let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, fragment_shader_src);
    gl.compileShader(fragment_shader);
    if (!validate_shader(gl, fragment_shader, fragment_shader_src)) {
        throw new Error('Unable to compile fragment shader');
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if (!validate_program(gl, program)) {
        throw new Error('Unable to compile program');
    }

    return program;
}

export { validate_shader, validate_program, compile_program };