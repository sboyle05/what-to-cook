import React, { useState } from 'react';
import { login } from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = await dispatch(login(email, password));
		if (data) {
			setErrors([
				'Invalid Credentials, please check your email/password and try again.',
			]);
		} else {
			closeModal();
		}
	};

	const loginDemo = async (e) => {
		e.preventDefault();
		const data = await dispatch(login('demo@aa.io', 'password'));
		if (data) {
			setErrors(data);
		} else {
			closeModal();
		}
	};
	return (
		<>
			<section className='logincontainer'>
				<h1>Log In</h1>
				<form onSubmit={handleSubmit}>
					<ul>
						{errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
					<section className='loginLabelInput'>
						<label>Email</label>
						<input
							type='text'
							id='emailInput'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</section>
					<section className='loginLabelInput'>
						<label>Password</label>
						<input
							type='password'
							id='passwordInput'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</section>
					<section className='loginFormButs'>
						<section className='loginSubmitBut'>
							<button className='loginSubmit' type='submit'>
								Log In
							</button>
						</section>
						<section className='demoUserSubmitBut'>
							<button className='demo-user' onClick={loginDemo}>
								Log In as Demo User
							</button>
						</section>
					</section>
				</form>
			</section>
		</>
	);
}

export default LoginFormModal;
