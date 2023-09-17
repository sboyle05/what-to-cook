import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { updateRecipeInBox, fetchRecipeBox } from '../../store/recipeBox';
import IngredientSearch from '../IngredientSearch';
import './updateRecipeForm.css';

const UpdateRecipe = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();
	const existingRecipe = useSelector((state) =>
		state.recipeBox.recipesInBox.find((recipe) => recipe.id === Number(id))
	);
	const [name, setName] = useState(existingRecipe ? existingRecipe.name : '');
	const [isValidForm, setIsValidForm] = useState(false);
	const [directions, setDirections] = useState(
		existingRecipe ? existingRecipe.directions : ''
	);
	const [measuredIngredients, setMeasuredIngredients] = useState(
		existingRecipe
			? existingRecipe.measured_ingredients.map((m) => m.description)
			: []
	);
	const [selectedIngredients, setSelectedIngredients] = useState(
		existingRecipe ? existingRecipe.ingredients.map((i) => i.name) : []
	);
	const [customIngredients, setCustomIngredients] = useState([]);

	useEffect(() => {
		if (existingRecipe) {
			setName(existingRecipe.name);
			setDirections(existingRecipe.directions);
			setMeasuredIngredients(
				existingRecipe.measured_ingredients.map((m) => m.description)
			);
			setSelectedIngredients(existingRecipe.ingredients.map((i) => i.name));
		} else {
			dispatch(fetchRecipeBox());
		}
	}, [existingRecipe, dispatch]);

	useEffect(() => {
		const allIngredients = [
			...selectedIngredients,
			...customIngredients.map((ing) => ing.name),
		];

		setMeasuredIngredients((prevMeasured) => {
			const newMeasuredIngredients = allIngredients.map((ingredientName) => {
				const existingMeasured = prevMeasured.find(
					(m) => m.split(':')[0].trim() === ingredientName
				);

				return existingMeasured || `${ingredientName}: `;
			});

			return newMeasuredIngredients;
		});
	}, [selectedIngredients, customIngredients]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const measuredIngredientsArray = measuredIngredients.map((description) => {
			return { description };
		});

		const newRecipeData = {
			id: Number(id),
			name,
			directions,
			measuredIngredients: measuredIngredientsArray,
			ingredients: [
				...selectedIngredients,
				...customIngredients.map((ci) => ci.name),
			].map((name) => ({ name })),
		};

		dispatch(updateRecipeInBox(Number(id), newRecipeData))
			.then(() => {
				history.push(`/recipes/${id}`);
			})
			.catch((error) => {
				console.error('Failed to update the recipe:', error);
			});
	};

	const addSearchIngredient = (ingredient) => {
		setSelectedIngredients([...selectedIngredients, ingredient]);
	};

	const removeSearchIngredient = (ingredientToRemove) => {
		const newSelectedIngredients = selectedIngredients.filter(
			(ingredient) => ingredient !== ingredientToRemove
		);
		setSelectedIngredients(newSelectedIngredients);
	};

	const addCustomIngredient = () => {
		setCustomIngredients([...customIngredients, { name: '' }]);
	};

	const handleCustomIngredientChange = (index, event) => {
		const newCustomIngredients = [...customIngredients];
		newCustomIngredients[index][event.target.name] = event.target.value;
		setCustomIngredients(newCustomIngredients);
	};

	useEffect(() => {
		setIsValidForm(
			name.trim().length >= 2 &&
				directions.trim().length >= 3 &&
				(customIngredients.length > 0 || selectedIngredients.length > 0)
		);
	}, [name, directions, customIngredients, selectedIngredients]);

	return (
		<section className='updateRecipeFormContainer'>
			<h1>Update Your Recipe</h1>
			<form onSubmit={handleSubmit}>
				<section className='formLabelInput'>
					<label id='recipeNameLabel'>Recipe Name:</label>
					<input
						id='recipeNameInput'
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</section>
				<section className='formLabelInput'>
					<label id='recipeDirectionsLabel'>Directions:</label>
					<textarea
						id='recipeTextAreaInput'
						value={directions}
						onChange={(e) => setDirections(e.target.value)}
					/>
				</section>
				<section className='formLabelInput'>
					<fieldset>
						<legend id='newRecipeSearchForIngredients'>Search for Ingredients</legend>
						<section className='newRecipeIngredientSearchSection'>
							<IngredientSearch
								className='newRecipeIngredientSearch'
								addIngredient={addSearchIngredient}
								selectedIngredients={selectedIngredients}
								removeIngredient={removeSearchIngredient}
							/>
							{selectedIngredients.length > 0 ? (
								<span id='specialMsg'>click on an ingredient to remove it</span>
							) : null}
						</section>
					</fieldset>
				</section>
				<section className='formLabelInput'>
					<fieldset>
						<legend>Couldn't find your ingredient? Add it below:</legend>
						{customIngredients.map((ingredient, index) => (
							<div key={index}>
								<label>
									Ingredient {index + 1}:
									<input
										type='text'
										name='name'
										value={ingredient.name}
										onChange={(event) => handleCustomIngredientChange(index, event)}
										required
									/>
								</label>
							</div>
						))}
						<button id='addCustomButton' type='button' onClick={addCustomIngredient}>
							Add Custom Ingredient
						</button>
					</fieldset>
				</section>
				<section className='formLabelInput'>
					<fieldset>
						<legend>Measured Ingredients</legend>
						{measuredIngredients.map((ingredientDesc, index) => (
							<div key={index}>
								<label>
									{ingredientDesc.split(':')[0]}:
									<input
										type='text'
										value={ingredientDesc.split(':')[1].trimStart()}
										onChange={(event) => {
											const newValue = event.target.value;
											setMeasuredIngredients((prevMeasured) => {
												const newMeasured = [...prevMeasured];
												const currentIngredient = newMeasured[index].split(':')[0];
												newMeasured[index] = `${currentIngredient}: ${newValue}`;
												return newMeasured;
											});
										}}
										required
									/>
								</label>
							</div>
						))}
					</fieldset>
				</section>
				<section className='newRecipeSubmitContainer'>
					<button id='submitNewRecipeButton' type='submit' disabled={!isValidForm}>
						{isValidForm ? 'Update Recipe' : 'Complete Form To Submit'}
					</button>
				</section>
			</form>
		</section>
	);
};

export default UpdateRecipe;
