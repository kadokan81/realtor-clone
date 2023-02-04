import { doc, getDoc } from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import { db } from '../firebase';

export default function Contact({ userRef, listing }) {
	const [landlord, setLandLord] = useState(null);
	const [message, setMessage] = useState('');
	useEffect(() => {
		async function getLandLord() {
			const docRef = doc(db, 'users', userRef);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setLandLord(docSnap.data());
			} else {
				toast.error('No landlord data');
			}
		}
		getLandLord();
	}, [userRef, landlord]);

	return (
		<div>
			<h3 className='mb-4'>
				Contact {landlord?.name} for {listing.name}
			</h3>

			<textarea
				name='message'
				id='message'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
				minLength={10}
				maxLength={130}
				placeholder='Message'
				className='w-full border-blue-300 border-2 rounded-lg mb-4 '
			/>
			<a
				href={`mailto:${landlord?.email}?Subject=${listing?.name}&body=${message}`}
				className='block text-center px-7 py-3 bg-blue-600 text-white text-sm uppercase rounded-md w-full shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out'>
				Send Message
			</a>
		</div>
	);
}
