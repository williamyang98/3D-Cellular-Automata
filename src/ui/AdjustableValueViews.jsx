import React from 'react';

export function RenderAdjustableValue(adjustable, key, name, valueChanged) {
  let type = adjustable.type;
  switch (type) {
    case 'slider':
      return SliderView(adjustable, key, name, valueChanged);
    case 'toggle':
      return ToggleView(adjustable, key, name, valueChanged);
  }
}

function SliderView(slider, key, name, valueChanged) {
  let step = (slider.max-slider.min)/100.0;
  return (
    <div className='form-inline' key={key}>
      <label>{name}: {slider.value.toFixed(2)}</label>
      <input 
        className='form-control-range' type='range' 
        min={slider.min} max={slider.max} value={slider.value} step={step}
        onChange={ev => valueChanged(Number(ev.target.value))}></input> 
    </div>
 );
}

function ToggleView(toggle, key, name, valueChanged) {
  return (
    <div className='form-check' key={key}>
      <input 
        type='checkbox' className='form-check-input'
        checked={toggle.value}
        onChange={ev => valueChanged(ev.target.checked)}></input>
      <label className='form-check-label'>{name}</label>
    </div>
  );
}