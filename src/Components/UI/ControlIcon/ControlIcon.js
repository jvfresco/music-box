import React from 'react';
import playIcon from '../../../assets/play.svg';
import pauseIcon from '../../../assets/pause.svg';
import './ControlIcon.scss';

const controlIcon = (props) =>{

  let icon = (<img className={props.class} src={playIcon} alt='Play song' onClick={() => props.togglePlayPause(props.track)}></img>);

  if (props.thisTrackIsPlaying){
    icon = (<img className={props.class} src={pauseIcon} alt='Pause song' onClick={() => props.togglePlayPause(props.track)}></img>);
  }

  return (
    icon
  )
}

export default controlIcon;

