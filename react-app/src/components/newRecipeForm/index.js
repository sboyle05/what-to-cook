import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addRecipeToBox } from '../../store/recipeBox';
import IngredientSearch from '../IngredientSearch';


import './newRecipeForm.css';

const NewRecipe = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [directions, setDirections] = useState("");
  const [customIngredients, setCustomIngredients] = useState([]);
  const [measuredIngredients, setMeasuredIngredients] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);



  useEffect(() => {
    setDirections("");
  }, []);

  useEffect(() => {
    const allIngredientNames = [
      ...customIngredients.map(ingredient => ingredient.name),
      ...selectedIngredients
  ]
  .filter(ingredientName => ingredientName);
    const newMeasuredIngredients = {};
    allIngredientNames.forEach(ingredientName => {
        newMeasuredIngredients[ingredientName] = measuredIngredients[ingredientName] || '';
    });
    setMeasuredIngredients(newMeasuredIngredients);
}, [customIngredients, selectedIngredients]);


const handleSubmit = async (e) => {
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
  dispatch(addRecipeToBox(newRecipeData))
  .then(() => {
    history.push('/recipebox')
  })
  .catch((error) => {
    console.error("Failed to update the recipe:", error);
  });
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
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  const removeSearchIngredient = (ingredientToRemove) => {
    const newSelectedIngredients = selectedIngredients.filter(
      ingredient => ingredient !== ingredientToRemove
    );
    setSelectedIngredients(newSelectedIngredients);
  };

  const removeCustomIngredient = (indexToRemove) => {
    const newCustomIngredients = customIngredients.filter((_, index) => index !== indexToRemove);
    setCustomIngredients(newCustomIngredients);
  };

  return (
    <section className='newRecipeFormContainer'>
      <h1>Create A New Recipe</h1>
    <form onSubmit={handleSubmit}>
      <section className='formLabelInput'>
      <label id='recipeNameLabel'>Recipe Name:</label>
      <input id='recipeNameInput' type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </section>
      <section className='formLabelInput'>
      <label id="recipeDirectionsLabel">Directions:</label>
      <textarea id="recipeTextAreaInput" value={directions} onChange={(e) => setDirections(e.target.value)} />
      </section>
      <section className='formLabelInput'>
      <fieldset>
        <legend id='newRecipeSearchForIngredients'>Search for Ingredients</legend>
        <section className='newRecipeIngredientSearchSection'>
        <IngredientSearch
          className="newRecipeIngredientSearch"
          addIngredient={addSearchIngredient}
          selectedIngredients={selectedIngredients}
          removeIngredient={removeSearchIngredient}
        />{selectedIngredients.length > 0 ? <span id='specialMsg'>click on an ingredient to remove it</span> : null}
        </section>
      </fieldset>
      </section>
      <section className='formLabelInput'>
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
                <FontAwesomeIcon
                id='removeCustomIngButton'
                icon={faTrash}
                style={{ color: "#ffffff", cursor: "pointer" }}
                onClick={() => removeCustomIngredient(index)}
              />
            </div>
          ))}
            <button type="button" onClick={addCustomIngredient}>Add Custom Ingredient</button>
          </fieldset>
      </section>
      <section className='formLabelInput'>
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
      </section>
      <section className='newRecipeSubmitContainer'>
      <button id='submitNewRecipeButton' type="submit">Add Recipe</button>
      </section>
    </form>
    </section>
  );
};

export default NewRecipe;
