import React, { useState } from 'react';
import './Search.scss';


const Search = (props) => {

  const [inputField, setInputField] = useState(null);


  const handleInputChange = (event) =>{
    setInputField(event.target.value);
  }

  const submitSearch = (e) => {
    e.preventDefault();
    props.submitSearch(inputField);
  }

  return (
    <form className={'Search'} onSubmit={(e) => submitSearch(e)}>
      <input className={'SearchInput'} type='text' placeholder='Search music...' onChange={handleInputChange.bind(this)}></input>
    </form>
  );
  
}
export default Search;