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

	const handleCrossOff = (ingredientId) => {
		setCrossedOff({
			...crossedOff,
			[ingredientId]: !crossedOff[ingredientId],
		});
	};

	const handleDelete = async (id) => {
		await dispatch(removeShoppingList(id));
		history.push('/shoppinglist');
	};
  console.log("measured ingredient outside of return", measuredIngredients)
	return (
		<>
			<section className='singleListContainer'>
				<h1>{currentList?.name}</h1>
				<section className='measuredIngredientsInList'>
					{console.log('measuredIngredients*******************', measuredIngredients)}
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
							>{console.log("measured ingredient ID IN MAP",measuredIngredient.id)}
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
