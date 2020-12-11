import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { current_time_change, change_song } from '../../../store/actions/index';
import { CLIENT_ID_QUERY } from '../../../config/config';
import { usePrevious } from '../../utility';

const GlobalAudio  = props => {

  const [audioTrack] = useState(new Audio());
  const [timer, setTimer] = useState(null);
  
  
  const prevIsPlaying = usePrevious(props.isPlaying);
  const prevSeekTime = usePrevious(props.seekTime);
  useEffect(()=> {
    if (props.selectedSong){
      if ((props.isPlaying === true && prevIsPlaying !== true) || (props.isPlaying && prevIsPlaying)){
        if (audioTrack.src !== props.selectedSong.stream_url + CLIENT_ID_QUERY){
          audioTrack.src = props.selectedSong.stream_url + CLIENT_ID_QUERY;
          audioTrack.play();
        } else if (audioTrack.src === props.selectedSong.stream_url + CLIENT_ID_QUERY){
          audioTrack.play();
        } 
      } else if (!props.isPlaying){
          audioTrack.pause(); 
      }
    }
   
  },[props.selectedSong, props.isPlaying, prevIsPlaying, audioTrack])

  //Effect executed when interface volume is changed
  useEffect(()=> {
    audioTrack.volume =  props.volumeLevel / 100;
  },[audioTrack.volume, props.volumeLevel]);

  //Effect executed when playing or pausing
  useEffect(()=>{
    if(!props.isPlaying){
      clearInterval(timer);
    } else if (prevIsPlaying !== true && props.isPlaying === true) {
      setTimer(setInterval(()=>{
        //This timer dispatches the actual time of the song each 200ms
        props.onCurrentTimeChange(Math.ceil(audioTrack.currentTime),audioTrack.duration);
      }, 200));
    }
  },[audioTrack.currentTime, audioTrack.duration, prevIsPlaying, props, props.isPlaying, timer]);

  //Effect executed when seeking time
  useEffect(()=>{
    if(prevSeekTime !== props.seekTime){
      audioTrack.currentTime = props.seekTime
      props.onCurrentTimeChange(props.seekTime, audioTrack.duration);
    }
  },[audioTrack.currentTime, audioTrack.duration, prevSeekTime, props, props.seekTime]);
  
  //Effect executed at the end of each song
  const songHasEnded = Math.ceil(audioTrack.duration) === props.currentTime;
  useEffect(()=>{
    if(songHasEnded){
      //Dispatches the action to jump to the next song
      props.onChangeSong('next', props.selectedSong, props.listedSongs);
      props.onCurrentTimeChange('0', audioTrack.duration);
    }
  },[audioTrack.duration, props, songHasEnded]);
  

  return null;
}

const mapStateToProps = state => {
  return {
    isPlaying: state.sngMedia.playingSong,
    selectedSong: state.sngMedia.selectedSong,
    volumeLevel: state.sngMedia.volumeLevel,
    currentTime: state.sngMedia.currentTime,
    seekTime: state.sngMedia.seekTime,
    listedSongs: state.lstSongs.listedSongs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrentTimeChange: (currentTime, songDuration) => dispatch (current_time_change(currentTime, songDuration)),
    onChangeSong: (direction, selectedSong, listedSongs) => dispatch (change_song(direction, selectedSong, listedSongs))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalAudio);