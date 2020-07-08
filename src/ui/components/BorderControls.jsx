import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RenderAdjustableValue } from '../util/AdjustableValueViews';

import { show_border, show_render } from '../actions';

export function BorderControls() {
  const dispatch = useDispatch();
  const border_checkbox = useSelector(state => state.app.show_border);
  const render_checkbox = useSelector(state => state.app.show_render);
  // force redux to acknowledge when this is changed
  const is_show_border = useSelector(state => state.app.show_border.value);
  const is_show_render = useSelector(state => state.app.show_render.value);

  return (
    <div>
      {RenderAdjustableValue(border_checkbox, 0, 'Show Border', value => {
        dispatch(show_border(value));
      })}
      {RenderAdjustableValue(render_checkbox, 1, 'Show Render', value => {
        dispatch(show_render(value));
      })}
    </div>
  )
}