import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Slider from '../components/Slider';
import Spinier from '../components/Spinier';
import { db } from '../firebase';

export default function Home() {
	// offers
	const [offerListing, setOfferListing] = useState(null);
	const [rentListing, rentOfferListing] = useState(null);
	const [sellListing, sellOfferListing] = useState(null);

	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchListing() {
			try {
				const listingRef = collection(db, 'listings');
				const q = query(
					listingRef,
					where('offer', '==', true),
					orderBy('timestamp', 'desc'),
					limit(4)
				);
				const querySnap = await getDocs(q);
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
				console.log('error', error);
			}
		}
		async function fetchRentListing() {
			try {
				const listingRef = collection(db, 'listings');
				const q = query(
					listingRef,
					where('type', '==', 'rent'),
					orderBy('timestamp', 'desc'),
					limit(4)
				);
				const querySnap = await getDocs(q);
				let listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				rentOfferListing(listings);
				setLoading(false);
			} catch (error) {
				console.log('error', error);
			}
		}
		async function fetchSellListing() {
			try {
				const listingRef = collection(db, 'listings');
				const q = query(
					listingRef,
					where('type', '==', 'sale'),
					orderBy('timestamp', 'desc'),
					limit(4)
				);
				const querySnap = await getDocs(q);
				let listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				sellOfferListing(listings);
				setLoading(false);
			} catch (error) {
				console.log('error', error);
			}
		}
		fetchListing();
		fetchRentListing();
		fetchSellListing();
	}, []);

	if (loading) {
		return <Spinier />;
	}

	return (
		<div>
			<Slider />
			<div className='max-w-6xl mx-auto pt-4 space-y-6'>
				{offerListing && offerListing.length > 0 && (
					<div className='m-2 mb-6'>
						<h3 className='px-3 text-2xl mt-6'>Recent Offers</h3>
						<Link to={'offers'}>
							<p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
								show more offers
							</p>
						</Link>
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
									onDelete={() => {}}
									onEdit={() => {}}
								/>
							))}
						</ul>
					</div>
				)}
				{rentListing && rentListing.length > 0 && (
					<div className='m-2 mb-6'>
						<h3 className='px-3 text-2xl mt-6'>Rent Offers</h3>
						<Link to={'/category/rent'}>
							<p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
								show more rent offers
							</p>
						</Link>
						<ul
							className='mt-6 mb-6
					     sm:grid 
						sm:grid-cols-2 gap-4  
						md:grid-cols-3 xl:grid-cols-4'>
							{rentListing.map((listing) => (
								<ListingItem
									listing={listing.data}
									key={listing.id}
									id={listing.id}
									onDelete={() => {}}
									onEdit={() => {}}
								/>
							))}
						</ul>
					</div>
				)}
				{sellListing && sellListing.length > 0 && (
					<div className='m-2 mb-6'>
						<h3 className='px-3 text-2xl mt-6'>Sale Offers</h3>
						<Link to={'/category/sale'}>
							<p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
								show more sale offers
							</p>
						</Link>
						<ul
							className='mt-6 mb-6
					     sm:grid 
						sm:grid-cols-2 gap-4  
						md:grid-cols-3 xl:grid-cols-4'>
							{sellListing.map((listing) => (
								<ListingItem
									listing={listing.data}
									key={listing.id}
									id={listing.id}
									onDelete={() => {}}
									onEdit={() => {}}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
