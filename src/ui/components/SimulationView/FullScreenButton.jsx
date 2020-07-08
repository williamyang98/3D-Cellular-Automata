import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function FullScreenButton() {
  const dispatch = useDispatch();
  const fullscreen = useSelector(state => state.gui.fullscreen);

  const font = !fullscreen ? 'arrows-alt' : 'compress-arrows-alt';

  function set_fullscreen(is_fullscreen) {
    const e = document.documentElement;
    const d = document;
    const request_fullscreen = e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen || e.msRequestFullscreen;
    const cancel_fullscreen = d.exitFullscreen || d.mozCancelFullScreen || d.webkitCancelFullScreen || d.msExitFullscreen;
    if (is_fullscreen) request_fullscreen.bind(e)();
    else               cancel_fullscreen.bind(d)();
  }

  const onClick = () => {
    let is_fullscreen = !fullscreen;
    set_fullscreen(is_fullscreen);
    dispatch({type:'gui.fullscreen', value: is_fullscreen});
  };

  return (
    <button className={`btn btn-secondary`} onClick={onClick}>
      <i className={`fas fa-${font} fa-sm`}></i>
    </button>
  );
}