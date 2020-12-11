import { useEffect, useRef } from 'react';

//Converts milliseconds to minutes and seconds
export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//Used to save the value of the previous state
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

//Function used in conjuction with the scroll listener
export const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func.apply(this, arguments);
    }, 
    delay);
  }
}