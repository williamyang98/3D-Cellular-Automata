// 1D array containing n elements
// can contain arbitary data
export class VertexBufferObject {
  constructor(gl, data, usage) {
    this.gl = gl;

    this.data = data;

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }

  bind() {
    let gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  }
}

export class VertexArrayObject {
  constructor(gl) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    this.integer_types = new Set([gl.INT, gl.UNSIGNED_INT]);
  }

  add_vertex_buffer(vbo, layout) {
    let gl = this.gl;

    this.bind();
    vbo.bind();

    let offset = 0;
    for (let attribute of layout.attributes) {
      gl.enableVertexAttribArray(attribute.index);
      if (this.integer_types.has(attribute.type)) {
        gl.vertexAttribIPointer(attribute.index, attribute.count, attribute.type, attribute.is_normalised, layout.stride, offset);
      } else {
        gl.vertexAttribPointer(attribute.index, attribute.count, attribute.type, attribute.is_normalised, layout.stride, offset);
      }
      offset += attribute.count * attribute.size;
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
    this.attributes = [];
  }

  push_attribute(index, count, type, is_normalised) {
    let size = this.sizeof(type);
    let attribute = new VertexBufferAttribute(index, count, type, is_normalised, size);
    this.attributes.push(attribute);
    this.stride += count * size;
  }

  slice(start, end) {
    let layout = new VertexBufferLayout();
    layout.stride = this.stride;
    layout.attributes = this.attributes.slice(start, end);
    return layout;
  }

  sizeof(type) {
    let gl = this.gl;

    switch (type) {
    case gl.FLOAT: return 4;
    case gl.UNSIGNED_INT: return 4;
    case gl.INT: return 4;
    default: throw new Error(`Unknown element type: ${type}`);
    }
  }
}

// each element in the shader has an attribute index
// layout(location = <attribute_index>) in vec3 position;
// layout(locaiton = <attribute_index>) in vec3 normal;
class VertexBufferAttribute {
  constructor(index, count, type, is_normalised, size) {
    this.index = index;
    this.count = count;
    this.type = type;
    this.is_normalised = is_normalised;
    this.size = size;
  }

  
}