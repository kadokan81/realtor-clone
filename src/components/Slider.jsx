import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
} from 'firebase/firestore' /* cspell: disable-line */;
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Spinier from '../components/Spinier';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
	EffectFade,
	Autoplay,
	Navigation,
	Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import { useNavigate } from 'react-router-dom';

function Slider() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	SwiperCore.use([Autoplay, Navigation, Pagination]);
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchListings() {
			const listingRef = collection(db, 'listings');
			const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
			const querySnap = await getDocs(q);

			let listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listings);
			setLoading(false);
		}
		fetchListings();
	}, []);

	if (loading) {
		return <Spinier />;
	}

	return (
		listings && (
			<div className='max-w-[1980px] mx-auto relative'>
				<Swiper
					slidesPerView={1}
					navigation
					pagination={{ type: 'progressbar' }} /* cspell: disable-line */
					effect='fade'
					modules={[EffectFade]}
					autoplay={{ delay: 3000 }}>
					{listings.map(({ data, id }) => (
						<SwiperSlide
							key={id}
							onClick={() => navigate(`/category/${data.type}/${id}`)}>
							<div
								style={{
									background: `url(${data.imgUrls[0]}) center, no-repeat`,
									backgroundSize: 'cover',
								}}
								className='relative w-full h-[400px] overflow-hidden'></div>
							<p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'>
								{data.name}
							</p>
							<p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl'>
								${data.discountedPrice ?? data.regularPrice}
								{data.type === 'rent' && ' / month'}
							</p>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		)
	);
}

export default Slider;
