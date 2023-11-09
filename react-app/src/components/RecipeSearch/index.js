import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IngredientSearch from '../IngredientSearch';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import {
	deselectIngredient,
	searchRecipes,
	selectIngredient,
	clearRecipes,
} from '../../store/recipe';
import './recipeSearch.css';
import { fetchRandomRecipes } from '../../store/recipe';
function RecipeSearch() {
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [exactMatch, setExactMatch] = useState(false);
	const [extraCount, setExtraCount] = useState('');
	const [initialSearchDone, setInitialSearchDone] = useState(false);
	const [showPaginationButtons, setShowPaginationButtons] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [viewingRandomRecipes, setViewingRandomRecipes] = useState(false);
	const total = useSelector((state) => state.recipes?.pagination.total);
	const totalNumberOfPages = Math.ceil(total / perPage);
	const veryLastPage = currentPage === totalNumberOfPages;
	const isLoading = useSelector((state) => state.recipeReducer?.isLoading);
	const [toggle, setToggle] = useState(''); //created to manage state of ai vs human
	const ingredientArray = [];

	const dispatch = useDispatch();
	const recipes = useSelector((state) =>
		Object.values(state.recipes?.allRecipes)
	);

	const fetchRecipes = useCallback(() => {
		if (selectedIngredients.length === 0) {
			setShowPaginationButtons(false);
			return;
		}
		dispatch(
			searchRecipes(
				selectedIngredients,
				exactMatch,
				extraCount,
				currentPage,
				perPage
			)
		);
		setInitialSearchDone(true);
		setShowPaginationButtons(true);
		setViewingRandomRecipes(false);
	}, [
		selectedIngredients,
		exactMatch,
		extraCount,
		dispatch,
		currentPage,
		perPage,
	]);

	useEffect(() => {
		if (recipes.length === 0) {
			setShowPaginationButtons(false);
		} else {
			setShowPaginationButtons(true);
		}
	}, [recipes]);

	useEffect(() => {
		if (initialSearchDone) {
			if (selectedIngredients.length > 0) {
				fetchRecipes();
			} else {
				dispatch(clearRecipes());
			}
		}
	}, [
		selectedIngredients,
		exactMatch,
		extraCount,
		dispatch,
		fetchRecipes,
		initialSearchDone,

		currentPage,
		perPage,
	]);

	const addIngredient = (ingredient) => {
		if (typeof ingredient === 'string') {
			setSelectedIngredients([...selectedIngredients, ingredient]);
			ingredientArray.push(ingredient);
			dispatch(selectIngredient(ingredient));
		} else if (ingredient && ingredient.name) {
			setSelectedIngredients([...selectedIngredients, ingredient.name]);
			dispatch(selectIngredient(ingredient.name));
		}
	};

	const removeIngredient = (ingredient) => {
		const newSelectedIngredients = selectedIngredients.filter(
			(i) => i !== ingredient
		);
		setSelectedIngredients(newSelectedIngredients);
		dispatch(deselectIngredient(ingredient));
	};

	const clearSearchResults = () => {
		setSelectedIngredients([]);
		setInitialSearchDone(false);
		dispatch(clearRecipes());
		setShowPaginationButtons(false);
	};
	const handleGetRandomRecipes = () => {
    dispatch(fetchRandomRecipes());
    setViewingRandomRecipes(true);
};
	return (

			<section className='mainRecipeContainer'>
				<section className='gpt'>

				</section>
				<section className='human'>
				<h1 id='whatyouhave'>What ingredients do you have?</h1>
				<IngredientSearch
					addIngredient={addIngredient}
					removeIngredient={removeIngredient}
					selectedIngredients={selectedIngredients}
				/>
				{selectedIngredients.length > 0 ? (
					<span id='specialMsgSearch'>click on an ingredient to remove it</span>
				) : null}

				<div>
					<input
						type='radio'
						id='any'
						name='filter'
						value='any'
						checked={!exactMatch && !extraCount}
						onChange={() => {
							setExactMatch(false);
							setExtraCount('');
						}}
					/>
					<label htmlFor='any'>Any Match</label>
				</div>
				<div>
					<input
						type='radio'
						id='exact'
						name='filter'
						value='exact'
						checked={exactMatch}
						onChange={() => {
							setExactMatch(true);
							setExtraCount('');
						}}
					/>
					<label htmlFor='exact'>Exact Match</label>
				</div>
				<div>
					<input
						type='radio'
						id='extra'
						name='filter'
						value='extra'
						checked={!!extraCount}
						onChange={() => {
							setExactMatch(false);
							if (!extraCount) setExtraCount('1');
						}}
					/>
					<label htmlFor='extra'>Allow Extra Ingredients: </label>
					<select
						disabled={!extraCount}
						value={extraCount}
						onChange={(e) => setExtraCount(e.target.value)}
					>
						{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
							<option key={num} value={num}>
								{num}
							</option>
						))}
					</select>
				</div>

				<button
					id='searchButton'
					onClick={fetchRecipes}
					disabled={selectedIngredients.length === 0}
				>
					Search Recipes
				</button>
				<button id='randomRecipeButton' onClick={handleGetRandomRecipes}>Get Random Recipes</button>
				<button id='clearButton' onClick={clearSearchResults}>
					Clear Results
				</button>
				<section className='reciperesults'>
					{isLoading ? (
						<CircularProgress />
					) : (
						<ul className='recipesMapped'>
							{recipes
								? recipes.map((recipe, index) => (
										<Link
											key={index}
											className='recipeLink'
											to={`/recipes/${recipe.id}`}
										>
											<li>{recipe.name}</li>
										</Link>
								  ))
								: 'Loading recipes...'}
						</ul>
					)}
				</section>

				<section className='paginationButtons'>
					{showPaginationButtons && total > 0 && !viewingRandomRecipes && (
						<>
							{currentPage > 1 && (
								<button
									id='previousPageButton'
									onClick={() => setCurrentPage(currentPage - 1)}
								>
									Previous
								</button>
							)}
							{!veryLastPage && (
								<button
									id='nextPageButton'
									onClick={() => setCurrentPage(currentPage + 1)}
								>
									Next
								</button>
							)}
						</>
					)}
				</section>
				</section>
			</section>

	);
}

export default RecipeSearch;
