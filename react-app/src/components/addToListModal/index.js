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
	const [selectedList, setSelectedList] = useState('');
	const [newListName, setNewListName] = useState('');

	useEffect(() => {
		dispatch(fetchShoppingList());
	}, [dispatch]);

	useEffect(() => {
		return () => {};
	}, []);

	const handleAddIngredient = () => {
		if (newListName.trim()) {
			const newShoppingList = {
				name: newListName,
			};

			dispatch(
				createNewListAndAddIngredient(
					newShoppingList,
					selectedIngredient.id,
					selectedIngredient.description
				)
			);
			setNewListName('');
		} else if (selectedList) {
			dispatch(
				addIngredientToList(
					selectedList,
					selectedIngredient.id,
					selectedIngredient.description
				)
			);
		}
		onClose();
	};

	useEffect(() => {
		if (shoppingLists) {
			const array = Object.values(shoppingLists);
			if (array.length > 0) {
				setSelectedList(array[0].id.toString());
			}
		}
	}, [shoppingLists]);

	return (
		<>
			<div className='backdrop' onClick={onClose} />
			<section
				className='addToListModalContainer'
				onClick={(e) => e.stopPropagation()}
			>
				<h1 className='addToListModalTitle'>Add To List</h1>

				<select
					id='addToListSelect'
					value={selectedList}
					onChange={(e) => setSelectedList(e.target.value)}
				>
					<option value='' disabled>
						Select a list
					</option>
					{shoppingListArray.map((list, index) => (
						<option key={list.id + '-' + index} value={list.id}>
							{list.name}
						</option>
					))}
				</select>

				<input
					id='createNewListInput'
					type='text'
					placeholder='Or type new list name'
					value={newListName}
					onChange={(e) => setNewListName(e.target.value)}
				/>

				<button
					onClick={handleAddIngredient}
					id='ingAddToListButton'
					disabled={shoppingListArray.length === 0 && !newListName.trim()}
				>
					Add
				</button>
			</section>
		</>
	);
};

export default AddToListModal;
