import { useRecoilValue } from 'recoil';

let Statistics = ({ simulation, recoil_state }) => {
  let stats = simulation.statistics;
  let unique_key = useRecoilValue(recoil_state.statistics);

  // NOTE: We use a unique_key that updates so it changes are rerendered
  return (
    <div className="card shadow mb-2">
      <a href="#collapseStatistics" className="card-header d-block" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseGraphicsMenu">
        <h6 className="m-0 font-weight-bold text-primary">Statistics</h6>
      </a>
      <div className="collapse show" id="collapseStatistics">
        <div className="card-body" key={unique_key}>
          <div className="row w-100">
            <div className="col-sm-6"><label>Total steps</label></div>
            <div className="col-sm">{stats.total_steps}</div>
          </div>
          <div className="row w-100">
            <div className="col-sm-6"><label>Frame time</label></div>
            <div className="col-sm">{stats.ms_frame_time.toFixed(0)} ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Statistics };