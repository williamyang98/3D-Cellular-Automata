import { useRecoilState, useSetRecoilState } from 'recoil';
import { Copy_Button } from './Copy_Button';

let System_Entry_View = ({ app, recoil_state, entry }) => {
  let refresh_randomiser_list = useSetRecoilState(recoil_state.randomiser_list);
  let [current_entry, set_current_entry] = useRecoilState(recoil_state.current_entry);
  const is_selected = (entry === current_entry);

  let on_select = () => {
    app.select_entry(entry);
    set_current_entry(entry);
    // NOTE: When we select an entry the randomiser presets are applied
    refresh_randomiser_list();
  }

  // NOTE: Bootstrap adds rounded corners to first and last items in list
  let override_styles = { borderRadius: '0' };
  return (
    <li className={`list-group-item ${is_selected ? 'active' : ''}`} style={override_styles}>
      <div onClick={(ev) => on_select()} style={{cursor:'pointer'}}>
        <div>Name: {entry.label}</div>
        <div className="d-flex flex-row">
          <div>Rule: {entry.string}</div>
          <div className="ml-auto">
            <Copy_Button string={entry.string} tooltip={entry.label}></Copy_Button>
          </div>
        </div>
      </div>
    </li>
  );
}

let System_Entries_List = ({ app, recoil_state }) => {
  let entries = app.system_entries;
  return (
    <ul className="list-group">
      {
        entries.map((entry, index) => {
          return <System_Entry_View key={index} app={app} recoil_state={recoil_state} entry={entry}></System_Entry_View>;
        })
      }
    </ul>
  );
}

export { System_Entries_List };