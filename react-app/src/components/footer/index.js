import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import './footer.css'
import gitHubIcon from '../../assets/github-mark-white.png'
import liIcon from '../../assets/LI.png'
const Footer = () => {

  return (
    <>
      <section className='footerContainer'>
        <section className='navButtonContainer'>
          <NavLink exact to='/about'>About</NavLink>
          <a href="https://github.com/sboyle05" target="_blank" rel="noopener noreferrer">
      <img id='gitHubIcon' src={gitHubIcon} alt='GitHub icon' />
    </a>
    <a href="https://www.linkedin.com/in/samboyle12/" target="_blank" rel="noopener noreferrer">
      <img id='liIcon' src={liIcon} alt='linkedIn icon' />
    </a>
        </section>
      </section>
    </>
  )
}

export default Footer
