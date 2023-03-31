import './navbar.css';
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';



function NavBar() {
  const location = useLocation();
  return (
    <>
    <div className='d-flex justify-content-end navigation'>
      <LinkContainer exact='true' to="/search" className={location.pathname === '/search' ? 'navbar-active' : 'navbar'}>
        <button className='mx-3'>Search</button>
      </LinkContainer>
      <LinkContainer exact='true' to="/favorites" className={location.pathname === '/favorites' ? 'navbar-active' : 'navbar'}>
        <button className='mx-3'>Favorites</button>
      </LinkContainer>
    </div>
    </>
  );
}

export default NavBar;
