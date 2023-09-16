import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from 'react-router-dom';
import { fetchRecipeBox, deleteRecipeFromBox, updateRecipeInBox, deleteFromRecipeBox } from '../../store/recipeBox';
import { finalDeleteRecipe } from '../../store/recipe';
import './recipeBox.css';
import OpenModalButton from '../OpenModalButton';
import MealPlannerModal from '../addToMealPlannerModal';

function RecipeBox() {
    const sessionUser = useSelector(state => state.session.user);
    const recipesInBox = useSelector(state => state.recipeBox.recipesInBox);
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const ulRef = useRef();

    let userName, userId;

    if (sessionUser) {
        userName = sessionUser.username;
        userId = sessionUser.id;
    }

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
      };

      useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
          if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
          }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchRecipeBox());
        }
    }, [dispatch, userId]);

    if (!sessionUser) {
        return <Redirect to="/" />;
    }

    const handleDelete = async (id) => {
        await dispatch(finalDeleteRecipe(id));

        dispatch(deleteFromRecipeBox(id));
    }

    const removeFromBox = async (id) => {
        await dispatch(deleteRecipeFromBox(id));
    }

    const userRecipeBox = Object.values(recipesInBox);
    const closeMenu = () => setShowMenu(false);

    return (
        <>
        <section className='recipeBoxContainer'>
            <section className='recipeBoxTitleContainer'>
            <h1 id='recipeBoxTitle'>{userName}'s Recipe Box</h1>
            </section>
            <NavLink exact to="/recipebox/new"><button id='createNewRecipeButton'>Create New Recipe</button></NavLink>
            <section className='recipeBoxSection'>
            <ul className='recipesInBox'>
                {userRecipeBox.map(({ name, id, user_id }) => (
                    <li id='mappedRecipesInBox' key={id}>
                    <NavLink exact to={`/recipes/${id}`}>{name}</NavLink>
                    <section className='recipeBoxButtons'>
                    <OpenModalButton buttonText="Add to Meal Planner"
                    onItemClick={closeMenu}
                    className='recipeBoxAddTo'
                    modalComponent={<MealPlannerModal recipeId={id} userId={userId} />}/>
                    {user_id === sessionUser.id && (
                    <>
                    <NavLink exact to={`/recipebox/update/${id}`}><button className='rbUpdate'>Update</button></NavLink>
                    <button className='rbDelete' onClick={() => handleDelete(id)}>Delete</button>
                    </>
                        )}
                        <button className='rbRemove' onClick={() => removeFromBox(id)}>Remove from Box</button>
                        </section>
                    </li>
                ))}
            </ul>
            </section>
        </section>
        </>
    );
}

export default RecipeBox;
