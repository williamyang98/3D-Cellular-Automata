import { vec3 } from 'gl-matrix';

import { Dropdown } from '../ui/AdjustableValues';
import { VolumeRenderer } from './renderers/VolumeRenderer';
import { PointCloudRenderer } from './renderers/PointCloudRenderer';
import { VoxelRenderer } from './renderers/VoxelRenderer';

export class ShaderManager {
  constructor(gl, camera) {
    this.gl = gl;
    this.size = vec3.create();
    this.camera = camera;

    let props = {
      size: this.size,
      camera: this.camera
    };

    this.renderers = {
      volume: new VolumeRenderer(gl, props),
      point: new PointCloudRenderer(gl, props),
      voxel: new VoxelRenderer(gl, props),
    };

    this.renderer_type = new Dropdown(Object.keys(this.renderers));
  }

  set_size(size) {
    this.size = size;
    Object.values(this.renderers).forEach(renderer => {
      renderer.update_props({size: size});
    })
  }

  get current_renderer() {
    let key = this.renderer_type.current_option;
    return this.renderers[key];
  }

  select_renderer(index) {
    this.renderer_type.value = index;
  }

  get params() {
    return this.current_renderer.params;
  }

  update_params(params) {
    this.current_renderer.update_params(params);
  }

  bind() {
    this.current_renderer.bind();
  }

  on_render() {
    this.current_renderer.on_render();
  }


}
