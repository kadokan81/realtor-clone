import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import ListingItem from '../components/ListingItem';
import Spinier from '../components/Spinier';
import { db } from '../firebase';

export default function Offers() {
	const [offerListing, setOfferListing] = useState(null);
	const [lastFetchedListing, setLastFetchedListing] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchOffersListing() {
			try {
				const listingRef = collection(db, 'listings');
				const q = query(
					listingRef,
					where('offer', '==', true),
					orderBy('timestamp', 'desc'),
					limit(2)
				);
				const querySnap = await getDocs(q);
				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				console.log('lastVisible', lastVisible);
				setLastFetchedListing(lastVisible);
				console.log('lastFetchedListing', lastFetchedListing);
				let listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setOfferListing(listings);
				setLoading(false);
			} catch (error) {
				toast.error('Could not fetch listings');
			}
		}
		fetchOffersListing();
	}, []);

	async function onFetchMoreListings() {
		try {
			const listingRef = collection(db, 'listings');
			const q = query(
				listingRef,
				where('offer', '==', true),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(4)
			);
			const querySnap = await getDocs(q);
			const lastVisible = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(lastVisible);
			const listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setOfferListing((prevState) => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error('Could not fetch listing');
		}
	}
	if (loading) {
		return <Spinier />;
	}
	return (
		<div className='max-w-6xl mx-auto pt-4 space-y-6'>
			<h1 className='text-3xl px-3 mb-6 text-center font-bold'>Offers</h1>
			{offerListing && offerListing.length > 0 && (
				<div className='m-2 mb-6'>
					<ul
						className='mt-6 mb-6
					     sm:grid 
						sm:grid-cols-2 gap-4  
						md:grid-cols-3 xl:grid-cols-4'>
						{offerListing.map((listing) => (
							<ListingItem
								listing={listing.data}
								key={listing.id}
								id={listing.id}
							/>
						))}
					</ul>
				</div>
			)}
			{lastFetchedListing && (
				<div className='flex justify-center items-center'>
					<button
						onClick={onFetchMoreListings}
						className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>
						Load more
					</button>
				</div>
			)}
		</div>
	);
}
