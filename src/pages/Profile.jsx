import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	// collection,
	// deleteDoc,
	doc,
	// getDocs,
	// orderBy,
	// query,
	updateDoc,
	// where,
} from 'firebase/firestore'; /* cspell: disable-line */
import { db } from '../firebase';
import { toast } from 'react-toastify'; /* cspell: disable-line */
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';

export default function Profile() {
	const auth = getAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const [changeDetails, setChangeDetails] = useState(false);
	const { name, email } = formData;

	const logOut = () => {
		auth.signOut();
		navigate('/');
	};

	useEffect(() => {}, []);
	function onChangeHandler(e) {
		setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	}
	async function onSubmit() {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});

				const docRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(docRef, {
					name,
				});
			}
			toast.success('Profile details updated');
		} catch (error) {
			toast.error('Could not update the profile details');
		}
	}
	return (
		<>
			<section className='px-4 mx-auto max-w-6xl flex flex-col items-center justify-center '>
				<h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>

				<div className='w-full md:w-[50%] mt-6 '>
					<form>
						<input
							className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 rounded-md bg-white border  border-gray-300 transition ease-in-out ${
								changeDetails && 'bg-red-200 focus:bg-red-200'
							}`}
							id='name'
							value={name}
							disabled={!changeDetails}
							onChange={onChangeHandler}
						/>
						<input
							className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 rounded-md bg-white border  border-gray-300 transition ease-in-out `}
							id='email'
							value={email}
							disabled
							// onChange={onChangeHandler}
						/>
						<div className='flex justify-between  items-center gap-3 text-sm sm:text-lg whitespace-nowrap'>
							<p className='flex items-center gap-3'>
								Do you want to change you name ?
								<span
									onClick={() => {
										changeDetails && onSubmit();
										setChangeDetails((prev) => !prev);
									}}
									className='text-red-600 cursor-pointer p-2  hover:text-red-700 transition ease-in-out duration-200'>
									{changeDetails ? 'Apply Change' : 'Edit'}
								</span>
							</p>
							<p
								onClick={logOut}
								className='text-blue-600  p-2 cursor-pointer hover:text-blue-800 transition ease-in-out duration-200'>
								Sign Out
							</p>
						</div>
					</form>
					<button
						type='submit'
						className='w-full bg-blue-600 text-white uppercase text-sm font-medium px-7 py-3 shadow-md rounded hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-900'>
						<Link
							to={'/create-listing'}
							className='flex items-center justify-center gap-5'>
							<FcHome className='text-3xl p-1 bg-red-200 rounded-full border-2' />
							sell or rent your Home
						</Link>
					</button>
				</div>
			</section>
		</>
	);
}
