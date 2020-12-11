import React, { Component } from 'react';
import Navbar from './Components/Navigation/Navbar/Navbar';
import SideDrawer from './Components/Navigation/SideDrawer/SideDrawer';
import SongList from './Containers/SongList/SongList';
import { connect } from 'react-redux';
import Player from './Components/Player/Player';
import Modal from './Components/UI/Modal/Modal';
import { server_error } from './store/actions';
import Button from './Components/UI/Button/Button';

class App extends Component{

  state = {
    toggleDrawer: false
  }

  sideDrawerToggleHandler = () =>{
    this.setState((prevState) => {
      return {toggleDrawer: !prevState.toggleDrawer}
    });
  }

  sideDrawerClosedHandler = () =>{
    this.setState({toggleDrawer: false});
  }

  


  render(){   
    let player = this.props.showPlayer ? <Player /> : null

    const errorMessage = (
      <div>
          <h1>There has been a problem with the server connection. Please try reloading the page or perform a new search.</h1>
          <Button btnType='Primary' clicked={() =>window.location.reload(false)}>Reload Page</Button>
      </div>
    );

    return (
      <div className="App">
        <Modal show={this.props.error} modalClosed={() => this.props.onErrorMessageClosed()}>
          {errorMessage}
        </Modal>
        <Navbar toggleDrawer={this.sideDrawerToggleHandler} />
        <SideDrawer open= {this.state.toggleDrawer} closed={this.sideDrawerClosedHandler} />
        <SongList />
        {player}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showPlayer: state.sngMedia.showPlayer,
    error: state.lstSongs.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onErrorMessageClosed: () => dispatch(server_error(false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
