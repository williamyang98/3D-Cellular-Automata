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

  const stats = (
    <div>
      <div>Total Steps: {total_steps}</div>
      <div>Progress: {completed_blocks}/{total_blocks} ({progress.toFixed(2)}%)</div>
      <div>Frame Time (ms): {frame_time.toFixed(2)}</div>
    </div>
  );

  return (
    <div className="card shadow">
      <a href="#collapseStatsMenu" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseStatsMenu">
        <h6 className="m-0 font-weight-bold text-primary">Statistics</h6>
      </a>
      <div className="collapse show" id="collapseStatsMenu">
        <div className="card-body">
          {stats}
        </div>
      </div>
    </div>
  );
}