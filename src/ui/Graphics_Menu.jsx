import { Dropdown } from './widgets/Dropdown';
import { Slider } from './widgets/Slider';
import { Colour_Changer } from './widgets/Colour_Changer';
import { Toggle } from './widgets/Toggle';
import { Vector3D_Editor } from './widgets/Vector3D_Editor';

import { 
  Render_Volume_Colour_Schemes, 
  Render_Volume_Params 
} from '../app/simulation/render_volume.js';
import { Camera } from '../app/simulation/camera/Camera.js';

let Graphics_Menu = ({ simulation }) => {
  /** @property {Camera} */
  let camera = simulation.camera;
  /** @property {Render_Volume_Params} */
  let params = simulation.params.render_volume; 

  const colour_options = [
    { name: 'state',              value: Render_Volume_Colour_Schemes.STATE },
    { name: 'xyz',                value: Render_Volume_Colour_Schemes.XYZ },
    { name: 'layer',              value: Render_Volume_Colour_Schemes.LAYER },
    { name: 'radial',             value: Render_Volume_Colour_Schemes.RADIAL },
    { name: 'neighbour',          value: Render_Volume_Colour_Schemes.NEIGHBOUR },
    { name: 'neigbour and alive', value: Render_Volume_Colour_Schemes.NEIGHBOUR_AND_ALIVE },
  ];

  return (
    <div className="card shadow mb-2">
      <a href="#collapseGraphicsMenu" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseGraphicsMenu">
        <h6 className="m-0 font-weight-bold text-primary">Graphics</h6>
      </a>
      <div className="collapse show" id="collapseGraphicsMenu">
        <div className="card-body">
          <Dropdown object={params} object_key={"colour_scheme"} options={colour_options}></Dropdown>
          <hr></hr>
          <Slider object={camera} object_key={"fov"} min={10} max={120} step={10} decimal_points={0}></Slider>
          <Slider object={params} object_key={"occlusion_factor"} min={0} max={1} step={0.01}></Slider>
          <Slider object={params} object_key={"border_thickness"} min={0} max={1} step={0.01}></Slider>
          <Colour_Changer rgb={params.border_colour} label="border_colour"></Colour_Changer>
          <Colour_Changer rgb={params.clear_colour} label="clear_colour"></Colour_Changer>
          <hr></hr>
          <Colour_Changer rgb={params.sky_colour_top} label="sky_top"></Colour_Changer>
          <Colour_Changer rgb={params.sky_colour_bottom} label="sky_bottom"></Colour_Changer>
          <Colour_Changer rgb={params.sun_colour} label="sun_colour"></Colour_Changer>
          <Slider object={params} object_key={"sun_strength"} min={0} max={1} step={0.01}></Slider>
          <Slider object={params} object_key={"sky_strength"} min={0} max={1} step={0.01}></Slider>
          <Slider object={params} object_key={"lighting_amount"} min={0} max={1} step={0.01}></Slider>
          <Vector3D_Editor value={params.sun_direction} label="sun_direction"></Vector3D_Editor>
          <hr></hr>
          <Toggle object={simulation.action} object_key={"is_render"}></Toggle>
        </div>
      </div>
    </div>
  );
}

export { Graphics_Menu };