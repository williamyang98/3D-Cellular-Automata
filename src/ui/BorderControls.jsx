import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RenderAdjustableValue } from './AdjustableValueViews';

export function BorderControls() {
  const dispatch = useDispatch();
  const show_border = useSelector(state => state.app.show_border);
  const show_render = useSelector(state => state.app.show_render);
  // force redux to acknowledge when this is changed
  const is_show_border = useSelector(state => state.app.show_border.value);
  const is_show_render = useSelector(state => state.app.show_render.value);

  return (
    <div>
      {RenderAdjustableValue(show_border, 0, 'Show Border', value => {
        dispatch({type: 'app.show_border', value: value});
      })}
      {RenderAdjustableValue(show_render, 1, 'Show Render', value => {
        dispatch({type: 'app.show_render', value: value});
      })}
    </div>
  )
}