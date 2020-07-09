import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RenderAdjustableValue } from '../util/AdjustableValueViews';
import { update_randomiser, select_randomiser } from '../actions';
import { Help } from '../util/Help';

export function RandomiserMenu() {
  const dispatch = useDispatch();
  let current_index = useSelector(state => state.randomiser.current_index);
  let entries = useSelector(state => state.randomiser.entries);

  function on_select_randomiser(event) {
    let index = event.target.value;
    dispatch(select_randomiser(index));
  }

  const randomiser_options = entries.map((e, i) => {
    return (<option value={i} key={i}>{e.type}</option>);
  });

  const card_body = (
    <div>
      <div className="row w-100">
        <div className="col-sm-5">
          <label className='mr-2'>Randomiser</label>
        </div>
        <div className="col-sm">
          <select className='custom-select custom-select-sm' value={current_index} onChange={on_select_randomiser}>
            {randomiser_options}
          </select>
        </div>
        <div className="col-sm-1 text-right"><Help text={"Type of randomiser to use"}></Help></div>
      </div>
      <hr></hr>
      <SeedCrystalEditor></SeedCrystalEditor>
    </div>
  );

  return (
    <div className="card shadow mb-2">
      <a href="#collapseRandomiserMenu" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseRandomiserMenu">
        <h6 className="m-0 font-weight-bold text-primary">Randomiser</h6>
      </a>
      <div className="collapse show" id="collapseRandomiserMenu">
        <div className="card-body">
          {card_body}
        </div>
      </div>
    </div>
  );
}

export function SeedCrystalEditor() {
  const dispatch = useDispatch();
  let params = useSelector(state => state.randomiser.current_randomiser.params);

  function change_param(name, value) {
    dispatch(update_randomiser(name, value));
  }

  let param_options = Object
    .entries(params)
    .map(([name, param], index) => {
      return RenderAdjustableValue(param, index, name, value => {
        change_param(name, value);
      })
    });

  return (
    <form>
      {param_options}
    </form>
  );
}