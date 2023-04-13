import { mat4, vec3 } from 'gl-matrix';

class Camera {
    constructor() {
        this.fov = 50;
        this.view_position = vec3.fromValues(-3.5, +2, +3.5);
        this.look_position = vec3.create();
        this.target = vec3.fromValues(0, 0, 0);
        this.model_translation = vec3.create(0, 0, 0);

        this.model = mat4.create();
        this.view = mat4.create();
        this.projection = mat4.create();
    }

    /**
     * Update the camera
     * @param {Vector2} viewport 
     */
    update = (viewport) => {
        let aspect_ratio = viewport.x / viewport.y;

        mat4.identity(this.model);
        mat4.translate(this.model, this.model, this.model_translation);
        mat4.scale(this.model, this.model, [1, 1, 1]); 
        mat4.lookAt(this.view, this.view_position, this.target, [0, 1, 0]);
        mat4.perspective(this.projection, this.fov * Math.PI/180, aspect_ratio, 0.0001, 10000);
    }

    /**
     * Rotates camera based on dx/dy movements to the screen
     * @param {Number} dx 
     * @param {Number} dy 
     */
    rotate = (dx, dy) => {
        let rotation = mat4.create();
        mat4.rotateY(rotation, rotation, dx);

        let xz_plane_direction = vec3.create();
        vec3.sub(xz_plane_direction, this.look_position, this.view_position);
        xz_plane_direction[1] = this.look_position[1];
        vec3.rotateY(xz_plane_direction, xz_plane_direction, this.look_position, Math.PI/2.0);
        mat4.rotate(rotation, rotation, -dy, xz_plane_direction);
        vec3.transformMat4(this.view_position, this.view_position, rotation);
    }

    zoom = (delta) => {
        let diff = vec3.create();
        vec3.sub(diff, this.view_position, this.look_position);
        vec3.scale(diff, diff, 1.0+delta);
        vec3.add(this.view_position, this.look_position, diff);
    }
}

export { Camera };