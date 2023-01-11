import React, { useState } from 'react';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import Spinier from '../components/Spinier';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage';
import {
	addDoc,
	collection,
	serverTimestamp,
} from 'firebase/firestore' /* cspell: disable-line */;
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid' /* cspell: disable-line */;
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router';

export default function CreateListing() {
	const auth = getAuth();
	const navigate = useNavigate();
	const [geolocationEnabled, setGeolocationEnabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		description: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		latitude: 55.7,
		longitude: 9.5,
		images: {},
	});
	const {
		type,
		name,
		bathrooms,
		bedrooms,
		parking,
		furnished,
		address,
		description,
		offer,
		regularPrice,
		discountedPrice,
		latitude,
		longitude,
		images,
	} = formData;
	function onChange(e) {
		let boolean = null;
		if (e.target.value === 'true') {
			boolean = true;
		}
		if (e.target.value === 'false') {
			boolean = false;
		}
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);

		if (+discountedPrice >= +regularPrice) {
			toast.error('Discount price need to bee less than regular price');
			setLoading(false);
			return;
		}
		if (images.length > 6) {
			toast.error('maximum 6 images are allowed');
			setLoading(false);
			return;
		}
		async function storeImage(image) {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, filename);
				const uploadTask = uploadBytesResumable(storageRef, image);
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
		}

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch((error) => {
			setLoading(false);
			toast.error('Images not uploaded');
			return;
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			timestamp: serverTimestamp(),
			userRef: auth.currentUser.uid,
		};
		delete formDataCopy.images;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;
		const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
		setLoading(false);
		toast.success('Listing created');
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	}
	if (loading) {
		return <Spinier />;
	}
	return (
		<main className='max-w-md mx-auto px-2'>
			<h1 className='text-3xl text-center mt-6 font-bold'>Create Listing</h1>
			<form onSubmit={onSubmit}>
				<p className='text-lg mt-6 font-semibold'>Sell/Rent</p>
				<div className='flex gap-6'>
					<button
						id='type'
						value='sale'
						onClick={onChange}
						className={`  px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													type !== 'sale'
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						sell
					</button>
					<button
						id='type'
						value='rent'
						onClick={onChange}
						className={`px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													type !== 'rent'
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						rent
					</button>
				</div>
				<p className='text-lg mt-6 font-semibold'>Name</p>
				<input
					type='text'
					id='name'
					value={name}
					onChange={onChange}
					className='
                    w-full px-4 py-2 text-xl text-gray-700 rounded border
                     border-gray-300 transition duration-150 ease-in-out
                     focus:border-slate-600 focus:bg-white mb-6
                 
                '
					placeholder='Name'
					maxLength='32'
					minLength='10'
				/>
				<div className='flex  gap-6  mb-6'>
					<div className='w-full'>
						<p className='text-lg font-semibold'>Beds</p>
						<input
							className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
							type='number'
							id='bedrooms'
							value={bedrooms}
							onChange={onChange}
							min='1'
							max='50'
							required
						/>
					</div>
					<div className='w-full'>
						<p className='text-lg font-semibold'>Bath</p>
						<input
							className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
							type='number'
							id='bathrooms'
							value={bathrooms}
							onChange={onChange}
							min='1'
							max='50'
							required
						/>
					</div>
				</div>
				<p className='text-lg mt-6 font-semibold'>Parking spot</p>
				<div className='flex gap-6'>
					<button
						type='button'
						id='parking'
						value={true}
						onClick={onChange}
						className={`  px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													!parking
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						yes
					</button>
					<button
						type='button'
						id='parking'
						value={false}
						onClick={onChange}
						className={`px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													parking
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						no
					</button>
				</div>
				<p className='text-lg mt-6 font-semibold'>Furnished</p>
				<div className='flex gap-6'>
					<button
						id='furnished'
						value={true}
						onClick={onChange}
						className={`  px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													!furnished
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						yes
					</button>
					<button
						id='furnished'
						value={false}
						onClick={onChange}
						className={`px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													furnished
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						no
					</button>
				</div>
				<p className='text-lg mt-6 font-semibold'>Address</p>
				<textarea
					type='text'
					className='w-full font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out 
						mb-4'
					value={address}
					placeholder='Address'
					required
					id='address'
					onChange={onChange}
				/>
				{!geolocationEnabled && (
					<div className='flex gap-6 '>
						<div className='w-full'>
							<p className='text-lg font-semibold'>Latitude</p>
							<input
								type='number'
								id='latitude'
								value={latitude}
								onChange={onChange}
								required
								min='-90'
								max='90'
								className='w-full px-4 py-2 text-xl text-gray-700 bg-white 
								border border-gray-300 rounded transition duration-150 ease-in-out
								 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
							/>
						</div>
						<div className='w-full'>
							<p className='text-lg font-semibold'>Longitude</p>
							<input
								type='number'
								id='longitude'
								value={longitude}
								onChange={onChange}
								required
								className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
								 border-gray-300 rounded transition duration-150 ease-in-out
								  focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
								min='-180'
								max='180'
							/>
						</div>
					</div>
				)}
				<p className='text-lg mt-6 font-semibold'>Description</p>
				<textarea
					type='text'
					className='w-full  py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out '
					value={description}
					placeholder='Description'
					required
					id='description'
					onChange={onChange}
				/>
				<p className='text-lg mt-6 font-semibold'>Offer</p>
				<div className='flex gap-6 mb-4'>
					<button
						id='offer'
						value={true}
						onClick={onChange}
						className={`  px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													!offer
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						yes
					</button>
					<button
						id='offer'
						value={false}
						onClick={onChange}
						className={`px-7 py-3 font-medium text-sm uppercase 
                        shadow-md rounded hover:shadow-lg 
                        focus:shadow-lg active:shadow-lg transition 
                        duration-150 ease-in-out w-full ${
													offer
														? 'bg-white text-black'
														: 'bg-slate-600 text-white'
												}`}>
						no
					</button>
				</div>
				<div className='mb-6'>
					<p className='text-lg mt-6 font-semibold'>Regular Price</p>
					<div className='flex items-center gap-4'>
						<input
							className='w-[50%] px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
							type='number'
							value={regularPrice}
							id='regularPrice'
							onChange={onChange}
							min='50'
							max='40000000'
							required
						/>
						{type === 'rent' && <p className='text-md '>$ / Month</p>}
					</div>
				</div>
				{offer && (
					<div>
						<p className='text-lg mt-6 font-semibold'>Discounted Price</p>
						<div className='flex items-center gap-4'>
							<input
								className='w-[50%] px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
								type='number'
								value={discountedPrice}
								id='discountedPrice'
								onChange={onChange}
								min='50'
								max='40000000'
								required={offer}
							/>
						</div>
					</div>
				)}
				<div className='mb-6'>
					<p className='text-lg mt-6 font-semibold'>Images</p>
					<p className='text-gray-600 mb-4'>
						The first image will be the cover (max 6)
					</p>
					<input
						type='file'
						id='images'
						onChange={onChange}
						accept='.jpg,.png,.jpeg'
						multiple
						required
						className='w-full px-3 text-gray-700 bg-white py-2 border border-gray-300 rounded
						transition duration-150 ease-in-out 
						'
					/>
				</div>
				<button
					type='submit'
					className='mb-6 w-full px-7 py-3 bg-blue-600 text-white text-sm uppercase rounded shadow-md
					 hover:bg-blue-700 hover:shadow-lg 
					 focus:bg-blue-700 focus:shadow-lg 
					 active:bg-blue-900 active:shadow-xl
					 transition duration-150 ease-in-out'>
					Create listing{' '}
				</button>
			</form>
		</main>
	);
}
