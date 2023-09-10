import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IngredientSearch from '../IngredientSearch';
import { deselectIngredient, searchRecipes, selectIngredient } from '../../store/recipe';

function RecipeSearch() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [exactMatch, setExactMatch] = useState(false);
    const [extraCount, setExtraCount] = useState('');

    const dispatch = useDispatch();
    const recipes = useSelector((state) => state.recipes?.allRecipes);

    const addIngredient = (ingredient) => {
        if (typeof ingredient === 'string') {
            setSelectedIngredients([...selectedIngredients, ingredient]);
            dispatch(selectIngredient(ingredient));
        } else if (ingredient && ingredient.name) {
            setSelectedIngredients([...selectedIngredients, ingredient.name]);
            dispatch(selectIngredient(ingredient.name));
        }
    };

    const removeIngredient = (ingredient) => {
        const newSelectedIngredients = selectedIngredients.filter(i => i !== ingredient);
        setSelectedIngredients(newSelectedIngredients);
        dispatch(deselectIngredient(ingredient));
    };

    const fetchRecipes = () => {
        if (selectedIngredients.length === 0) {
            return;
        }
        console.log("**********selectedIngredients",selectedIngredients)
        dispatch(searchRecipes(selectedIngredients, exactMatch, extraCount));
    };
    console.log("**********selectedIngredientsOUTSIDE FETCH",selectedIngredients)
    return (
        <>
            <section className='mainContainer'>
                <h1 id='whatyouhave'>What ingredients do you have?</h1>
                <IngredientSearch
                    addIngredient={addIngredient}
                    removeIngredient={removeIngredient}
                    selectedIngredients={selectedIngredients}
                />
                <ul>
                    {selectedIngredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>

                <div>
                    <input type="radio" id="any" name="filter" value="any"
                        checked={!exactMatch && !extraCount}
                        onChange={() => { setExactMatch(false); setExtraCount(''); }} />
                    <label htmlFor="any">Any Match</label>
                </div>
                <div>
                    <input type="radio" id="exact" name="filter" value="exact"
                        checked={exactMatch}
                        onChange={() => { setExactMatch(true); setExtraCount(''); }} />
                    <label htmlFor="exact">Exact Match</label>
                </div>
                <div>
                    <input type="radio" id="extra" name="filter" value="extra"
                        checked={!!extraCount}
                        onChange={() => { setExactMatch(false); if(!extraCount) setExtraCount('1'); }} />
                    <label htmlFor="extra">Allow Extra Ingredients: </label>
                    <select disabled={!extraCount}
                            value={extraCount}
                            onChange={e => setExtraCount(e.target.value)}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <button onClick={fetchRecipes}
                        disabled={selectedIngredients.length === 0}>
                    Search Recipes
                </button>
                <ul>
                    {recipes ? recipes.map((recipe, index) => (
                        <li key={index}>{recipe.name}</li>
                    )) : "Loading recipes..."}
                </ul>
            </section>
        </>
    );
}

export default RecipeSearch;
