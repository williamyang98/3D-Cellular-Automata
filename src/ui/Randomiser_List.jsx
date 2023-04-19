import { Dropdown } from './widgets/Dropdown';
import { Editor_Slider } from './editor/Editor_Slider';
import { Editor_Layout } from './editor/Editor_Layout';

import { Randomiser_List, Randomiser_List_Types } from '../app/randomisers/randomiser_list.js';
import { Randomiser_Visitor } from '../app/randomisers/randomisers.js';
import { useRecoilState } from 'recoil';

class Render_Randomiser extends Randomiser_Visitor {
  constructor() {
    super();
  }

  /** @param {Randomiser_Radius_Absolute} randomiser */
  visit_radius_absolute = ({ randomiser }) => { 
    return (
      <div>
        <Editor_Slider object={randomiser} object_key={"density"} min={0} max={1} step={0.01}></Editor_Slider>
        <Editor_Slider object={randomiser} object_key={"radius"} min={1} max={128} step={1}></Editor_Slider>
      </div>
    );
  }

  /** @param {Randomiser_Radius_Relative} randomiser */
  visit_radius_relative = ({ randomiser }) => { 
    return (
      <div>
        <Editor_Slider object={randomiser} object_key={"density"} min={0} max={1} step={0.01}></Editor_Slider>
        <Editor_Slider object={randomiser} object_key={"radius"} min={0} max={1} step={0.01}></Editor_Slider>
      </div>
    );
  }
}

const render_randomiser_visitor = new Render_Randomiser();

let Randomiser_View = ({ randomiser }) => {
  return randomiser.accept_visitor(render_randomiser_visitor);
}

/**
 * @param {Randomiser_List} randomiser_list 
 * @param {Recoil_State} recoil_state
 * @returns 
 */
let Randomiser_List_View = ({ randomiser_list, recoil_state }) => {
  let [unique_key, refresh_list] = useRecoilState(recoil_state.randomiser_list);

  const randomiser_options = [
    { name: 'Radius Absolute', value: Randomiser_List_Types.RADIUS_ABSOLUTE },
    { name: 'Radius Relative', value: Randomiser_List_Types.RADIUS_RELATIVE },
  ];

  let randomiser = randomiser_list.get_randomiser();

  let on_change = (new_randomiser_type) => {
    new_randomiser_type = Number(new_randomiser_type);
    randomiser_list.selected_type = new_randomiser_type;
    refresh_list();
  }

  // NOTE: We use a unique_key that updates so it changes are rerendered
  return (
    <div className="card shadow mb-2">
      <a href="#collapseRandomiserList" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseGraphicsMenu">
        <h6 className="m-0 font-weight-bold text-primary">Randomiser</h6>
      </a>
      <div className="collapse show" id="collapseRandomiserList">
        <div className="card-body" key={unique_key}>
          <Editor_Layout label="randomiser_type">
            <Dropdown 
              object={randomiser_list} object_key={"selected_type"} 
              options={randomiser_options}
              external_on_change={on_change}
            ></Dropdown>
          </Editor_Layout>
          <Randomiser_View randomiser={randomiser}></Randomiser_View>
        </div>
      </div>
    </div>
  );
}

export { Randomiser_List_View };