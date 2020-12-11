import React from 'react';
import Logo from '../../Logo/Logo';
import NavItems from '../Navbar/NavItems/NavItems';
import './SideDrawer.scss';
import Backdrop from '../../UI/Backdrop/Backdrop';
import { connect } from 'react-redux';

const sideDrawer = (props) => {
  let attachedClasses = props.darkmode ? ['SideDrawer', 'DarkMode', 'Closed'] : ['SideDrawer', 'Closed'];
  if (props.open) {
    attachedClasses = props.darkmode ? ['SideDrawer', 'DarkMode', 'Open'] : ['SideDrawer', 'Open'];
  }
  return(
    <div>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <div className={'LogoSideDrawer'}>
          <Logo />
        </div>
          <nav>
            <NavItems />
          </nav>
      </div>
    </div>
   

  );
}

const mapStateToProps = (state) =>{
  return {
    darkmode: state.themeToggle.darkmode
  }
}

export default connect(mapStateToProps)(sideDrawer);