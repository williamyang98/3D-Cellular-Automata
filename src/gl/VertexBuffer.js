// 1D array containing n elements
// can contain arbitary data
export class VertexBuffer {
  constructor(gl, data, usage) {
    this.gl = gl;

    this.data = data;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }

  bind() {
    let gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  }
}

export class VertexBufferArray {
  constructor(gl) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
  }

  // vertex buffer = 1D array containing n elements
  // layout = list of layout types (n instances of vec3f, m instance of vec4f, etc)
  add_vertex_buffer(vertex_buffer, vertex_buffer_layout) {
    let gl = this.gl;

    this.bind();
    vertex_buffer.bind();
    let elements = vertex_buffer_layout.elements;
    let offset = 0;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, element.count, element.type, element.is_normalised, vertex_buffer_layout.stride, offset);
      offset += element.count * element.size;
    }
  }

  bind() {
    let gl = this.gl;
    gl.bindVertexArray(this.vao);
  }
}

export class VertexBufferLayout {
  constructor(gl) {
    this.gl = gl;
    this.stride = 0;
    this.elements = [];
  }

  add_element(count, type, is_normalised) {
    let element = new VertexBufferElement(this.gl, count, type, is_normalised);
    this.elements.push(element);
    this.stride += element.count * element.size;
  }
}

class VertexBufferElement {
  constructor(gl, count, type, is_normalised) {
    this.gl = gl;

    this.count = count;
    this.type = type;
    this.is_normalised = is_normalised;
    this.size = this.sizeof(this.type);
  }

  sizeof(type) {
    let gl = this.gl;

    switch (type) {
    case gl.FLOAT: return 4;
    default: throw new Error(`Unknown element type: ${type}$`);
    }
  }
}