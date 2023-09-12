import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from 'react-router-dom';
import { fetchRecipeBox, deleteRecipeFromBox, updateRecipeInBox } from '../../store/recipeBox';
import './recipeBox.css';

function RecipeBox() {
    const sessionUser = useSelector(state => state.session.user);
    const recipesInBox = useSelector(state => state.recipeBox.recipesInBox);
    const dispatch = useDispatch();

    let userName, userId;

    if (sessionUser) {
        userName = sessionUser.username;
        userId = sessionUser.id;
    }

    useEffect(() => {
        if (userId) {
            dispatch(fetchRecipeBox());
        }
    }, [dispatch, userId]);

    if (!sessionUser) {
        return <Redirect to="/" />;
    }

    const handleDelete = async (id) => {
        await dispatch(deleteRecipeFromBox(id));
    }

    const userRecipeBox = Object.values(recipesInBox);

    return (
        <>
        <section className='recipeBoxContainer'>
            <h1>{userName}'s Recipe Box</h1>

            <ul>
                {userRecipeBox.map(({ name, id, user_id }) => (
                    <li key={id}>
                    {name}
                    {user_id === sessionUser.id && (
                    <>
                    <NavLink exact to={`/recipebox/update/${id}`}><button>Update</button></NavLink>
                    <button onClick={() => handleDelete(id)}>Delete</button>
                    </>
                        )}
                        <button onClick={() => handleDelete(id)}>Remove from Box</button>
                    </li>
                ))}
            </ul>
        </section>
        </>
    );
}

export default RecipeBox;
