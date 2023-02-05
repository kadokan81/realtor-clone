import { doc, getDoc } from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import Spinier from '../components/Spinier';
import { db } from '../firebase';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaBath, FaBed, FaChair, FaParking, FaShare } from 'react-icons/fa';

// Import Swiper styles

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MdLocationOn } from 'react-icons/md';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import LeafletMap from '../components/LeafletMap';

export default function Listing() {
	const [listing, setListing] = useState({
		name: '',
		imgUrls: [],
		regularPrice: 0,
		discountedPrice: 0,
	});
	const [loading, setLoading] = useState(false);
	const [shareLinkCopy, setShareLinkCopied] = useState(false);
	const [contactLandLord, setContactLandLord] = useState(false);
	const params = useParams();
	const navigate = useNavigate();
	const auth = getAuth();

	useEffect(() => {
		setLoading(true);
		async function fetchListing() {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());

				setLoading(false);
			} else {
				navigate('/');
				toast.error('Listing does not exist');
			}
		}
		fetchListing();
	}, [navigate, params.listingId]);

	if ((loading && listing === null) || listing.name === '') {
		return <Spinier />;
	}

	return (
		<main className='max-w-[1980px] mx-auto relative'>
			<Swiper
				modules={[Navigation, Pagination, Autoplay, EffectFade]}
				spaceBetween={50}
				slidesPerView={1}
				navigation={true}
				autoplay={{ delay: 3000 }}
				loop={true}
				effect={'fade'}
				pagination={{ type: 'progressbar' }} /* cspell: disable-line */
				onSlideChange={() => {}}
				onSwiper={(swiper) => {}}>
				{listing &&
					listing.imgUrls.map((url, ind) => (
						<SwiperSlide key={ind}>
							<div
								className='w-full mw overflow-hidden h-[300px]'
								style={{
									background: `url(${url}) center no-repeat`,
									backgroundSize: 'cover',
								}}></div>
						</SwiperSlide>
					))}
			</Swiper>
			<div
				className='w-12 h-12 bg-white  absolute top-[13%] right-[3%] 
				border-2 border-gray-400  
				 cursor-pointer rounded-full
				  z-20 flex items-center justify-center
				   opacity-70 hover:opacity-100 transition duration-150 ease-in-out'
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}>
				<FaShare
					color='blue'
					className='text-lg text-slate-500 hover:text-slate-800 transition duration-150 ease-in-out'
				/>
			</div>
			{shareLinkCopy && (
				<div className='absolute text-blue-600 top-[30%] right-[6%] font-semibold border-2 border-gray-400 rounded-md bg-white opacity-70 z-10 px-2 py-1 '>
					Link Copied
				</div>
			)}
			<div className='flex  flex-col gap-4 md:flex-row my-0  mx-0  md:my-4 md:mx-4 p-4 rounded-lg bg-white border-gray-300 border-[3px] shadow-lg '>
				<div className=' w-full  mb-4 md:mb-0'>
					<p className='text-2xl font font-bold mb-3 text-blue-900 '>
						{listing.name} - ${' '}
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						{listing.type === 'rent' && ' / month'}
					</p>
					<div className='flex gap-1 items-center mb-4'>
						<MdLocationOn className='h-6 w-6 text-green-600 ' />
						<h3 className=' font-semibold  text-gray-600'>{listing.address}</h3>
					</div>
					<div className='flex gap-4 my-3'>
						<p className='w-[100%] text-center xl:w-[30%] bg-red-700 font-bold text-white py-2 px-4 rounded-lg shadow-md cursor-pointer active:bg-red-500 active:shadow-xl transition duration-150'>
							{listing.type === 'rent' ? 'For Rent' : 'For Sale'}
						</p>
						{listing.offer && (
							<p className='w-[100%] text-center xl:w-[30%] bg-green-700 font-bold text-white py-2 px-4 rounded-lg shadow-md cursor-pointer active:bg-red-500 active:shadow-xl transition duration-150'>
								${' '}
								{(listing.regularPrice - listing.discountedPrice)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
								discount
							</p>
						)}
					</div>
					<p className='my-3 '>
						<span className='font-semibold'>Description - </span>
						{listing.description}
					</p>
					<ul className='flex flex-wrap gap-6 items-center mb-3'>
						<li className='flex gap-1 items-center'>
							<FaBed size={'20px'} />
							<p className='font-bold'>
								{listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
							</p>
						</li>
						<li className='flex gap-1 items-center'>
							<FaBath size={'20px'} />
							<p className='font-bold'>
								{listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
							</p>
						</li>
						<li className='flex gap-1 items-center'>
							<FaParking size={'20px'} />
							<p className='font-bold'>
								{listing.parking ? 'parking' : 'No parking'}
							</p>
						</li>
						<li className='flex gap-1 items-center'>
							<FaChair size={'20px'} />
							<p className='font-bold'>
								{listing.furnished ? 'furnished' : 'Not furnished'}
							</p>
						</li>
					</ul>
					{listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
						<button
							onClick={() => setContactLandLord(true)}
							className='px-7 py-3 bg-blue-600 text-white text-sm uppercase rounded-md w-full shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out'>
							Contact landlord
						</button>
					)}
					{contactLandLord && (
						<Contact userRef={listing.userRef} listing={listing} />
					)}
				</div>
				<div className='w-full h-[300px] md:h-[300px] lg:h-[400px] z-10 overflow-x-hidden'>
					<LeafletMap
						longitude={listing.longitude}
						latitude={listing.latitude}
						address={listing.address}
					/>
				</div>
			</div>
		</main>
	);
}
