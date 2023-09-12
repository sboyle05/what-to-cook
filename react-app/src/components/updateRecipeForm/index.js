import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateRecipeInBox, fetchRecipeBox } from '../../store/recipeBox';
import IngredientSearch from '../IngredientSearch';
import './updateRecipeForm.css';

const UpdateRecipe = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const existingRecipe = useSelector(state =>
    state.recipeBox.recipesInBox.find(recipe => recipe.id === Number(id))
  );
    console.log("************existing RECIPE*******", existingRecipe)
  const [name, setName] = useState(existingRecipe ? existingRecipe.name : "");
  const [directions, setDirections] = useState(existingRecipe ? existingRecipe.directions : "");
  const [customIngredients, setCustomIngredients] = useState(existingRecipe ? existingRecipe.customIngredients : []);
  const [measuredIngredients, setMeasuredIngredients] = useState(existingRecipe ? existingRecipe.measuredIngredients : {});

  const [selectedIngredients, setSelectedIngredients] = useState(existingRecipe ? existingRecipe.selectedIngredients : []);

  useEffect(() => {
    if (!existingRecipe) {

      dispatch(fetchRecipeBox());
    } else {
      setName(existingRecipe.name);
      setDirections(existingRecipe.directions);
      setCustomIngredients(existingRecipe.customIngredients);
      setMeasuredIngredients(existingRecipe.measuredIngredients);
      setSelectedIngredients(existingRecipe.selectedIngredients);
    }
  }, [existingRecipe, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipeData = {
      id: Number(id),
      name,
      directions,
      customIngredients,
      measuredIngredients,
      selectedIngredients
    };
    dispatch(updateRecipeInBox(Number(id), newRecipeData));
  };

  const handleCustomIngredientChange = (index, event) => {
    const newCustomIngredients = [...customIngredients];
    newCustomIngredients[index][event.target.name] = event.target.value;
    setCustomIngredients(newCustomIngredients);
  };

  const handleMeasuredIngredientChange = (ingredient, event) => {
    const newMeasuredIngredients = { ...measuredIngredients };
    newMeasuredIngredients[ingredient] = event.target.value;
    setMeasuredIngredients(newMeasuredIngredients);
  };

  const addCustomIngredient = () => {
    setCustomIngredients([...customIngredients, { name: '' }]);
  };

  const addSearchIngredient = (ingredient) => {
    console.log("***************Adding ingredient:", ingredient); // Debug statement
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  const removeSearchIngredient = (ingredientToRemove) => {
    const newSelectedIngredients = selectedIngredients.filter(
      ingredient => ingredient !== ingredientToRemove
    );
    setSelectedIngredients(newSelectedIngredients);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Recipe Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Directions:</label>
      <textarea value={directions} onChange={(e) => setDirections(e.target.value)} />

      <fieldset>
        <legend>Search for Ingredients</legend>
        <IngredientSearch
          addIngredient={addSearchIngredient}
          selectedIngredients={selectedIngredients}
          removeIngredient={removeSearchIngredient}
        />
      </fieldset>

      <fieldset>
        <legend>Couldn't find your ingredient? Add it below:</legend>
        {customIngredients.map((ingredient, index) => (
          <div key={index}>
            <label>
              Ingredient {index + 1}:
              <input
                type="text"
                name="name"
                value={ingredient.name}
                onChange={(event) => handleCustomIngredientChange(index, event)}
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addCustomIngredient}>Add Custom Ingredient</button>
      </fieldset>

      <fieldset>
        <legend>Measured Ingredients</legend>
        {Object.keys(measuredIngredients).map((ingredient, index) => (
          <div key={index}>
            <label>
              {ingredient}:
              <input
                type="text"
                value={measuredIngredients[ingredient]}
                onChange={(event) => handleMeasuredIngredientChange(ingredient, event)}
                required
              />
            </label>
          </div>
        ))}
      </fieldset>

      <button type="submit">Update Recipe</button>
    </form>
  );
};

export default UpdateRecipe;
