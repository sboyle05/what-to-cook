import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addRecipeToBox } from '../../store/recipeBox';
import IngredientSearch from '../IngredientSearch';
import './newRecipeForm.css';

const NewRecipe = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [directions, setDirections] = useState("");
  const [customIngredients, setCustomIngredients] = useState([]);
  const [measuredIngredients, setMeasuredIngredients] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);



  useEffect(() => {
    setDirections(""); // Set directions as an empty string when the component loads
  }, []);

  useEffect(() => {
    console.log("Inside useEffect");
    console.log("Current selectedIngredients:", selectedIngredients);
    console.log("Current customIngredients:", customIngredients);

    const allIngredientNames = [
      ...customIngredients.map(ingredient => ingredient.name),
      ...selectedIngredients
  ]
  .filter(ingredientName => ingredientName);

    console.log("allIngredientNames:", allIngredientNames);

    const newMeasuredIngredients = {};
    allIngredientNames.forEach(ingredientName => {
        newMeasuredIngredients[ingredientName] = measuredIngredients[ingredientName] || '';
    });

    console.log("newMeasuredIngredients:", newMeasuredIngredients);

    setMeasuredIngredients(newMeasuredIngredients);
}, [customIngredients, selectedIngredients]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipeData = {
      name,
      directions,
      ingredients: [
        ...customIngredients,
        ...selectedIngredients.map(ingredient => ({ name: ingredient }))
      ],
      measuredIngredients,
    };
    console.log("*********NEW RECIPE***************",newRecipeData)
    dispatch(addRecipeToBox(newRecipeData));
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

      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default NewRecipe;
