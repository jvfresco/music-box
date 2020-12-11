import React, {useRef} from 'react';
import seekIcon from '../../assets/rewind.svg';
import { connect } from 'react-redux';
import { toggle_play_pause, volume_change, seek_time, change_song } from '../../store/actions/index';
import GlobalAudio from '../Song/GlobalAudio/GlobalAudio';
import { millisToMinutesAndSeconds } from '../utility';
import ControlIcon from '../UI/ControlIcon/ControlIcon';
import gsap from 'gsap';
import './Player.scss';


const Player = props =>{
    const player = useRef();
    
    gsap.to(player.current, {y:0, duration: 3});

    const onPogressBarClickedHandle = event => {
      const newCurrentTime = event.clientX * (props.selectedSong.duration / 1000) / event.target.offsetWidth;
      props.onProgressBarChange(newCurrentTime);
    }

    const controlIcon = <ControlIcon class={!props.darkmode ? 'PlayerIcon' : 'PlayerIcon DarkMode' } togglePlayPause={props.onTogglePlayPause} thisTrackIsPlaying={props.isPlaying} track={props.selectedSong} />;
 
    return (
            <div className={ !props.darkmode ? 'Player' : 'Player DarkMode' } ref={player}>
              <div className={!props.darkmode ? 'ProgressBar' : 'ProgressBar DarkMode'} onClick={(e)=>onPogressBarClickedHandle(e)}>
                <div className={!props.darkmode ? 'TimeBar' : 'TimeBar DarkMode'} style={{width: props.currentPercentage + '%'}}/>
              </div>
              <div className={'PlayerControls'}>
                
                <div className={'PlayerPlay'}>
                  <img className={!props.darkmode ? 'PreviousIcon' : 'PreviousIcon DarkMode'} src={seekIcon} alt='Previous song' onClick={()=>props.onSongChange('previous', props.selectedSong, props.listedSongs)}></img>
                  {controlIcon}
                  <img className={!props.darkmode ? 'NextIcon' : 'NextIcon DarkMode'} src={seekIcon} alt='Next song' onClick={()=>props.onSongChange('next', props.selectedSong, props.listedSongs)}></img>
                </div>
              
                
                <div className={'SongData'}>
                  <div className={'SongTitle'}>{props.selectedSong.title}</div>
                  <div className={'SongArtist'}>{props.selectedSong.user.username}</div>
                </div>
                <div className={'PlayerDuration'}>{ millisToMinutesAndSeconds(props.currentTime*1000) + ' / ' + millisToMinutesAndSeconds(props.selectedSong.duration)}</div>
                <div className={'PlayerVolume'}>
                  <input className={!props.darkmode ? 'VolumeBar' : 'VolumeBar DarkMode'} type='range' step='1' min='1' max='100' value={props.volumeLevel} onChange={(e) => props.onVolumeChange(e.target.value)}/>
                </div>
              </div>
              <GlobalAudio />
            </div>
    )
    
}

const mapStateToProps = (state) =>{
  return {
    isPlaying: state.sngMedia.playingSong,
    selectedSong: state.sngMedia.selectedSong,
    volumeLevel: state.sngMedia.volumeLevel,
    currentTime: state.sngMedia.currentTime,
    currentPercentage: state.sngMedia.currentPercentage,
    listedSongs: state.lstSongs.listedSongs,
    darkmode: state.themeToggle.darkmode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTogglePlayPause: (song) => dispatch (toggle_play_pause(song)),
    onVolumeChange: (newVolumeLevel) => dispatch (volume_change(newVolumeLevel)),
    onProgressBarChange: (newCurrentTime) => dispatch (seek_time(newCurrentTime)),
    onSongChange: (directon, selectedSong, listedSongs) => dispatch (change_song(directon, selectedSong, listedSongs))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);