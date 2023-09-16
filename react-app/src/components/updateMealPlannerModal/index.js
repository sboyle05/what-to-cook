import React, { useState, useEffect } from "react";
import './updateMealPlannerModal.css'
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { editMealPlanner } from "../../store/mealPlanner";
import { removeMealPlanner } from "../../store/mealPlanner";
import { fetchMealPlanner } from "../../store/mealPlanner";

const UpdateMealPlannerModal = ({ mealPlanner, userId, refetch, onClose }) => {
    const [date, setDate] = useState("");
    const [mealType, setMealType] = useState('Breakfast');
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const {closeModal} = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mealPlanner) {
            console.error("mealPlanner is undefined.");
            return;
        }
        const newMealData = {
          id: mealPlanner.id,
          user_id: userId,
          date,
          meal_type: mealType.toLowerCase(),
          recipe_id: mealPlanner.recipe_id
        };
        const data = await dispatch(editMealPlanner(newMealData, newMealData));

        if (data) {
            setErrors(data);
        } else {
            refetch()
            onClose()
        }
    }

    const handleDelete = async () => {
        await dispatch(removeMealPlanner(mealPlanner.id));
        onClose();
        refetch();
    }

    useEffect(() => {
        if(mealPlanner) {
            const dateObj = new Date(mealPlanner.date);
            const year = dateObj.getUTCFullYear();
            const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getUTCDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setDate(formattedDate);
            setMealType(mealPlanner.meal_type.toLowerCase());
        }
    }, [mealPlanner]);

    return (
        <>
         <div className='update-modal-backdrop' onClick={onClose}></div>
        <section className="mealPlannerModalContainer" onClick={e => e.stopPropagation()}>
            <h2 className="modalTitle">Update Your Meal Planner</h2>
            <form onSubmit={handleSubmit}>
            <section className="updateToMpLabel_Input">
                <label id="updateToMPLabel">
                    Date:
                </label><br/>
                <input id="updateToMpInput" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </section>
                <section className="updateToMpLabel_Input">
                <label id="updateToMPLabel">
                    Meal Type:
                </label><br/>
                <select id="updateToMpInput" value={mealType} onChange={(e) =>
                    setMealType(e.target.value)}>
                    <option value="breakfast">Breakfast</option>
                    <option value="brunch">Brunch</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                </select>
                </section>
                <section className="updateToMPContainer">
                <button id="updateToMPButton" type="submit">Update</button>
                </section>
            </form>
                <button id="removeMPButton" onClick={handleDelete}>Remove from Meal Planner</button>
                <section className="cancelContainer">
                <button id="cancelMPButton" onClick={onClose}>Cancel</button>
                </section>
        </section>

        </>
    )

}

export default UpdateMealPlannerModal
