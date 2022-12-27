import React from 'react';
import spinier from '../assets/svg/spinier.svg';

export default function Spinier() {
	return (
		<div className=' h-[100vh] fixed top-0 right-0 left-0 bottom-0 z-50 bg-black  bg-opacity-30 flex items-center justify-center'>
			<div>
				<img src={spinier} alt='Loading...' className='h-24' />
			</div>
		</div>
	);
}
