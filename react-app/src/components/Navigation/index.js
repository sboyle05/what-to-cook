import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  const handleRecipeBoxClick = () => {
	if (!sessionUser) {
	  history.push('/login?redirect=/recipebox');
	}
  };

  return (
    <>
      <section className='navigationContainer'>
        <ul>
          <li>
            <NavLink exact to="/">Home</NavLink>
          </li>
          <li>
            <NavLink
              exact
              to={sessionUser ? "/recipebox" : "/login?redirect=/recipebox"}
            >
              My RecipeBox
            </NavLink>
          </li>
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </ul>
      </section>
    </>
  );
}


export default Navigation;
