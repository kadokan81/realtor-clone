import { doc, getDoc } from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify' /* cspell: disable-line */;
import Spinier from '../components/Spinier';
import { db } from '../firebase';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
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
		<div>
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
								className='w-full overflow-hidden h-[300px]'
								style={{
									background: `url(${url}) center no-repeat`,
								}}></div>
						</SwiperSlide>
					))}
			</Swiper>
		</div>
	);
}
