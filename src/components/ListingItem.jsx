import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdEdit, MdDelete } from 'react-icons/md';

export default function ListingItem({ listing, id }) {
	const {
		name,
		imgUrls,
		type,
		regularPrice,
		address,
		timestamp,
		offer,
		discountedPrice,
		bedrooms,
		bathrooms,
	} = listing;
	return (
		<li className='relative bg-white flex flex-col  rounded-md overflow-hidden shadow-md hover:shadow-xl transition duration-150 ease-in-out'>
			<Link to={`/category/${type}/${id}`} className=''>
				<Moment
					fromNow
					className='absolute z-10 top-1 left-1 font-semibold  text-white bg-blue-600 uppercase text-xs py-1 px-2 rounded'>
					{timestamp?.toDate()}
				</Moment>
				<div className='relative overflow-hidden'>
					<img
						src={imgUrls[0]}
						loading='lazy'
						alt=''
						className='h-[170px] w-full object-cover hover:scale-110 overflow-hidden transition-scale duration-300 ease-in '
					/>
				</div>
			</Link>
			<div className='p-3'>
				<div className='flex gap-2 items-center mb-1'>
					<MdLocationOn className='h-4 w-4 text-green-600' />
					<h3 className='text-sm font-semibold  text-gray-600'>{address}</h3>
				</div>
				<p className='font-semibold mt-2 text-xl mb-2'>{name}</p>
				<p className=' text-[#457b9d] mb-2'>
					$
					{offer
						? ' ' +
						  discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						: ' ' +
						  regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					{type === 'rent' && ' / month'}
				</p>
				<div className='flex gap-4 items-center'>
					<div className=''>
						<p className='font-bold text-xs'>
							{bedrooms > 1 ? `${bedrooms} Beds` : '1 Bed'}
						</p>
					</div>
					<div className=''>
						<p className='font-bold text-xs'>
							{bathrooms > 1 ? `${bathrooms} Baths` : '1 Bath'}
						</p>
					</div>
					<div className='flex gap-3 ml-auto mr-1'>
						<MdEdit
							className='cursor-pointer h-7 w-full p-1 rounded-full hover:bg-gray-200 transition-bg duration-200 ease-out'
							color='blue'
						/>
						<MdDelete
							className='cursor-pointer h-7 w-full p-1 rounded-full hover:bg-gray-200 transition-bg duration-200 ease-out'
							color='red'
							fontSize={20}
						/>
					</div>
				</div>
			</div>
		</li>
	);
}
