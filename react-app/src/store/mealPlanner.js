

//action types
const GET_MEAL_PLANNER = 'GET_MEAL_PLANNER';
const ADD_TO_MEAL_PLANNER = 'ADD_TO_MEAL_PLANNER';
const UPDATE_MEAL_PLANNER = 'UPDATE_MEAL_PLANNER';
const DELETE_MEAL_PLANNER = 'DELETE_MEAL_PLANNER';

//action creators

export const getMealPlanner = (data) => ({
    type: GET_MEAL_PLANNER,
    payload: data,
})

export const addToMealPlanner = (data) => ({
    type: ADD_TO_MEAL_PLANNER,
    payload: data,
})

export const updateMealPlanner = (data) => ({
    type: UPDATE_MEAL_PLANNER,
    payload: data,
})

export const deleteMealPlanner = (id) => ({
    type: DELETE_MEAL_PLANNER,
    payload: id
})

//thunks

export const fetchMealPlanner = () => async (dispatch) => {
    try{
        const response = await fetch('/api/mealplanner/');
        const data = await response.json();
        console.log("FETCH MEAL PLANNER DATA*************", data)
        dispatch(getMealPlanner(data));
    } catch (error) {
        console.error("Error fetching meal planner:", error)
    }
}

export const addMealPlanner = (newMealData) => async (dispatch) => {
    try{
        const response = await fetch('/api/mealplanner/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMealData)
        });

        const data = await response.json();

        dispatch(addToMealPlanner(data));
    } catch (error) {
        console.error("Error adding to mealplanner:", error)
    }
}

export const editMealPlanner = (mealPlanData, updatedData) => async (dispatch) => {
    try {
        const mealPlanId = mealPlanData.id;
        const response = await fetch(`/api/mealplanner/${mealPlanId}/edit/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })

        const data = await response.json();
        dispatch(updateMealPlanner(data));
        dispatch(fetchMealPlanner())
    } catch (error) {
        console.error("Error updating meal:", error);
    }
}

export const removeMealPlanner = (mealPlanId) => async (dispatch) => {
    try{
        const response = await fetch(`/api/mealplanner/${mealPlanId}/delete/`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log("Server Response:", data);

        if (!response.ok) {
            console.error("Server Response Error:", response.status);
            return;
        }

        dispatch(deleteMealPlanner(mealPlanId));
    } catch (error) {
        console.error("Error deleting meal:", error);
    }
}


const initialState = {mealPlanner: []}

const mealPlannerReducer = (state = initialState, action) => {
        switch (action.type) {
            case GET_MEAL_PLANNER:
                return {
                    ...state,
                    mealPlanner: [...state.mealPlanner, action.payload]
                };
            case ADD_TO_MEAL_PLANNER:
                return {
                    ...state,
                    mealPlanner: [...state.mealPlanner, action.payload]
                };
            case UPDATE_MEAL_PLANNER: {
                const updatedMealPlanner = state.mealPlanner.map(mealPlan => {
                    if (mealPlan.id === action.payload.id) {
                        return action.payload;
                    }
                    return mealPlan;
                });
                return {
                    ...state,
                    mealPlanner: updatedMealPlanner
                };
            }
            case DELETE_MEAL_PLANNER: {
                const updatedMealPlanner = state.mealPlanner.filter(mealPlan => mealPlan.id !== action.payload);
                return {
                    ...state,
                    mealPlanner: updatedMealPlanner
                };
            }

            default:
                return state;
        }
    };

    export default mealPlannerReducer;