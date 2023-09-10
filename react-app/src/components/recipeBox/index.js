import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './recipeBox.css'

function RecipeBox() {
    const sessionUser = useSelector(state => state.session.user)
    const userName = sessionUser.username
    const userId = sessionUser.id
    return (
        <>
        <section className='recipeBoxContainer'>
        <h1>{userName}'s Recipe Box</h1>
        </section>
        </>
    )
}


export default RecipeBox;
