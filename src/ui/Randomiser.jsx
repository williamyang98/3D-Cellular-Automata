import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RenderAdjustableValue } from './AdjustableValueViews';

export function RandomiserMenu() {
  const dispatch = useDispatch();
  let selected_index = useSelector(state => state.randomiser.selected_index);
  let entries = useSelector(state => state.randomiser.entries);

  function select_randomiser(event) {
    let index = event.target.value;
    dispatch({type: 'randomiser.select', value: index});
  }

  const randomiser_options = entries.map((e, i) => {
    return (<option value={i} key={i}>{e.name}</option>);
  })

  return (
    <div>
      <form>
        <label>Randomiser: </label>
        <select value={selected_index} onChange={select_randomiser}>
          {randomiser_options}
        </select>
      </form>
      <SeedCrystalEditor></SeedCrystalEditor>
    </div>
  );
}

export function SeedCrystalEditor() {
  const dispatch = useDispatch();
  let params = useSelector(state => state.randomiser.selected_randomiser.params);

  function change_param(name, value) {
    let new_params = {};
    new_params[name] = Number(value);
    dispatch({
      type: 'randomiser.update', 
      value: new_params
    });
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