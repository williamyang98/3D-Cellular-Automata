import { useState } from 'react';
import { System_Entries_List } from './System_Entries_List';
import { User_Entries_List_View } from './User_Entries_List_View';

let Entries_List = ({ app, recoil_state }) => {
  let [is_system_entries, set_is_system_entries] = useState(true);

  let controls_panel = (
    <div className="d-flex flex-row my-0 py-0">
      <div className="btn-group py-0 my-0">
        <button 
          className={`btn btn-sm ${is_system_entries ? 'btn-primary' : 'btn-outline-secondary'}`} 
          onClick={() => set_is_system_entries(true)}
        >System</button>
        <button 
          className={`btn btn-sm ${!is_system_entries ? 'btn-primary' : 'btn-outline-secondary'}`} 
          onClick={() => set_is_system_entries(false)}
        >User</button>
      </div>
    </div>
  );

  // NOTE: We use 'd-none' to hide the other list so we don't end up resetting the react state
  //       If we were to use conditional rendering, then when we are editing entries in the user entries list
  //       and then we switched back and from the system entries list, our edits would be reset
  return (
    <div className="card shadow h-100">
      <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Rules</h6>
        {controls_panel}
      </div>
      <div className="card-body h-100 p-0 overflow-auto">
        <div className={is_system_entries ? '' : 'd-none'}>
          <System_Entries_List app={app} recoil_state={recoil_state}></System_Entries_List>
        </div>
        <div className={!is_system_entries ? '' : 'd-none'}>
          <User_Entries_List_View app={app} recoil_state={recoil_state}></User_Entries_List_View>
        </div>
      </div>
    </div>
  );
}

export { Entries_List };