import { doc, getDoc } from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import Spinier from '../components/Spinier';
import { db } from '../firebase';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaShare } from 'react-icons/fa';

// Import Swiper styles

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [shareLinkCopy, setShareLinkCopied] = useState(false);
	const params = useParams();
	const navigate = useNavigate();

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

	if (loading && listing === null) {
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
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}>
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
		</main>
	);
}
