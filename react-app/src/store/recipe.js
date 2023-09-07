const GET_RECIPES = '/search'


const getRecipes = (data) => {
    return {
        type: GET_RECIPES,
        payload: data,
    }
}

export const searchRecipes = (searchData) => async (dispatch) => {
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData)
        });
        if (response.ok){
            const data = await response.json();
            dispatch(getRecipes(data));
            return data
        } else {
            const errors = await response.json();
            return errors
        }
    } catch (error) {
        const errors = (error && typeof error.json === 'function') ? await error.json() : { message: error.toString()};
        return errors
    }
}


const initialState = { allRecipes: {}, singleRecipe: {}}
const recipeReducer = (state=initialState, action) => {
    let newState;
    switch(action.type){
        case GET_RECIPES:
            newState = Object.assign({ ...state })
            newState.allRecipes = action.payload;
            return newState;
        default:
            return state;
    }
}

export default recipeReducer
