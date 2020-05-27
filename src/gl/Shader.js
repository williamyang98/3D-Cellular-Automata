export class Shader {
  constructor(gl, vertex_shader_src, fragment_shader_src) {
    this.gl = gl;
    this.create_shader_program(vertex_shader_src, fragment_shader_src);
    this.uniforms = []; 
    this.locations = [];
  }

  create_shader_program(vertex_shader_src, fragment_shader_src) {
    [this.vertex_shader, this.fragment_shader, this.program] = create_program(this.gl, vertex_shader_src, fragment_shader_src); 
  }

  // add to list of uniforms permanently binded to shader
  add_uniform(name, uniform) {
    let gl = this.gl;
    let location = gl.getUniformLocation(this.program, name);
    if (location === null) {
      // console.warn(`Couldn't find location of uniform ${name}`);
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
      if (location === null) {
        continue;
      }
      uniform.apply(location);
    }
  }
}

function create_program(gl, vertex_shader_src, fragment_shader_src) {
  const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, vertex_shader_src);
  gl.compileShader(vertex_shader);
  if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertex_shader));
    console.error(prepend_line_numbers(vertex_shader_src));
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
    console.error(prepend_line_numbers(fragment_shader_src));
    throw new Error('Unable to construct shader program');
  }

  return [vertex_shader, fragment_shader, program];
}

function prepend_line_numbers(src) {
  let lines = src.split('\n').map((v, i) => `${i+1}\t| ${v}`);
  let out = lines.join('\n');
  return out;
}