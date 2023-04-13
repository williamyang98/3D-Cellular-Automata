import { MouseController } from "./MouseController.js";
import { TouchScreenController } from "./TouchScreenController.js";

class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.mouse_controller = new MouseController();
        this.touch_controller = new TouchScreenController();
    }

    bind_to_element = (canvas) => {
        this.mouse_controller.bind_to_element(canvas);
        this.touch_controller.bind_to_element(canvas);
        this.mouse_controller.ev_rotate.add((dx,dy) => this.camera.rotate(dx,dy));
        this.touch_controller.ev_rotate.add((dx,dy) => this.camera.rotate(dx,dy));
        this.mouse_controller.ev_zoom.add((zoom) => this.camera.zoom(zoom));
        this.touch_controller.ev_zoom.add((zoom) => this.camera.zoom(zoom));
    }
}

export { CameraController };