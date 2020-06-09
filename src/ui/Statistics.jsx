import React from 'react';
import { useSelector } from 'react-redux';

export function Statistics() {
  const completed_blocks = useSelector(state => state.stats.data.completed_blocks);
  const total_blocks = useSelector(state => state.stats.data.total_blocks);
  const frame_time = useSelector(state => state.stats.data.frame_time);
  const total_steps = useSelector(state => state.stats.data.total_steps);
  const texture_data_update = useSelector(state => state.stats.data.texture_data_update);
  const texture_data_upload = useSelector(state => state.stats.data.texture_data_upload);
  const draw_time = useSelector(state => state.stats.data.draw_time);

  let progress = 0;
  if (total_blocks > 0) {
    progress = completed_blocks/total_blocks * 100;
  }

  const stats = (
    <div>
      <div className="row">
        <div className="col">
          <div>Total Steps: {total_steps}</div>
          <div>Frame Time (ms): {frame_time.toFixed(2)}</div>
          <div>Draw Time (ms): {draw_time.toFixed(2)}</div>
        </div>
        <div className="col">
          <div>Tex Update (ms): {texture_data_update.toFixed(2)}</div>
          <div>Tex Upload (ms): {texture_data_upload.toFixed(2)}</div>
        </div>
      </div>
      <div className="row">
        <div className="col">Progress: {completed_blocks}/{total_blocks} ({progress.toFixed(2)}%)</div>
      </div>
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