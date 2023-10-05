import React, { useState } from 'react';
import './addToMealPlanner.css';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import { addMealPlanner } from '../../store/mealPlanner';

const MealPlannerModal = ({ recipeId, userId }) => {
	const [date, setDate] = useState('');
	const [mealType, setMealType] = useState('Breakfast');
	const dispatch = useDispatch();
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!date) {
			setErrors(['Please select a date']);
			return;
		}
		const newMealData = {
			user_id: userId,
			date,
			meal_type: mealType.toLowerCase(),
			recipe_id: recipeId,
		};
		const data = await dispatch(addMealPlanner(newMealData));
		if (data) {
			setErrors(data);
		} else {
			closeModal();
		}
	};

	return (
		<>
			<section className='addToMealPlannerModalContainer'>
				<h2 className='modalTitle'>Add to Meal Planner</h2>
				{errors.length > 0 && (
					<ul className='addto-error-list'>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
				<form onSubmit={handleSubmit}>
					<section className='addToMpLabel_Input'>
						<label id='addToMPLabel'>Date:</label>
						<br />
						<input
							id='addToMpInput'
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</section>
					<section className='addToMpLabel_Input'>
						<label id='addToMPLabel'>Meal Type:</label>
						<br />
						<select
							id='addToMpInput'
							value={mealType}
							onChange={(e) => setMealType(e.target.value)}
						>
							<option value='breakfast'>Breakfast</option>
							<option value='brunch'>Brunch</option>
							<option value='lunch'>Lunch</option>
							<option value='dinner'>Dinner</option>
							<option value='snack'>Snack</option>
							<option value='dessert'>Dessert</option>
						</select>
					</section>
					<section className='addToMPContainer'>
						<button id='addToMPButton' type='submit'>
							Add to Meal Planner
						</button>
					</section>
				</form>
			</section>
		</>
	);
};

export default MealPlannerModal;
