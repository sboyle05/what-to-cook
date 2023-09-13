import React, { useState, useEffect } from "react";
import './addToMealPlanner.css'
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { addMealPlanner } from '../../store/mealPlanner';


const MealPlannerModal = ({ recipeId, userId}) => {
    const [date, setDate] = useState("");
    const [mealType, setMealType] = useState('Breakfast');
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const {closeModal} = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMealData = {
            user_id: userId,
            date,
            meal_type: mealType.toLowerCase(),
            recipe_id: recipeId
        };

        const data = await dispatch(addMealPlanner(newMealData))

        if (data) {
            setErrors(data);
        } else {
            closeModal()
        }
    }

    return (
        <>
        <section className="mealPlannerModalContainer">
            <h2 className="modalTitle">Add to Meal Planner</h2>
            <form onSubmit={handleSubmit}>

                <label>
                    Date:
                </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>
                    Meal Type:
                </label>
                <select value={mealType} onChange={(e) =>
                    setMealType(e.target.value)}>
                    <option value="breakfast">Breakfast</option>
                    <option value="brunch">Brunch</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                </select>
                <button type="submit">Add to Meal Planner</button>
            </form>

        </section>

        </>
    )



}


export default MealPlannerModal