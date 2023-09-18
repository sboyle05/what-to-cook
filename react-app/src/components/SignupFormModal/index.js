import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { signUp } from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {

			setErrors([
				'Confirm Password field must be the same as the Password field',
			]);

		}
	};

	return (
		<>

			<section className='signUpFormContainer'>

				<h1>Sign Up</h1>
				<form onSubmit={handleSubmit}>
					<ul>
						{errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
					<section className='signUpLabelInput'>
						<label>Email</label>
						<input
							type='text'
							id='emailId'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</section>
					<section className='signUpLabelInput'>
						<label>Username</label>
						<input
							type='text'
							id='userNameId'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</section>
					<section className='signUpLabelInput'>
						<label>Password</label>
						<input
							type='password'
							id='passwordId'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</section>
					<section className='signUpLabelInput'>
						<label>Confirm Password</label>
						<input
							type='password'
							id='confirmPasswordId'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</section>
					<section className='signUpButContainer'>
						<button id='signUpButton' type='submit'>
							Sign Up
						</button>
					</section>
				</form>
			</section>
		</>
	);
}

export default SignupFormModal;
