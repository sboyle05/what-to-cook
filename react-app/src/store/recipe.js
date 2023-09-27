const GET_RECIPES = '/search';
const SELECT_INGREDIENT = 'SELECT_INGREDIENT';
const DESELECT_INGREDIENT = 'DESELECT_INGREDIENT';
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE';
const CLEAR_RECIPES = 'CLEAR_RECIPES';
const DELETE_RECIPE = 'DELETE_RECIPE';
const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
const CLEAR_SEARCH_STATE = 'CLEAR_SEARCH_STATE';
const UPDATE_PAGINATION = 'UPDATE_PAGINATION';
const SET_LOADING = 'SET_LOADING';

export const setLoading = (isloading) => ({
	type: SET_LOADING,
	payload: isloading,
});

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

export const updatePagination = (payload) => ({
	type: UPDATE_PAGINATION,
	payload,
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

		const data = await response.json();
		dispatch(getSingleRecipe(data));
		return data;
	} catch (error) {
		console.error('Error fetching single recipe:', error);
	}
};

export const searchRecipes = (selectedIngredients, exactMatch, extraCount, page = 1, perPage = 50) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
			console.log("selectedIngredients in thunk***", selectedIngredients)
			const ingredientList = selectedIngredients.join(',');
			let url = `/api/search/?ingredients=${encodeURIComponent(ingredientList)}&page=${page}&per_page=${perPage}`;
			console.log("INGREDLIST*****", ingredientList)
			if (exactMatch) {
					url += `&exact=true`;
			} else if (extraCount) {
					url += `&extra_count=${extraCount}`;
			}

			const response = await fetch(url);
			if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

			const data = await response.json();

			dispatch(getRecipes({
					recipes: data.recipes || [],
					pagination: data.pagination || {},
			}));
	} catch (error) {
			console.error('Error fetching recipes:', error);

	} finally {
			dispatch(setLoading(false));
	}
};
const initialState = {
	allRecipes: {},
	singleRecipe: {},
	selectIngredients: {},
	savedSearchState: null,
	isLoading: false,
	pagination: { page: 1, per_page: 50, total: 0, total_pages: 1 },
};

const recipeReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_RECIPES:
			return {
				...state,
				allRecipes: {
					...action.payload.recipes.reduce((acc, recipe) => {
						acc[recipe.id] = recipe;
						return acc;
					}, {}),
				},
				pagination: action.payload.pagination || initialState.pagination,
			};

		case SELECT_INGREDIENT:
			return {
				...state,
				selectIngredients: {
					...state.selectIngredients,
					[action.payload.id]: action.payload,
				},
			};
		case DESELECT_INGREDIENT:
			const newIngredients = { ...state.selectIngredients };
			delete newIngredients[action.payload.id];
			return {
				...state,
				selectIngredients: newIngredients,
			};
		case GET_SINGLE_RECIPE:
			return { ...state, singleRecipe: action.payload };
		case CLEAR_RECIPES:
			return {
				...state,
				allRecipes: {},
			};
		case SAVE_SEARCH_STATE:
			return { ...state, savedSearchState: action.payload };
		case CLEAR_SEARCH_STATE:
			return { ...state, savedSearchState: null };
		case SET_LOADING:
			return { ...state, isLoading: action.payload };
		default:
			return state;
	}
};

export default recipeReducer;
