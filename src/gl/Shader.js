export class Shader {
  constructor(gl, vertex_shader_src, fragment_shader_src) {
    this.gl = gl;
    this.create_shader_program(vertex_shader_src, fragment_shader_src);
    this.uniforms = []; 
    this.locations = [];
  }

  create_shader_program(vertex_shader_src, fragment_shader_src) {
    let gl = this.gl;

    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vertex_shader_src);
    gl.compileShader(vertex_shader);
    if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertex_shader));
      throw new Error('Unable to compile vertex shader');
    }

    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, fragment_shader_src);
    gl.compileShader(fragment_shader);
    if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragment_shader));
      throw new Error('Unable to compile fragment shader');
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      throw new Error('Unable to construct shader program');
    }

    this.vertex_shader = vertex_shader;
    this.fragment_shader = fragment_shader;
    this.program = program;
  }

  // add to list of uniforms permanently binded to shader
  add_uniform(name, uniform) {
    let gl = this.gl;
    let location = gl.getUniformLocation(this.program, name);
    if (location === null) {
      console.error(`Couldn't find location of uniform ${name}`);
      // throw new Error(`Couldn't find location of uniform ${name}`);
    } 
    this.uniforms.push(uniform);
    this.locations.push(location);
  }

  // dynamic sub in uniform
  // apply_uniform(name, uniform) {
  //   let gl = this.gl;
  //   this.bind();
  //   let location = gl.getUniformLocation(this.program, name);
  //   uniform.apply(location);
  // }

  bind() {
    let gl = this.gl;
    gl.useProgram(this.program);
    for (let i = 0; i < this.uniforms.length; i++) {
      let uniform = this.uniforms[i];
      let location = this.locations[i];
      uniform.apply(location);
    }
  }
}