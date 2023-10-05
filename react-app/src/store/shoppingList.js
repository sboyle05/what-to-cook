//action types
const GET_SHOPPING_LISTS = 'GET_SHOPPING_LISTS';
const GET_SINGLE_LIST = 'GET_SINGLE_LIST';
const ADD_TO_SHOPPING_LIST = 'ADD_TO_SHOPPING_LIST';
const ADD_INGREDIENT_TO_LIST = 'ADD_INGREDIENT_TO_LIST';
const UPDATE_SHOPPING_LIST_NAME = 'UPDATE_SHOPPING_LIST_NAME';
const DELETE_SHOPPING_LIST = 'DELETE_SHOPPING_LIST';
const ADD_MULTIPLE_INGREDIENTS_TO_LIST = 'ADD_MULTIPLE_INGREDIENTS_TO_LIST';

//action creators

export const getShoppingList = (data) => ({
	type: GET_SHOPPING_LISTS,
	payload: data,
});

export const getSingleList = (list) => ({
	type: GET_SINGLE_LIST,
	payload: list,
});

export const addToShoppingList = (data) => ({
	type: ADD_TO_SHOPPING_LIST,
	payload: data,
});

export const addIngredientToShoppingList = (data) => ({
	type: ADD_INGREDIENT_TO_LIST,
	payload: data,
});

export const addMultipleIngredientsToShoppingList = (data) => ({
	type: ADD_MULTIPLE_INGREDIENTS_TO_LIST,
	payload: data,
});

export const updateShoppingListName = (name, id) => ({
	type: UPDATE_SHOPPING_LIST_NAME,
	payload: { name, id },
});

export const deleteShoppingList = (id) => ({
	type: DELETE_SHOPPING_LIST,
	payload: id,
});

//thunks

export const fetchShoppingList = () => async (dispatch) => {
	try {
		const response = await fetch('/api/shoppinglist/');
		const data = await response.json();
		dispatch(getShoppingList(data));
	} catch (error) {
		console.error('Error fetching shopping list:', error);
	}
};

export const fetchSingleList = (id) => async (dispatch) => {
	try {
		const response = await fetch(`/api/shoppinglist/${id}/`);
		const singleList = await response.json();
		dispatch(getSingleList(singleList));
	} catch (error) {
		console.error('Error fetching single shopping list:', error);
	}
};

export const addShoppingList = (newShoppingList) => async (dispatch) => {
	try {
		const response = await fetch('/api/shoppinglist/new/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newShoppingList),
		});
		const data = await response.json();
		dispatch(addToShoppingList(data));
	} catch (error) {
		console.error('Error adding to shoppinglist:', error);
	}
};

export const updateListName = (id, name) => async (dispatch) => {
	try {
		const response = await fetch(`/api/shoppinglist/update/${id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		});
		const updatedList = await response.json();
		dispatch(updateShoppingListName(updatedList.name, id));
	} catch (error) {
		console.error('Error updating list name:', error);
	}
};

export const addIngredientToList =
	(listId, measuredIngredientId, measuredIngredientDescription) =>
	async (dispatch) => {
		try {
			const payload = {};
			if (measuredIngredientId)
				payload.measured_ingredient_id = measuredIngredientId;
			if (measuredIngredientDescription)
				payload.measured_ingredient_description = measuredIngredientDescription;

			const response = await fetch(
				`/api/shoppinglist/add_ingredient/${listId}/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			const updatedList = await response.json();
			if (response.ok) {
				dispatch(addIngredientToShoppingList(updatedList));
			}
		} catch (error) {
			console.error('Error adding ingredient:', error);
		}
	};

export const addMultipleIngredientsToList =
	(listId, ingredientsObj) => async (dispatch) => {
		try {
			const { ingredients, measuredIngredients } = ingredientsObj;

			if (!Array.isArray(ingredients)) {
				console.error('Error: ingredients is not an array:', ingredients);
				return;
			}

			const parsedIngredients =
				typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;

			const measuredIngredientsArray = Object.entries(measuredIngredients).map(
				([key, value]) => {
					return { description: `${key}: ${value}` };
				}
			);

			const payload = {
				ingredient_ids: parsedIngredients.map((ing) => ing.id),
				measured_ingredients: measuredIngredientsArray,
			};

			const response = await fetch(
				`/api/shoppinglist/add_ingredients/${listId}/`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				}
			);

			const updatedList = await response.json();
			if (response.ok) {
				dispatch(addMultipleIngredientsToShoppingList(updatedList));
			} else {
				console.error('Error from server:', updatedList);
			}
		} catch (error) {
			console.error('Error adding ingredients:', error);
		}
	};

export const createNewListAndAddIngredient =
	(newShoppingList, measuredIngredientId, measuredIngredientDescription) =>
	async (dispatch) => {
		try {
			// Step 1: Create a new shopping list
			const listResponse = await fetch('/api/shoppinglist/new/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newShoppingList),
			});

			const listData = await listResponse.json();
			dispatch(addToShoppingList(listData));

			const listId = listData.id;
			const payload = {};
			if (measuredIngredientId)
				payload.measured_ingredient_id = measuredIngredientId;
			if (measuredIngredientDescription)
				payload.measured_ingredient_description = measuredIngredientDescription;

			const response = await fetch(
				`/api/shoppinglist/add_ingredient/${listId}/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			const updatedList = await response.json();

			if (response.ok) {
				dispatch(addIngredientToShoppingList(updatedList));
			}
		} catch (error) {
			console.error('Error adding ingredient:', error);
		}
	};

export const removeShoppingList = (shoppingListId) => async (dispatch) => {
	try {
		const response = await fetch(
			`/api/shoppinglist/${shoppingListId}/delete/`,
			{
				method: 'DELETE',
			}
		);
		if (response.ok) {
			dispatch(deleteShoppingList(shoppingListId));
		} else {
			console.error('Server Response Error:', response.status);
		}
	} catch (error) {
		console.error('Error deleting shopping list:', error);
	}
};

const initialState = {
	shoppingLists: {},
	singleList: {},
};
const shoppingListReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case GET_SHOPPING_LISTS:
			newState = Object.assign({}, state);
			newState.shoppingLists = action.payload.reduce((acc, list) => {
				acc[list.id] = list;
				return acc;
			}, {});
			return newState;
		case GET_SINGLE_LIST:
			newState = Object.assign({}, state);
			newState.singleList = action.payload;
			return newState;
		case ADD_TO_SHOPPING_LIST:
			return {
				...state,
				shoppingLists: {
					...state.shoppingLists,
					[action.payload.id]: action.payload,
				},
			};
		case ADD_INGREDIENT_TO_LIST:
			return {
				...state,
				shoppingLists: {
					...state.shoppingLists,
					[action.payload.id]: action.payload,
				},
			};
		case UPDATE_SHOPPING_LIST_NAME:
			newState = { ...state };
			newState.shoppingLists = {
				...state.shoppingLists,
				[action.payload.id]: {
					...state.shoppingLists[action.payload.id],
					name: action.payload.name,
				},
			};
			return newState;
		case DELETE_SHOPPING_LIST:
			newState = Object.assign({}, state);
			delete newState.shoppingLists[action.payload];
			return newState;
		case ADD_MULTIPLE_INGREDIENTS_TO_LIST:
			return {
				...state,
				singleList: action.payload,
			};
		default:
			return state;
	}
};

export default shoppingListReducer;
