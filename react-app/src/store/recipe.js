const GET_RECIPES = '/search';
const SELECT_INGREDIENT = 'SELECT_INGREDIENT';
const DESELECT_INGREDIENT = 'DESELECT_INGREDIENT';
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE';


export const selectIngredient = (ingredient) => ({
    type: SELECT_INGREDIENT,
    payload: ingredient
});

export const deselectIngredient = (ingredient) => ({
    type: DESELECT_INGREDIENT,
    payload: ingredient
});

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


export const fetchSingleRecipe = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        console.log("*********SINGLE RECIPE FETCH************", response)
        console.log("*****************SINGLE RECIPE DATA**********", data)
        dispatch(getSingleRecipe(data));
    } catch(error){
        console.error("Error fetching single recipe:", error)
    }
}

export const searchRecipes = (selectedIngredients, exactMatch, extraCount) => async (dispatch) => {
    try {
        const ingredientList = selectedIngredients.join(',');
        console.log()
        let url = `/api/search/?ingredients=${encodeURIComponent(ingredientList)}`;
        if (exactMatch) {
            url += `&exact=true`;
        } else if (extraCount) {
            url += `&extra_count=${extraCount}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        console.log("***********data from fetch***********", data)
        dispatch(getRecipes(data.recipes || []));
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
};

const initialState = { allRecipes: [], singleRecipe: {}, selectIngredients: []};

const recipeReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_RECIPES:
            return { ...state, allRecipes: action.payload };
        case SELECT_INGREDIENT:
            return { ...state, selectIngredients: [...state.selectIngredients, action.payload]};
        case DESELECT_INGREDIENT:
            return { ...state, selectIngredients: state.selectIngredients.filter(i => i !== action.payload) };
        case GET_SINGLE_RECIPE:
            return { ...state, singleRecipe: action.payload};
        default:
            return state;
    }
}

export default recipeReducer;
