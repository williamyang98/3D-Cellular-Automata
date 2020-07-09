import { mat4, vec3 } from 'gl-matrix';

export class Camera {
  constructor(size) {
    this.size = size;

    this.fov = 50;
    this.aspect_ratio = 1;
    this.view_position = vec3.fromValues(0, 0, 0);
    this.look_position = vec3.create();
    this.target = vec3.fromValues(0, 0, 0);
    this.model_translation = vec3.create();

    this.model = mat4.create();
    this.view = mat4.create();
    this.projection = mat4.create();

    this.on_size_change(this.size.value);
    this.size.listen(size => this.on_size_change(size.value));

    this.update();
  }

  on_size_change(size) {
    this.model_translation = vec3.create();
    vec3.scale(this.model_translation, size, -0.5);

    // zoom along minimum axis
    // zoom by maximum axis
    let distance = Math.max(...size);
    let min_index = argmin([...size]); 

    this.view_position = vec3.create();
    this.view_position[min_index] = distance*1.5;
    // glitchy around y axis due to euler angle rotation, so add offset
    if (min_index === 1) {
      this.view_position[2] = 1;
    }
  }

  update() {

    mat4.identity(this.model);
    mat4.translate(this.model, this.model, this.model_translation);
    mat4.scale(this.model, this.model, [1, 1, 1]); 

    mat4.lookAt(this.view, this.view_position, this.target, [0, 1, 0]);

    // mat4.perspectiveFromFieldOfView(this.projection, fov, 0.01, 1000);
    mat4.perspective(this.projection, this.fov * Math.PI / 180, this.aspect_ratio, 0.01, 10000);
  }

  rotate(dx, dy) {
    // vec3.rotateX(this.pos, this.pos, this.look_position, -dy);
    // vec3.rotateY(this.pos, this.pos, this.look_position, dx);

    let rotation = mat4.create();
    mat4.rotateY(rotation, rotation, dx);

    let xz_plane_direction = vec3.create();
    vec3.sub(xz_plane_direction, this.look_position, this.view_position);
    xz_plane_direction[1] = this.look_position[1];
    vec3.rotateY(xz_plane_direction, xz_plane_direction, this.look_position, Math.PI/2.0);

    mat4.rotate(rotation, rotation, -dy, xz_plane_direction);

    // mat4.rotateX(rotation, rotation, -dy);
    vec3.transformMat4(this.view_position, this.view_position, rotation);
  }

  zoom(delta) {
    let diff = vec3.create();
    vec3.sub(diff, this.view_position, this.look_position);
    vec3.scale(diff, diff, 1.0+delta);

    vec3.add(this.view_position, this.look_position, diff);
  }
}


function argmin(list) {
  let min_i = 0;
  let min_val = list[0];
  for (let i = 1; i < list.length; i++) {
    let val = list[i];
    if (val < min_val) {
      min_val = val;
      min_i = i;
    }
  } 
  return min_i;
}

