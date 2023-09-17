import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import DualPurposeModal from '../dualPurposeModal';
import './Navigation.css';
import wtcLogo from '../../assets/whatToCookLogo2.png'
import { useModal } from '../../context/Modal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();
  const { setModalContent, setUseSlideDown } = useModal();


  const handleRecipeBoxClick = (e) => {
    if (!sessionUser) {
      e.preventDefault();
      setModalContent(<DualPurposeModal />);
      setUseSlideDown(true);
    } else {
      history.push("/recipebox");
    }
  };

  const handleMealPlannerClick = (e) => {
    if (!sessionUser) {
      e.preventDefault();
      setModalContent(<DualPurposeModal />);
      setUseSlideDown(true);
    } else {
      history.push("/mealplanner");
    }
  };

  const comingSoon = () => {
    alert("SHOPPING LIST COMING SOON!!!");
  };

  return (
    <>
        <section className='logoContainer'>
          <img id="whatToCookLogo" src={wtcLogo} alt="what-to-cook logo"/>
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
              to="/recipebox"
              onClick={(e) => handleRecipeBoxClick(e)}
            >
              My RecipeBox
            </NavLink>
          </li>
          <li>
            <NavLink
              exact
              to="/mealplanner"
              onClick={(e) => handleMealPlannerClick(e)}
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
