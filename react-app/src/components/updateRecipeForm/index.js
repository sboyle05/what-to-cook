import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { updateRecipeInBox, fetchRecipeBox } from '../../store/recipeBox';
import IngredientSearch from '../IngredientSearch';
import './updateRecipeForm.css';

const UpdateRecipe = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const existingRecipe = useSelector(state =>
    state.recipeBox.recipesInBox.find(recipe => recipe.id === Number(id))
  );

  const [name, setName] = useState(existingRecipe ? existingRecipe.name : "");
  const [directions, setDirections] = useState(existingRecipe ? existingRecipe.directions : "");
  const [measuredIngredients, setMeasuredIngredients] = useState(
    existingRecipe ? existingRecipe.measured_ingredients.map(m => m.description) : []
  );
  const [selectedIngredients, setSelectedIngredients] = useState(
    existingRecipe ? existingRecipe.ingredients.map(i => i.name) : []
  );
  const [customIngredients, setCustomIngredients] = useState([]);

  useEffect(() => {
    console.log('existingRecipe:', existingRecipe);
    if (existingRecipe) {
      setName(existingRecipe.name);
      setDirections(existingRecipe.directions);
      setMeasuredIngredients(existingRecipe.measured_ingredients.map(m => m.description));
      setSelectedIngredients(existingRecipe.ingredients.map(i => i.name));
    } else {
      dispatch(fetchRecipeBox());
    }
  }, [existingRecipe, dispatch]);

  useEffect(() => {
    const allIngredients = [...selectedIngredients, ...customIngredients.map(ing => ing.name)];

    setMeasuredIngredients(prevMeasured => {
      const newMeasuredIngredients = allIngredients.map((ingredientName) => {
        const existingMeasured = prevMeasured.find(
          (m) => m.split(":")[0].trim() === ingredientName
        );

        return existingMeasured || `${ingredientName}: `;
      });

      return newMeasuredIngredients;
    });

  }, [selectedIngredients, customIngredients]);


  const handleSubmit = (e) => {
    e.preventDefault();

    const measuredIngredientsArray = measuredIngredients.map(description => {
      return { description };
    });

    const newRecipeData = {
      id: Number(id),
      name,
      directions,
      measuredIngredients: measuredIngredientsArray,
      ingredients: [...selectedIngredients, ...customIngredients.map(ci => ci.name)].map(name => ({ name }))
    };

    dispatch(updateRecipeInBox(Number(id), newRecipeData))
    .then(() => {
      history.push(`/recipes/${id}`)
    })
    .catch((error) => {
      console.error("Failed to update the recipe:", error);
    });
  };


  const addCustomIngredient = () => {
    setCustomIngredients([...customIngredients, { name: '' }]);
  };

  const handleCustomIngredientChange = (index, event) => {
    const newCustomIngredients = [...customIngredients];
    newCustomIngredients[index][event.target.name] = event.target.value;
    setCustomIngredients(newCustomIngredients);
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
          addIngredient={(ingredient) => setSelectedIngredients([...selectedIngredients, ingredient])}
          selectedIngredients={selectedIngredients}
          removeIngredient={(ingredientToRemove) => {
            const newSelectedIngredients = selectedIngredients.filter(
              ingredient => ingredient !== ingredientToRemove
            );
            setSelectedIngredients(newSelectedIngredients);
          }}
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
      {measuredIngredients.map((ingredientDesc, index) => (
        <div key={index}>
          <label>
            {ingredientDesc.split(':')[0]}:
            <input
              type="text"
              value={ingredientDesc.split(':')[1].trimStart()}
              onChange={(event) => {
                const newValue = event.target.value;
                setMeasuredIngredients(prevMeasured => {
                  const newMeasured = [...prevMeasured];
                  const currentIngredient = newMeasured[index].split(':')[0];
                  newMeasured[index] = `${currentIngredient}: ${newValue}`;
                  return newMeasured;
                });
              }}
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
