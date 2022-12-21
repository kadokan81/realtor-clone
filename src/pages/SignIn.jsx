import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify' /* cspell: disable-line */;

export default function SignIn() {
	const [formData, setForm] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const onChange = (e) => {
		setForm((prevData) => ({
			...prevData,
			[e.target.id]: e.target.value,
		}));
	};
	async function onSubmit(e) {
		e.preventDefault();
		try {
			const auth = getAuth();
			const userCredentials = await signInWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);
			console.log('userCredentials', userCredentials);
			toast.success('Successfully sign In');
			if (userCredentials.user !== undefined) {
				navigate('/');
			}
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log('errorCode', errorCode);
			console.log('errorMessage', errorMessage);
			toast.error(error.message);
		}
	}
	return (
		<section>
			<h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
			<div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
				<div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
					<img
						src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80'
						alt='key'
						className='w-full rounded-2xl'
					/>
				</div>
				<div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
					<form onSubmit={onSubmit}>
						<input
							placeholder='Email address'
							value={formData.email}
							type='email'
							id='email'
							onChange={onChange}
							className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
						/>

						<div className='relative mb-6'>
							<input
								placeholder='Password'
								value={formData.password}
								onChange={onChange}
								type={!showPassword ? 'password' : 'text'}
								id='password'
								className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
							/>
							<div
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-0 h-[100%] w-10
							  top-0 cursor-pointer flex flex-col justify-center items-center'>
								{!showPassword ? (
									<AiFillEye size={24} color={'rgb(37 99 235 )'} />
								) : (
									<AiFillEyeInvisible size={24} color={'rgb(37 99 235 )'} />
								)}
							</div>
						</div>
						<div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
							<p className='mb-6'>
								Don't have a account?
								<Link
									to='/sign-up'
									className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>
									Register
								</Link>
							</p>
							<p>
								<Link
									to='/forgot-password'
									className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>
									Forgot password?
								</Link>
							</p>
						</div>
						<button
							className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
							type='submit'>
							Sign in
						</button>
						<div className='flex items-center  my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
							<p className='text-center font-semibold mx-4'>OR</p>
						</div>
						<OAuth />
					</form>
				</div>
			</div>
		</section>
	);
}
