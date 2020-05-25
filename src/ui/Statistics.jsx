import React, { useState } from 'react';
import { vec3 } from 'gl-matrix';
import { useDispatch, useSelector } from 'react-redux';

export function Statistics() {
  const dispatch = useDispatch();
  const completed_blocks = useSelector(state => state.stats.completed_blocks);
  const total_blocks = useSelector(state => state.stats.total_blocks);
  const frame_time = useSelector(state => state.stats.frame_time);

  let progress = 0;
  if (total_blocks > 0) {
    progress = completed_blocks/total_blocks * 100;
  }

  return (
    <div>
      {/* <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: `${progress.toFixed(0)}%`}}></div>
      </div> */}
      <div>Progress: {completed_blocks}/{total_blocks} ({progress.toFixed(2)}%)</div>
      <div>Frame Time (ms): {frame_time.toFixed(2)}</div>
    </div>
  );
}