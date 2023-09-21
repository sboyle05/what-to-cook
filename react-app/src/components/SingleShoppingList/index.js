import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './singleShoppingList.css';
import { fetchSingleList, removeShoppingList } from '../../store/shoppingList';

const SingleShoppingList = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const currentList = useSelector((state) => state.shoppingList?.singleList);
	const measuredIngredients = currentList?.measured_ingredients;
	const history = useHistory();
	const [crossedOff, setCrossedOff] = useState({});

	useEffect(() => {
		dispatch(fetchSingleList(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (measuredIngredients) loadList(measuredIngredients);
	}, [measuredIngredients]);

	const handleCrossOff = (measuredIngredientID) => {
		let key = 'measuredIngredient_' + measuredIngredientID;
		let storedItem = JSON.parse(localStorage.getItem(key));
		setCrossedOff((prev) => {
			let newCrossedOff = {
				...prev,
				[measuredIngredientID]: !prev[measuredIngredientID],
			};
			if (storedItem && storedItem.crossedOff) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify({ crossedOff: true }));
			}
			return newCrossedOff;
		});
	};

	const loadList = (measuredIngredients) => {
		let newCrossedOff = {};
		measuredIngredients.forEach((ingredient) => {
			let key = 'measuredIngredient_' + ingredient.id;
			let storedItem = JSON.parse(localStorage.getItem(key));
			if (storedItem && storedItem.crossedOff) {
				newCrossedOff[ingredient.id] = true;
			}
		});

		setCrossedOff(newCrossedOff);
	};

	useEffect(() => {}, [crossedOff]);

	const handleDelete = async (id) => {
		await dispatch(removeShoppingList(id));
		history.push('/shoppinglist');
	};

	return (
		<>
			<section className='singleListContainer'>
				<h1>{currentList?.name}</h1>
				<section className='measuredIngredientsInList'>
					{measuredIngredients ? (
						measuredIngredients.map((measuredIngredient) => (
							<div
								key={measuredIngredient.id}
								style={{
									display: 'flex',
									alignItems: 'center',
									cursor: 'pointer',
								}}
								onClick={() => handleCrossOff(measuredIngredient.id)}
							>
								<p
									style={{
										textDecoration: crossedOff[measuredIngredient.id]
											? 'line-through'
											: 'none',
									}}
								>
									{measuredIngredient.description}
								</p>
							</div>
						))
					) : (
						<p>No measured ingredients.</p>
					)}
				</section>
				<section className='spcMsgList'>
					{measuredIngredients && measuredIngredients.length > 0 && (
						<h3 id='specialMsg'>click a list item to cross it off</h3>
					)}
				</section>
				<section className='deleteShoppingList'>
					<button id='listDeleteButton' onClick={() => handleDelete(id)}>
						Delete
					</button>
				</section>
			</section>
		</>
	);
};

export default SingleShoppingList;
