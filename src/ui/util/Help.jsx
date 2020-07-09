import React from 'react';
import "./Help.css";

export function Help(props) {
  return (
    <span className="help-icon" data-toggle="tooltip" data-placement="left" data-html={true} title={props.text}>
      <i className="fas fa-question-circle"></i>
    </span>
  )
}