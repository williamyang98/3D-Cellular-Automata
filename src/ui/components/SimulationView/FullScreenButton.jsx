import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { set_fullscreen as action_fullscreen } from '../../actions';

export function FullScreenButton() {
  const dispatch = useDispatch();
  const fullscreen = useSelector(state => state.gui.fullscreen);

  const font = !fullscreen ? 'arrows-alt' : 'compress-arrows-alt';

  function set_fullscreen(is_fullscreen) {
    const e = document.documentElement;
    const d = document;
    const request_fullscreen = e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen || e.msRequestFullscreen;
    const cancel_fullscreen = d.exitFullscreen || d.mozCancelFullScreen || d.webkitCancelFullScreen || d.msExitFullscreen;
    const document_fullscreen = (d.fullscreenElement && d.fullscreenElement !== undefined) || d.mozFullscreen || d.webkitIsFullScreen; 
    if (!document_fullscreen) {
      request_fullscreen.bind(e)();
      dispatch(action_fullscreen(true));
    } else {
      cancel_fullscreen.bind(d)();
      dispatch(action_fullscreen(false));
    }
  }

  const onClick = () => {
    let is_fullscreen = !fullscreen;
    set_fullscreen(is_fullscreen);
  };

  return (
    <button className={`btn btn-secondary`} onClick={onClick}>
      <i className={`fas fa-${font} fa-sm`}></i>
    </button>
  );
}