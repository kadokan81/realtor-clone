import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Profile() {
	const [formData, setFormData] = useState({
		name: 'Standard',
		email: 'test@email.com',
	});
	const { name, email } = formData;
	const navigate = useNavigate();

	const logOut = () => {
		const auth = getAuth();
		auth.signOut();
		navigate('/');
	};
	return (
		<>
			<section className='px-4 max-w-6xl flex flex-col items-center '>
				<h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>

				<div className='w-full md:w-[50%] mt-6 '>
					<form>
						<input
							className='w-full px-4 py-2 mb-6 text-xl text-gray-700 rounded-md bg-white border border-gray-300 transition ease-in-out '
							id='name'
							value={name}
							disabled
						/>
						<input
							className='w-full px-4 py-2 mb-6 text-xl text-gray-700 rounded-md bg-white border border-gray-300 transition ease-in-out '
							id='email'
							value={email}
							disabled
						/>
						<div className='flex justify-between  items-center gap-3 text-sm sm:text-lg whitespace-nowrap'>
							<p className='flex items-center gap-3'>
								Do you want to change you name ?
								<span className='text-red-600 cursor-pointer p-2  hover:text-red-700 transition ease-in-out duration-200'>
									Edit
								</span>
							</p>
							<p
								onClick={logOut}
								className='text-blue-600  p-2 cursor-pointer hover:text-blue-800 transition ease-in-out duration-200'>
								Sign Out
							</p>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
