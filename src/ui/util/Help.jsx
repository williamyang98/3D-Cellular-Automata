import React from 'react';

export function Help(props) {
  return (
    <span className="" data-toggle="tooltip" data-placement="left" data-html={true} title={props.text}>
      <i className="fas fa-question-circle"></i>
    </span>
  )
}