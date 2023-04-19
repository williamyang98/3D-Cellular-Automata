import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Main_View } from './Main_View';
import { Simulation_Controls } from './Simulation_Controls';
import { Graphics_Menu } from './Graphics_Menu';
import { Randomiser_List_View } from './Randomiser_List';
import { Statistics } from './Statistics';
import { Entries_List } from './entries/Entries_List';

let App = ({ app, recoil_state }) => {
  let is_fullscreen = useRecoilValue(recoil_state.is_fullscreen);
  let refresh_statistics = useSetRecoilState(recoil_state.statistics);
  let refresh_callback = () => refresh_statistics();

  app.simulation.listen_for_animation_frame(refresh_callback);

  const panel_style = { maxHeight:'100vh' };
  return (
    <div className="vw-100">
      <div className="row px-0 mx-0">
        <div className={`col-xl-3 overflow-auto ${is_fullscreen ? 'd-none': ''}`} style={panel_style}>
          <Simulation_Controls simulation={app.simulation}></Simulation_Controls>
          <Graphics_Menu simulation={app.simulation}></Graphics_Menu>
          <Randomiser_List_View randomiser_list={app.randomiser_list} recoil_state={recoil_state}></Randomiser_List_View>
          <Statistics simulation={app.simulation} recoil_state={recoil_state}></Statistics>
        </div>
        <div className="col-xl vh-100 mx-0 px-0">
          <Main_View simulation={app.simulation} recoil_state={recoil_state}></Main_View>
        </div>
        <div className={`col-xl-3 overflow-auto ${is_fullscreen ? 'd-none' : ''}`} style={panel_style}>
          <Entries_List app={app} recoil_state={recoil_state}></Entries_List>
        </div>
      </div>
    </div>
  );
}

export { App };