import React, {useState, useLayoutEffect } from 'react';
//List of classes that need to be modified in the template
import  classesToDarken from './ClassesToDarken';
//If using with redux
import {connect} from 'react-redux';
import { dark_theme_toggle } from '../../../store/actions/themeToggle';
import toggleThemeIcon from '../../../assets/sun_moon.svg';
import './DarkModeToggle.scss';

//Component used to change a theme via adding or removing a class
//Class to append 
const darkModeClassName = 'DarkMode';

const DarkModeToggle = (props) => {
  const [darkmode, setDarkmode] = useState(false);
  
  
  const themeToggle = () => {
    if (!darkmode){
      //For each class in the array, the new class is added
        classesToDarken.forEach(className => {
          if (document.querySelector(className)){
            document.querySelectorAll(className).forEach(element => {
              return element.classList.add(darkModeClassName);
            })
          }
        });    
    } else {
      //For each class in the array it the new class is removed
        classesToDarken.forEach(className => {
          if (document.querySelector(className)){
            document.querySelectorAll(className).forEach(element => {
              return element.classList.remove(darkModeClassName);
            })
          }
        });
    }
    setDarkmode(!darkmode);
    //The status of the Darkmode is saved in localstorage
    localStorage.setItem('DarkMode', !darkmode);
    //Using redux, dispatch action
    props.onThemeToggle(!darkmode);
  }
//If the application has been used before, the status of the theme has been saved. Check for existence
  useLayoutEffect(() => {
    if(JSON.parse(localStorage.getItem('DarkMode')) === true) {
      themeToggle();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  let text = props.text ? <span className="ToggleThemeText">{props.text}</span> : null;
  return (
    <div className="ToggleContainer">
      <input className="CheckToggle" id="toggleTheme" type="checkbox" onChange= {themeToggle} />
      <label className="ToggleTheme" htmlFor="toggleTheme">
        <img className="ToggleThemeIcon" src={toggleThemeIcon} alt="Switch Theme" />
        {text}
      </label>
    </div>
  );

}

//If using redux 

const mapDispatchToProps = dispatch => {
  return {
    onThemeToggle: (darkmode) => dispatch (dark_theme_toggle(darkmode))
  };
}

export default connect(null, mapDispatchToProps)(DarkModeToggle);

//Without redux
// export default DarkModeToggle;