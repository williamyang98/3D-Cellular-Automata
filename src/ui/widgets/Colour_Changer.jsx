import { Help } from './Help';
import { Colour_Picker } from './Colour_Picker';

let Colour_Changer = ({ rgb, label, help_text, external_on_change }) => {
  return (
    <div className="row w-100">
      <div className="col-sm-6">
        <label>{label}</label>
      </div>
      <div className="col-sm">
        <Colour_Picker rgb={rgb} external_on_change={external_on_change}></Colour_Picker>
      </div>
      {
        help_text && 
        <div className="col-sm-1 text-right">
          <Help text={help_text}></Help>
        </div>
      }
    </div>
  );
}

export { Colour_Changer };