import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RenderAdjustableValue } from '../util/AdjustableValueViews';

import { show_border, show_render, set_background_colour, set_border_colour } from '../actions';

export function BorderControls() {
  const dispatch = useDispatch();
  const border_checkbox = useSelector(state => state.app.show_border);
  const render_checkbox = useSelector(state => state.app.show_render);
  const background_colour = useSelector(state => state.app.background_colour);
  const border_colour = useSelector(state => state.app.border.colour);
  // force redux to acknowledge when this is changed
  let _ = useSelector(state => state.app.show_border.value);
  _ = useSelector(state => state.app.show_render.value);
  _ = useSelector(state => state.app.background_colour.value);
  _ = useSelector(state => state.app.border.colour.value);

  return (
    <div>
      {RenderAdjustableValue(border_checkbox, 0, 'Show Border', value => {
        dispatch(show_border(value));
      })}
      {RenderAdjustableValue(render_checkbox, 1, 'Show Render', value => {
        dispatch(show_render(value));
      })}
      {RenderAdjustableValue(background_colour, 2, 'Background Colour', value => {
        dispatch(set_background_colour(value));
      })}
      {RenderAdjustableValue(border_colour, 3, 'Border Colour', value => {
        dispatch(set_border_colour(value));
      })}
    </div>
  )
}