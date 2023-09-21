import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './addToListModal.css';
import {
	fetchShoppingList,
	addIngredientToList,
	createNewListAndAddIngredient,
} from '../../store/shoppingList';

const AddToListModal = ({ selectedIngredient, onClose }) => {
	const shoppingLists = useSelector(
		(state) => state.shoppingList?.shoppingLists
	);
	const shoppingListArray = shoppingLists ? Object.values(shoppingLists) : [];
	const dispatch = useDispatch();
	const [selectedList, setSelectedList] = useState(null);
	const [newListName, setNewListName] = useState('');
	console.log('****shoppingLists', shoppingLists);

	useEffect(() => {
		dispatch(fetchShoppingList());
	}, [dispatch]);

	useEffect(() => {
		console.log('Component mounted');
		return () => {
			console.log('Component will unmount');
		};
	}, []);

	console.log('selected list***', selectedList);
	console.log('selected ingredient****', selectedIngredient);
	const handleAddIngredient = () => {
		console.log('FIRST LINE IN HANDLE', selectedIngredient);
		if (selectedList) {
			console.log(
				'****LIST AND INGREDIENT***',
				selectedList,
				selectedIngredient
			);
			dispatch(
				addIngredientToList(
					selectedList,
					selectedIngredient.id,
					selectedIngredient.description
				)
			);
		} else if (newListName) {
			console.log('newlistName', newListName);
			console.log('****selected ING else ID**', selectedIngredient.id);
			console.log('****selected ING DESCR', selectedIngredient.description);
			const newShoppingList = {
				name: newListName,
			};
			console.log('About to dispatch with ingredient: ', selectedIngredient);
			dispatch(
				createNewListAndAddIngredient(
					newShoppingList,
					selectedIngredient.id,
					selectedIngredient.description
				)
			);
		}
		onClose();
	};

	return (
		<>
			<section className='addToListModalContainer'>
				<h1 className='addToListModalTitle'>Add To List</h1>

				{/* Existing lists dropdown */}
				<select onChange={(e) => setSelectedList(e.target.value)}>
					<option value=''>Select a list</option>
					{shoppingListArray.map((list, index) => (
						<option key={list.id + '-' + index} value={list.id}>
							{list.name}
						</option>
					))}
				</select>

				{/* New list input */}
				<input
					type='text'
					placeholder='Or type new list name'
					value={newListName}
					onChange={(e) => setNewListName(e.target.value)}
				/>

				{/* Confirm button */}
				<button onClick={handleAddIngredient}>Add</button>
			</section>
		</>
	);
};

export default AddToListModal;
