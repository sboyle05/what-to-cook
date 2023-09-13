import React, { useState, useEffect } from "react";
import './updateMealPlannerModal.css'
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateMealPlanner } from "../../store/mealPlanner";
import { deleteMealPlanner } from "../../store/mealPlanner";

const UpdateMealPlannerModal = ({ recipeId, userId}) => {
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

        const data = await dispatch(updateMealPlanner(newMealData))

        if (data) {
            setErrors(data);
        } else {
            closeModal()
        }
    }

    const handleDelete = async () => {
        await dispatch(deleteMealPlanner(recipeId));
        closeModal();
    }


    return (
        <>
        <div className='update-modal-backdrop'></div>
        <section className="mealPlannerModalContainer">
            <h2 className="modalTitle">Update Your Meal Planner</h2>
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
                <button type="submit">Update</button>
            </form>
                <button onClick={handleDelete}>Remove from Meal Planner</button>
                <button onClick={closeModal}>Cancel</button>
        </section>

        </>
    )



}


export default UpdateMealPlannerModal
