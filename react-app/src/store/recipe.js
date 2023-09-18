const GET_RECIPES = '/search';
const SELECT_INGREDIENT = 'SELECT_INGREDIENT';
const DESELECT_INGREDIENT = 'DESELECT_INGREDIENT';
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE';
const CLEAR_RECIPES = 'CLEAR_RECIPES';
const DELETE_RECIPE = 'DELETE_RECIPE';
const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
const CLEAR_SEARCH_STATE = 'CLEAR_SEARCH_STATE';
const UPDATE_PAGINATION = 'UPDATE_PAGINATION';

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

export const searchRecipes =

	(selectedIngredients, exactMatch, extraCount, page = 1, perPage = 50) =>
	async (dispatch) => {
		try {
			const ingredientList = selectedIngredients.join(',');
			let url = `/api/search/?ingredients=${encodeURIComponent(
				ingredientList
			)}&page=${page}&per_page=${perPage}`;

			if (exactMatch) {
				url += `&exact=true`;
			} else if (extraCount) {
				url += `&extra_count=${extraCount}`;
			}
			const response = await fetch(url);
			const data = await response.json();

			dispatch(
				getRecipes({
					recipes: data.recipes || [],
					pagination: data.pagination || {},
				})
			);

		} catch (error) {
			console.error('Error fetching recipes:', error);
		}
	};

const initialState = {
	allRecipes: [],
	singleRecipe: {},
	selectIngredients: [],
	savedSearchState: null,

	pagination: { page: 1, per_page: 50, total: 0, total_pages: 1 },

};

const recipeReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_RECIPES:

			return {
				...state,
				allRecipes: action.payload.recipes,
				pagination: action.payload.pagination || initialState.pagination,
			};

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
