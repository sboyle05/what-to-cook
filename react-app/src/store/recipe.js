const GET_RECIPES = '/search';
const SELECT_INGREDIENT = 'SELECT_INGREDIENT';
const DESELECT_INGREDIENT = 'DESELECT_INGREDIENT';


export const selectIngredient = (ingredient) => ({
    type: SELECT_INGREDIENT,
    payload: ingredient
})

export const deselectIngredient = (ingredient) => ({
    type: DESELECT_INGREDIENT,
    payload: ingredient
})

const getRecipes = (data) => {
    return {
        type: GET_RECIPES,
        payload: data,
    }
}

export const searchRecipes = (searchData) => async (dispatch) => {
    try {
        console.log("*********searchDATA",searchData)
        const ingredientsString = searchData.map((obj) => obj.name).join(',');
        console.log("******************ingredientsString", ingredientsString)
        const response = await fetch(`/api/recipes/search/?ingredients=${encodeURIComponent(ingredientsString)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      });
      if (response.ok){
        const data = await response.json();
        console.log("data in store*********************",data)
        dispatch(getRecipes(data.recipes || []));
        return data;
      } else {
        const errors = await response.json();
        return errors;
      }
    } catch (error) {
      const errors = (error && typeof error.json === 'function') ? await error.json() : { message: error.toString()};
      return errors;
    }
  };


const initialState = { allRecipes: [], singleRecipe: {}, selectIngredients: []};
const recipeReducer = (state=initialState, action) => {

    switch(action.type){
        case GET_RECIPES:
            return { ...state, allRecipes: action.payload };
        case SELECT_INGREDIENT:
            return { ...state, selectIngredients: [...state.selectIngredients, action.payload]}
        case DESELECT_INGREDIENT:
            return { ...state, selectIngredients: state.selectIngredients.filter(i => i !== action.payload) };
        default:
            return state;
    }
}

export default recipeReducer
