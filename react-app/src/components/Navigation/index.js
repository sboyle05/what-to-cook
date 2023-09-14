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

  const comingSoon = () => {
    alert("SHOPPING LIST COMING SOON!!!");
  };

  return (
    <>
        <section className='logoContainer'>
          <img id="whatToCookLogo" src='/whatToCookLogo2.png' alt="what-to-cook logo"/>
        </section>
      <section className='navigationContainer'>
        <section className='navButtonContainer'>
        <ul className='navList'>
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
          <li>
            <NavLink
              exact
              to={sessionUser ? "/mealplanner" : "/login?redirect=/mealplanner"}
            >
              Meal Planner
            </NavLink>
          </li>
          <li>
            <span onClick={comingSoon}>Shopping List</span>
          </li>
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </ul>
        </section>
      </section>
    </>
  );
}


export default Navigation;
