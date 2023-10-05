import React, { useState, useEffect } from 'react';
import { useDispatch} from "react-redux";
import './addItemsToListModal.css'
import { addMultipleIngredientsToList } from "../../store/shoppingList";
import { useModal } from '../../context/Modal';
import IngredientSearch from '../IngredientSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const AddItemsToListModal = ({currentList}) => {
  const dispatch = useDispatch();
  const [customIngredients, setCustomIngredients] = useState([]);
	const [measuredIngredients, setMeasuredIngredients] = useState({});
	const [selectedIngredients, setSelectedIngredients] = useState([]);
  const { closeModal } = useModal();

  useEffect(() => {
		const allIngredientNames = [
			...customIngredients.map((ingredient) => ingredient.name),
			...selectedIngredients,
		].filter((ingredientName) => ingredientName);
		const newMeasuredIngredients = {};
		allIngredientNames.forEach((ingredientName) => {
			newMeasuredIngredients[ingredientName] =
				measuredIngredients[ingredientName] || '';
		});
		setMeasuredIngredients(newMeasuredIngredients);
	}, [customIngredients, selectedIngredients]);

const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedListData = {
    ingredients: [
      ...customIngredients,
      ...selectedIngredients.map((ingredient) => ({ name: ingredient })),
    ],
    measuredIngredients,
  };
  if (updatedListData.length === 0) {
    console.error('No ingredients to add.');

    return;
  }

  try {
      await dispatch(addMultipleIngredientsToList(currentList.id, updatedListData));
  } catch (error) {
      console.error('Failed to update the shopping list:', error);
  }

  closeModal();
};
  const handleCustomIngredientChange = (index, event) => {
		const newCustomIngredients = [...customIngredients];
		newCustomIngredients[index][event.target.name] = event.target.value;
		setCustomIngredients(newCustomIngredients);
	};

	const handleMeasuredIngredientChange = (ingredient, event) => {
		const newMeasuredIngredients = { ...measuredIngredients };
		newMeasuredIngredients[ingredient] = event.target.value;
		setMeasuredIngredients(newMeasuredIngredients);
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
	const removeCustomIngredient = (indexToRemove) => {
		const newCustomIngredients = customIngredients.filter(
			(_, index) => index !== indexToRemove
		);
		setCustomIngredients(newCustomIngredients);
	};

  return (
    <>
    <section className='addItemsToListContainer'>
    <h1 id='addItemsToExistingList'>Add Items To {currentList.name} List</h1>
    <form onSubmit={handleSubmit}>
    <section className='formLabelInput'>
								<fieldset>
									<legend id='newRecipeSearchForIngredients'>
										Search for Ingredients
									</legend>
									<section className='newRecipeIngredientSearchSection'>
										<IngredientSearch
											className='newRecipeIngredientSearch'
											addIngredient={addSearchIngredient}
											selectedIngredients={selectedIngredients}
											removeIngredient={removeSearchIngredient}
										/>
										{selectedIngredients.length > 0 ? (
											<span id='specialMsg'>
												click on an ingredient to remove it
											</span>
										) : null}
									</section>
								</fieldset>
							</section>

							<section className='formLabelInput'>
								<fieldset className='customIngFS'>
									<legend className='customTitleNewRecipe'>
										Couldn't find your ingredient? Add it below:
									</legend>
									{customIngredients.map((ingredient, index) => (
										<div key={index}>
											<div className='label-input-wrapper'>
												<label id='customIngLabel'>
													Ingredient {index + 1}:
												</label>
												<input
													type='text'
													name='name'
													id='customIngInput'
													value={ingredient.name}
													onChange={(event) =>
														handleCustomIngredientChange(index, event)
													}
													required
												/>
												<FontAwesomeIcon
													id='removeCustomIngButton'
													icon={faTrash}
													style={{ color: '#ffffff', cursor: 'pointer' }}
													onClick={() => removeCustomIngredient(index)}
												/>
											</div>
										</div>
									))}
									<section className='addCustomButtonContainer'>
										<button
											id='addCustomButton'
											type='button'
											onClick={addCustomIngredient}
										>
											Add Custom Ingredient
										</button>
									</section>
								</fieldset>
							</section>

							<section className='formLabelInput'>
								<fieldset>
									<legend>Ingredient Quantities</legend>
									{Object.keys(measuredIngredients).map((ingredient, index) => (
										<div id='measuredIngContainer' key={index}>
											<label className='measuredIngLabelNR'>
												{ingredient}:
											</label>
											<input
												type='text'
												placeholder='example: 1 dozen'
												className='measuredIngInputNR'
												value={measuredIngredients[ingredient]}
												onChange={(event) =>
													handleMeasuredIngredientChange(ingredient, event)
												}
												required
											/>
										</div>
									))}
								</fieldset>
							</section>
              <section className='addingToListSubmit'>
              <button
						disabled={selectedIngredients.length === 0 && customIngredients.length ===0}
						id='createNewListButton'
						type='submit'
					>
						Add To List

					</button>
          </section>
    </form>
    </section>
    </>
  )

};

export default AddItemsToListModal;
