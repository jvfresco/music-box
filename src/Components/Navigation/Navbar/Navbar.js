import React, { useState, useEffect } from 'react';
import NavItems from './NavItems/NavItems';
import NavTitle from './NavTitle/NavTitle';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import Logo from '../../Logo/Logo';
import Search from './Search/Search';
import {connect} from 'react-redux';
import { list_songs_change } from '../../../store/actions/index';
import './Navbar.scss';

const Navbar = props => {

  const [title, setTitle] = useState('Featured Tracks');
  
  useEffect(() => {
    if(props.inputValue){
      if(props.listedSongs.length > 0){
        setTitle('Showing results for: ' + props.inputValue);
      } else {
        setTitle('Sorry no matches were found for your search. Try again');
      }
    }
  },[props.inputValue, props.listedSongs]);

  const submitSearch = (inputValue) =>{
    props.onSubmitSearch(inputValue);
  }

  return (
    <div className={"Navbar"}>
      <DrawerToggle toggleDrawer={props.toggleDrawer}></DrawerToggle>
      <Logo desktopOnly={true}/>
      <div className={"SearchTitle"}>
        <Search submitSearch={submitSearch}></Search>
        <NavTitle title={title}></NavTitle>
      </div>
      <NavItems desktopOnly={true}/>
    </div>
  );
  
}

const mapStateToProps = (state) =>{
  return {
    listedSongs: state.lstSongs.listedSongs,
    inputValue: state.lstSongs.inputValue
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onSubmitSearch: (inputValue) => dispatch(list_songs_change(inputValue))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);