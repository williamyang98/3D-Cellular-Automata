import { mat4, vec3, vec2 } from 'gl-matrix';

export class Camera {
  constructor() {
    this.fov = 50;
    this.aspect_ratio = 1;
    this.pos = vec3.fromValues(0, 0, 0);
    this.target = vec3.fromValues(0, 0, 0);
    this.model_rotation = vec2.fromValues(0, 0);
    this.model_translation = vec3.create();

    this.model = mat4.create();
    this.view = mat4.create();
    this.projection = mat4.create();

    this.update();
  }

  update() {

    mat4.identity(this.model);
    // mat4.rotateX(this.model, this.model, this.model_rotation[1]);
    // mat4.rotateY(this.model, this.model, -this.model_rotation[0]);
    mat4.translate(this.model, this.model, this.model_translation);
    mat4.scale(this.model, this.model, [1, 1, 1]); 

    mat4.lookAt(this.view, this.pos, this.target, [0, 1, 0]);
    mat4.rotateX(this.view, this.view, this.model_rotation[1]);
    mat4.rotateY(this.view, this.view, -this.model_rotation[0]);

    // mat4.perspectiveFromFieldOfView(this.projection, fov, 0.01, 1000);
    mat4.perspective(this.projection, this.fov * Math.PI / 180, this.aspect_ratio, 0.01, 1000);
  }


}