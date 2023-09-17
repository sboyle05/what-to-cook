import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { fetchSingleRecipe, finalDeleteRecipe } from '../../store/recipe';
import {
	deleteRecipeFromBox,
	addExistingRecipeToBox,
	deleteFromRecipeBox,
} from '../../store/recipeBox';
import './singleRecipe.css';

const SingleRecipeComponent = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const currentRecipe = useSelector((state) => state.recipes.singleRecipe);
	const recipesInBox = useSelector((state) => state.recipeBox.recipesInBox);
	const user = useSelector((state) => state.session.user);
	const history = useHistory();
	const [fetchStatus, setFetchStatus] = useState('idle');

	useEffect(() => {
		console.log('recipesInBox:', recipesInBox);
		dispatch(fetchSingleRecipe(id))
			.then((data) => {
				if (data) {
					setFetchStatus('done');
				} else {
					setFetchStatus('error');
				}
			})
			.catch(() => {
				setFetchStatus('error');
			});
	}, [dispatch, id, recipesInBox]);

	useEffect(() => {
		if (fetchStatus === 'error') {
			history.push('/going-nowhere-fast');
		}
	}, [fetchStatus, history]);

	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const isRecipeInBox = () => {
		return Object.values(recipesInBox).some(
			(recipe) => recipe.id === Number(id)
		);
	};

	const handleAddToRecipeBox = () => {
		dispatch(addExistingRecipeToBox(currentRecipe));
	};

	const removeFromBox = async (id) => {
		await dispatch(deleteRecipeFromBox(id));
		history.push('/recipebox');
	};

	const handleDelete = async (id) => {
		await dispatch(finalDeleteRecipe(id));
		dispatch(deleteFromRecipeBox(id));
		history.push('/recipebox');
	};

	return (
		<>
			{currentRecipe ? (
				<section className='singleRecipeContainer'>
					<h1>{currentRecipe.name}</h1>
					<section className='recipeIngredientSection'>
						<h3 id='numberIngredients'>
							{currentRecipe.ingredients ? currentRecipe.ingredients.length : 0}{' '}
							Ingredients
						</h3>
						<ol className='measuredIngredientsList'>
							{currentRecipe.measured_ingredients
								? currentRecipe.measured_ingredients.map(
										(ingredient, index) => <li key={index}>{ingredient}</li>
								  )
								: null}
						</ol>
					</section>
					<section className='recipeDirections'>
						<h3 id='recipeDirectionsH3'>Directions</h3>
						<ol>
							{currentRecipe.directions
								? (() => {
										try {
											const parsedDirections = JSON.parse(
												currentRecipe.directions
											);
											return parsedDirections.flatMap((direction, index) => {
												const steps = direction
													.split(/\.|;/)
													.filter((step) => step.trim() !== '');

												return steps.map((step, subIndex) => (
													<li
														id='individualdirection'
														key={`${index}-${subIndex}`}
													>
														{capitalizeFirstLetter(step.trim())}
													</li>
												));
											});
										} catch (error) {
											return <li>{currentRecipe.directions}</li>;
										}
								  })()
								: null}
						</ol>
					</section>
					{user && (
						<>
							{isRecipeInBox() ? (
								<>
									{currentRecipe.user_id === user.id && (
										<>
											<NavLink
												className='updateNavBut'
												exact
												to={`/recipebox/update/${id}`}
											>
												<button id='recipeUpdateButton'>Update</button>
											</NavLink>
											<button
												id='recipeDeleteButton'
												onClick={() => handleDelete(id)}
											>
												Delete
											</button>
										</>
									)}
									<button
										id='removeFromRecipeBoxButton'
										onClick={() => removeFromBox(id)}
									>
										Remove from Box
									</button>
								</>
							) : (
								<button
									id='addtorecipeboxbutton'
									onClick={handleAddToRecipeBox}
								>
									Add to Recipe Box
								</button>
							)}
						</>
					)}
				</section>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
};

export default SingleRecipeComponent;
