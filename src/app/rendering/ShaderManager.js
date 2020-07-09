import { Dropdown } from '../../ui/util/AdjustableValues';
import { VolumeRenderer } from './renderers/VolumeRenderer';
import { PointCloudRenderer } from './renderers/PointCloudRenderer';
import { VoxelRenderer } from './renderers/VoxelRenderer';
import { vertex_shader_src } from './shaders/vertex_shader';

export class ShaderManager {
  constructor(gl, size, camera) {
    this.gl = gl;
    this.size = size;
    this.camera = camera;

    let props = {
      size: this.size,
      camera: this.camera
    };

    this.global_params = {
      colouring: new Dropdown(Object.keys(vertex_shader_src), 0, 'Method of colouring each cell'),
    };

    this.renderers = {
      volume: new VolumeRenderer(gl, props, this.global_params),
      point: new PointCloudRenderer(gl, props, this.global_params),
      voxel: new VoxelRenderer(gl, props, this.global_params),
    };

    {
      const tooltip = (
        "Method of rendering the grid\n"+
        "Volume: Fastest but low quality (Uses raycasting)\n"+
        "Point: Represents each cell as a floating quad\n"+
        "Voxel: Slowest but highest quality (Like Minecraft)\n"
      );
      this.renderer_type = new Dropdown(Object.keys(this.renderers), 0, tooltip);
    }
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
