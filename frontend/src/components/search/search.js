import React from 'react';
import NavBar from '../navbar/navbar';
import './search.css';
import SearchForm from '../form/form';



function Search(){
  return(
    <div className='search'>
      <div>
        <NavBar/>
      </div>
      <br></br>
      <div>
        <SearchForm/>
      </div>
    </div>
  );
}

export default Search;