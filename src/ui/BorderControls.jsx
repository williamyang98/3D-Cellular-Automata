import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RenderAdjustableValue } from './AdjustableValueViews';

export function BorderControls() {
  const dispatch = useDispatch();
  const show_border = useSelector(state => state.app.show_border);
  // force redux to acknowledge when this is changed
  const is_show_border = useSelector(state => state.app.show_border.value);

  function valueChange(value) {
    dispatch({type: 'app.show_border', value: value});
  }

  return RenderAdjustableValue(show_border, 0, 'Show Border', valueChange);
}