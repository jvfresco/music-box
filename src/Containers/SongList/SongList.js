import React, { useState, useEffect, useRef, useLayoutEffect} from 'react';
import { connect } from 'react-redux';
import Song from '../../Components/Song/Song';
import { list_songs_change } from '../../store/actions/index';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { usePrevious, debounce } from '../../Components/utility';
import { TweenMax } from 'gsap';
import './SongList.scss';


const SongList = props => {

  const [position, setPosition] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const songCardList = useRef([]);
  

  const onListSongsChange = props.onListSongsChange;
  //Executes only the first time the component is mounted
  useEffect(() =>{
    //First song list loaded using parameters in config.js
    onListSongsChange();
    //Event listener loaded to the scroll
    window.addEventListener('scroll', debounce(listenToScroll, 500));
    setLoading(true);
    return () => window.removeEventListener('scroll', listenToScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  },[]);


  const previousInputValue = usePrevious(props.inputValue);
  
  //Executes only when mounting or a new search has been performed
  //Initial input value is undefined
  useEffect(() => {
    if((undefined === props.inputValue || previousInputValue !== props.inputValue) && props.listedSongs.length > 0) {
      setLoading(true);
      //The change in the input dispatches the acion list_songs_change from the search component and this logic gets executed
      setTimeout(()=>{
        setList(props.listedSongs.map((song, index) => {
          return <div key={song.id} className={'Card'} ref={element => songCardList.current[index] = element}><Song track={song} /></div>;
        }));
      }, 500);
      setTimeout(()=>{
        setLoading(false);
      }, 1000); 
      window.scrollTo(0, 0);
      //The list needs to be cleaned to avoid UI problems
      return () => {
        setList([]);
      }
    }
  }, [props.inputValue, props.listedSongs, previousInputValue]);

  useLayoutEffect(()=>{
    if(list.length > 0){
      setTimeout(()=>{
        TweenMax.staggerTo( songCardList.current , 1, { opacity: 1}, 0.3);
      },500);
    }
  },[list])

  useEffect (()=> {
    //fetches more songs from the server
    async function updateSongList() {
      await props.onListSongsChange(props.inputValue, props.nextSongsUrl, props.listedSongs);
    } 
    if(loading && props.nextSongsUrl){
        updateSongList();
        setLoading(false);
    } else if (loading){
      setTimeout(()=>{
        setLoading(false);
      }, 2000); 
    }
  }, [loading, props]);
  
 
  const previousListedSongs = usePrevious(props.listedSongs);
  // This effect will execute after the execution of onlistsongchange and if the scroll is at the bottom of the page. It adds the new songs fetched to the list
  useEffect(() => {
    if (previousListedSongs !== props.listedSongs && position > 0.85){
      setList(
        list => list.concat(props.listedSongs.filter((song, index) => {
          return index > list.length;
        }).map((song, index) => {
          return <div key={song.id} className={'Card'} ref={element => {songCardList.current[index] = element;}}><Song track={song} /></div>;
        }))
      );
    }
  }, [previousListedSongs, props.listedSongs, position])
  
  //Scroll listener
  const listenToScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = winScroll / height
    setPosition(scrolled);
    //When the value of scrolled is greater than 0.85 means that the user is at the bottom of the page
    if(scrolled > 0.85 && loading === false){
      setLoading(true);
    } else {
      setLoading(false);
    }  
  }

  let spinner = null;
  if(loading){ 
    spinner = <Spinner /> 
  }else{
    spinner = null
  } 
    
    return (
      <div className={'SongList'}>
        <div className={'SongCollection'}>
          {list}
          {spinner}
        </div> 
      </div>
    );
  
}


const mapStateToProps = state => {
  return {
    listedSongs: state.lstSongs.listedSongs,
    inputValue: state.lstSongs.inputValue,
    nextSongsUrl: state.lstSongs.nextSongsUrl
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onListSongsChange: (inputValue, offsetValue, listedSongs) => dispatch(list_songs_change(inputValue, offsetValue, listedSongs))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SongList);

