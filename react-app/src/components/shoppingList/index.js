import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './shoppingList.css';
import OpenModalButton from '../OpenModalButton';
import NewShoppingListModal from '../newShoppingListModal';
import { fetchShoppingList } from '../../store/shoppingList';

const ShoppingList = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const usersShoppingLists = useSelector(
		(state) => state.shoppingList?.shoppingLists
	);
	const shoppingListArray = usersShoppingLists
		? Object.values(usersShoppingLists)
		: [];
	const [showMenu, setShowMenu] = useState(false);
	const [updated, setUpdated] = useState(false);
	const dispatch = useDispatch();
	const ulRef = useRef();

	let userName, userId;

	if (sessionUser) {
		userName = sessionUser.username;
	}

	useEffect(() => {
		dispatch(fetchShoppingList());
		setUpdated(false);
	}, [dispatch, updated]);

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu);
	}, [showMenu]);
	const closeMenu = () => setShowMenu(false);

	return (
		<>
			<section className='shoppingListContainer'>
				<h1 className='shoppingListTitleContainer'>
					{userName}'s Shopping Lists
				</h1><section className='newListSectionButton'>
				<OpenModalButton
					buttonText='Create New Shopping List'
					onItemClick={closeMenu}
					className='newShoppingListButton'
					modalComponent={<NewShoppingListModal userId={userId} />}
				/></section>
				<section className='shoppingListSection'>
					<ul className='shoppinglistsrendered'>

						{shoppingListArray &&
							shoppingListArray.map(({ name, id, user_id }) => {
								return (
									<li id='mappedLists' key={id}>
										<NavLink exact to={`/shoppinglist/${id}`}>
											{name}
										</NavLink>
									</li>
								);
							})}
					</ul>
				</section>
			</section>
		</>
	);
};

export default ShoppingList;
