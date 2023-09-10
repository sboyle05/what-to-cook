// action types
const GET_RECIPE_BOX = 'GET_RECIPE_BOX';
const ADD_TO_RECIPE_BOX = 'ADD_TO_RECIPE_BOX';
const UPDATE_RECIPE_BOX = 'UPDATE_RECIPE_BOX';
const DELETE_FROM_RECIPE_BOX = 'DELETE_FROM_RECIPE_BOX'


//action creators
export const getRecipeBox = (data) => ({
    type: GET_RECIPE_BOX,
    payload: data,
});

export const addToRecipeBox = (data) => ({
    type: ADD_TO_RECIPE_BOX,
    payload: data,
});

export const updateRecipeBox = (data) => ({
    type: UPDATE_RECIPE_BOX,
    payload: data,
});

export const deleteFromRecipeBox = (id) => ({
    type: DELETE_FROM_RECIPE_BOX,
    payload: id,
});

//thunks
export const fetchRecipeBox = () => async (dispatch) => {
    try{
        const response = await fetch('/api/recipebox/');
        const data = await response.json();
        dispatch(getRecipeBox(data));
    } catch (error){
        console.error("Error fetching recipe box:", error)
    }
}

export const addRecipeToBox = (recipeData) => async (dispatch) => {
    try {
        const response = await fetch('/api/recipebox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData),
        });
        const data = await response.json();
        dispatch(addToRecipeBox(data));
    } catch (error) {
        console.error("Error adding recipe to Recipe Box:", error);
    }
};

export const updateRecipeInBox = (recipeId, updatedData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/recipebox/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        dispatch(updateRecipeBox(data));
    } catch (error) {
        console.error("Error updating recipe in Recipe Box", error);
    }
};

export const deleteRecipeFromBox = (recipeId) => async (dispatch) => {
    try {
        await fetch(`/api/recipebox/${recipeId}`, {
            method: 'DELETE',
        });
        dispatch(deleteFromRecipeBox(recipeId));
    } catch (error) {
        console.error("Error deleting recipe from Recipe Box", error);
    }
};

const initialState = { recipesInBox: [], };

//reducer

const recipeBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_RECIPE_BOX:
            return { ...state, recipesInBox: action.payload};
        case ADD_TO_RECIPE_BOX:
            return { ...state, recipesInBox: [...state.recipesInBox, action.payload]};
        case UPDATE_RECIPE_BOX:
            return { ...state,
                    recipesInBox: state.recipesInBox.map((recipe) =>
                        recipe.id === action.payload.id ? action.payload : recipe
                        ),
                    };
        case DELETE_FROM_RECIPE_BOX:
            return { ...state, recipesInBox: state.recipesInBox.filter((recipe) => recipe.id !== action.payload)};
        default:
            return state;
    }
}

export default recipeBoxReducer;
