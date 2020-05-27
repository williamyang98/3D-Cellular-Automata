import React from 'react';
import { useSelector } from 'react-redux';

export function Statistics() {
  const completed_blocks = useSelector(state => state.stats.data.completed_blocks);
  const total_blocks = useSelector(state => state.stats.data.total_blocks);
  const frame_time = useSelector(state => state.stats.data.frame_time);
  const total_steps = useSelector(state => state.stats.data.total_steps);

  let progress = 0;
  if (total_blocks > 0) {
    progress = completed_blocks/total_blocks * 100;
  }

  return (
    <div className='card'>
      <div className='card-header'>Statistics</div>
      <div className='card-body'>
        <div>Total Steps: {total_steps}</div>
        <div>Progress: {completed_blocks}/{total_blocks} ({progress.toFixed(2)}%)</div>
        <div>Frame Time (ms): {frame_time.toFixed(2)}</div>
      </div>
    </div>
  );
}