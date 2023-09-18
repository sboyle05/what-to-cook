import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './profileButton.css';
import chefHat from '../../assets/chef_hat.png';

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();
	const history = useHistory();

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

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

	const handleLogout = (e) => {
		e.preventDefault();
		dispatch(logout());
		history.push('/');
	};

	const ulClassName =
		'profile-menu' +
		(user ? ' logged-in' : ' logged-out') +
		(showMenu ? ' show-menu' : '');
	const closeMenu = () => setShowMenu(false);

	return (
		<>
			<span onClick={openMenu}>
				<img id='chefIcon' src={chefHat} alt='cheficon' />
			</span>
			<ul className={ulClassName} ref={ulRef}>
				{user ? (
					<>
						<li>{user.username}</li>
						<li>{user.email}</li>
						<li>
							<button id='logOutButton' onClick={handleLogout}>
								Log Out
							</button>
						</li>
					</>
				) : (
					<>
						<OpenModalButton
							buttonText='Log In'
							className='loginButton'
							onItemClick={closeMenu}
							modalComponent={<LoginFormModal />}
						/>

						<OpenModalButton
							buttonText='Sign Up'
							className='signUpButton'
							onItemClick={closeMenu}
							modalComponent={<SignupFormModal />}
						/>
					</>
				)}
			</ul>
		</>
	);
}

export default ProfileButton;
