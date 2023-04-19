import { useState } from 'react';

import { Editor_Layout } from './Editor_Layout';
import { Slider } from '../widgets/Slider';

// NOTE: Custom hook needs the format useCamelCase
let useSliderLabel = (default_value, name, decimal_points) => {
  let create_editor_label = (value) => `${name}: ${value.toFixed(decimal_points)}`;
  let [editor_label, _set_editor_label] = useState(create_editor_label(default_value));
  let set_editor_label = (value) => _set_editor_label(create_editor_label(value));
  return [editor_label, set_editor_label];
}

const DEFAULT_DECIMAL_POINTS = 2;

// NOTE: This wrapper exists since we need to create a custom label
let Editor_Slider = ({ object, object_key, min, max, step, label, decimal_points }) => {
  label = (label !== undefined) ? label : object_key;
  decimal_points = (decimal_points !== undefined) ? decimal_points : DEFAULT_DECIMAL_POINTS;

  let [editor_label, set_editor_label] = useSliderLabel(object[object_key], label, decimal_points);

  return (
    <Editor_Layout label={editor_label}>
      <Slider object={object} object_key={object_key} min={min} max={max} step={step} external_on_change={set_editor_label}></Slider>
    </Editor_Layout>
  )
}

export { Editor_Slider };