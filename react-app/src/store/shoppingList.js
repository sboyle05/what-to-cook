//action types
const GET_SHOPPING_LIST = 'GET_SHOPPING_LIST';
const ADD_TO_SHOPPING_LIST = 'ADD_TO_SHOPPING_LIST';
const DELETE_SHOPPING_LIST = 'DELETE_SHOPPING_LIST';

//action creators

export const getShoppingList = (data) => ({
  type: GET_SHOPPING_LIST,
  payload: data,
})

export const addToShoppingList = (data) => ({
  type: ADD_TO_SHOPPING_LIST,
  payload: data,
})

export const deleteShoppingList = (id) => ({
  type: DELETE_SHOPPING_LIST,
  payload: id
})

//thunks

export const fetchShoppingList = () => async (dispatch) => {
  try{
    const response = await fetch('/api/shoppinglist/');
    const data = await response.json();
    dispatch(getShoppingList(data));
  } catch (error) {
    console.error('Error fetching shopping list:', error);
  }
};

export const addShoppingList = (newShoppingList) => async (dispatch) => {
  try{
    const response = await fetch('/api/shoppinglist/new/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newShoppingList)
    });
    const data = await response.json();
    dispatch(addToShoppingList(data));
  } catch (error) {
    console.error('Error adding to shoppinglist:', error)
  }
};

export const removeShoppingList = (shoppingListId) => async (dispatch) => {
  try{
    const response = await fetch(`/api/shoppinglist/${shoppingListId}/delete/`,{
      method: 'DELETE',
    });
    if (response.ok) {
      dispatch(deleteShoppingList(shoppingListId));
    } else {
      console.error('Server Response Error:', response.status);
    }
  } catch (error) {
    console.error('Error deleting shopping list:', error);
  }
}

// const shoppingListReducer = ( state = {}, action) => {
//   switch (action.type){
//     case GET_SHOPPING_LIST:
//       const shoppingListState = {};
//       action.sh
//   }
// }
