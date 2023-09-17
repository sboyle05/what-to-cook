const GET_RECIPES = '/search';
const SELECT_INGREDIENT = 'SELECT_INGREDIENT';
const DESELECT_INGREDIENT = 'DESELECT_INGREDIENT';
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE';
const CLEAR_RECIPES = 'CLEAR_RECIPES';
const DELETE_RECIPE = 'DELETE_RECIPE';
const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
const CLEAR_SEARCH_STATE = 'CLEAR_SEARCH_STATE';

export const selectIngredient = (ingredient) => ({
	type: SELECT_INGREDIENT,
	payload: ingredient,
});

export const deselectIngredient = (ingredient) => ({
	type: DESELECT_INGREDIENT,
	payload: ingredient,
});

export const clearRecipes = () => {
	return {
		type: CLEAR_RECIPES,
	};
};

const getRecipes = (data) => {
	return {
		type: GET_RECIPES,
		payload: data,
	};
};

const getSingleRecipe = (data) => {
	return {
		type: GET_SINGLE_RECIPE,
		payload: data,
	};
};

export const deleteRecipe = (id) => ({
	type: DELETE_RECIPE,
	payload: id,
});

export const saveSearchState = (searchState) => ({
	type: SAVE_SEARCH_STATE,
	payload: searchState,
});

export const clearSearchState = () => ({
	type: CLEAR_SEARCH_STATE,
});

export const finalDeleteRecipe = (recipeId) => async (dispatch) => {
	try {
		await fetch(`/api/recipes/${recipeId}`, {
			method: 'DELETE',
		});
		dispatch(deleteRecipe(recipeId));
	} catch (error) {
		console.error('Error deleting recipe', error);
	}
};

export const fetchSingleRecipe = (id) => async (dispatch) => {
	try {
		const response = await fetch(`/api/recipes/${id}`);

		if (response.ok) {
			const data = await response.json();
			dispatch(getSingleRecipe(data));
			return data;
		} else {
			dispatch(getSingleRecipe(null));
			return null;
		}
	} catch (error) {
		console.error('Error fetching single recipe:', error);
		dispatch(getSingleRecipe(null));
		return null;
	}
};

export const searchRecipes =
	(selectedIngredients, exactMatch, extraCount) => async (dispatch) => {
		try {
			const ingredientList = selectedIngredients.join(',');
			console.log();
			let url = `/api/search/?ingredients=${encodeURIComponent(ingredientList)}`;
			if (exactMatch) {
				url += `&exact=true`;
			} else if (extraCount) {
				url += `&extra_count=${extraCount}`;
			}
			const response = await fetch(url);
			const data = await response.json();
			dispatch(getRecipes(data.recipes || []));
		} catch (error) {
			console.error('Error fetching recipes:', error);
		}
	};

const initialState = {
	allRecipes: [],
	singleRecipe: {},
	selectIngredients: [],
	savedSearchState: null,
};

const recipeReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_RECIPES:
			return { ...state, allRecipes: action.payload };
		case SELECT_INGREDIENT:
			return {
				...state,
				selectIngredients: [...state.selectIngredients, action.payload],
			};
		case DESELECT_INGREDIENT:
			return {
				...state,
				selectIngredients: state.selectIngredients.filter(
					(i) => i !== action.payload
				),
			};
		case GET_SINGLE_RECIPE:
			return { ...state, singleRecipe: action.payload };
		case CLEAR_RECIPES:
			return {
				...state,
				allRecipes: [],
			};
		case SAVE_SEARCH_STATE:
			return { ...state, savedSearchState: action.payload };
		case CLEAR_SEARCH_STATE:
			return { ...state, savedSearchState: null };
		default:
			return state;
	}
};

export default recipeReducer;
