import React, { useRef, useEffect } from 'react';
import {connect} from 'react-redux';
import { toggle_play_pause } from '../../../store/actions/index';
import { millisToMinutesAndSeconds } from '../../utility';
import ControlIcon from '../../UI/ControlIcon/ControlIcon';
import { gsap } from 'gsap';
import './SongMedia.scss';

const SongMedia = props => {

const {isSelected, track, darkmode} = props;

    useEffect(()=>{
      if(isSelected){
        animationMouseEnterHandler();
      } else {
        animationMouseLeaveHandler();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isSelected]);

    //Effect to handle background color change when dark mode is toggled
    useEffect(() => {
      animationMouseEnterHandler();
      animationMouseLeaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[darkmode])

    const mediaControls = useRef();   
    const controlIcon = <ControlIcon class={!darkmode ? 'PlayIcon' : 'PlayIcon DarkMode'} togglePlayPause={props.onTogglePlayPause} thisTrackIsPlaying={props.isPlaying && isSelected} track={track} />;
 
    const animationMouseEnterHandler = () =>{
      if(!darkmode){
        gsap.to(mediaControls.current, {backgroundColor: "hsla(216, 10%, 90%, 1)", whiteSpace:"normal",  duration: 1});
      } else {
        gsap.to(mediaControls.current, {backgroundColor: "hsla(312, 44%, 14%, 1)", whiteSpace:"normal",  duration: 1});
      }
    }

    const animationMouseLeaveHandler = () =>{
      if(!isSelected){
        if (!darkmode){
          gsap.to(mediaControls.current, {backgroundColor: "hsla(216, 10%, 90%, 0.6)", whiteSpace:"nowrap", duration: 1});
        } else {
          gsap.to(mediaControls.current, {backgroundColor: "hsla(312, 44%, 14%, 0.75)", whiteSpace:"nowrap", duration: 1});
        }
      }
    } 



    return (<div ref={mediaControls} className={!darkmode ? 'SongMedia' : 'SongMedia DarkMode'} onMouseEnter={animationMouseEnterHandler} onMouseLeave={animationMouseLeaveHandler}>
              
              <div className={'SongTitleMedia'}>{track.title}</div>
              <div className={'SongArtistMedia'}>{track.user.username}</div>
              <div className={'SongControls'}>
                <div className={'SongPlay'}>{controlIcon}</div>
                <div className={'SongDuration'}>{millisToMinutesAndSeconds(track.duration)}</div>
                <div className={'SongGenre'}>{track.genre}</div>
              </div>
              
            </div>);
  
}

const mapStateToProps = state => {
  return {
    isPlaying: state.sngMedia.playingSong,
    darkmode: state.themeToggle.darkmode
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onTogglePlayPause: (song) => dispatch (toggle_play_pause(song)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongMedia);