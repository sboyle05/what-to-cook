import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, NavLink } from 'react-router-dom'
import { fetchSingleRecipe } from "../../store/recipe";

import './singleRecipe.css'



const SingleRecipeComponent = () => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const recipeState = useSelector((state) => state.recipes)
    console.log("CURRENT REDUX STATE*************", recipeState)


    const currentRecipe = useSelector((state) => state.recipes.singleRecipe)

    useEffect(() => {
        dispatch(fetchSingleRecipe(id))
    }, [dispatch, id])


    return (
        <>
            {currentRecipe ? (
                <section className="singleRecipeContainer">
                    <h1>{currentRecipe.name}</h1>
                    <section className="recipeIngredientSection">
                        <h3 id="numberIngredients">
                            {currentRecipe.ingredients ? currentRecipe.ingredients.length : 0} Ingredients
                        </h3>
                        <ol className="measuredIngredientsList">
                            {currentRecipe.measured_ingredients ? currentRecipe.measured_ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            )) : null}
                        </ol>
                    </section>
                    <section className="recipeDirections">
                        <h3>Directions</h3>
                        <ol>
                            {currentRecipe.directions ? JSON.parse(currentRecipe.directions).map((direction, index) => (
                                <li id="individualdirection" key={index}>{direction}</li>
                            )) : null}
                        </ol>
                    </section>
                </section>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default SingleRecipeComponent;
