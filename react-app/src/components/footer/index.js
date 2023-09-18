import React from 'react';
import './footer.css'
import { NavLink, useHistory } from 'react-router-dom';
const Footer = () => {

  return (
    <>
      <section className='footerContainer'>
        <section className='navButtonContainer'>
          <NavLink exact to='/about'>About</NavLink>
        </section>
      </section>
    </>
  )
}
