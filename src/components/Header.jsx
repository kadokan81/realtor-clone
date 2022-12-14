import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
	let location = useLocation();

	return (
		<div className='bg-white border-b shadow-sm sticky top-0 z-50 px-3'>
			<header className='flex justify-between items-center  max-w-6xl mx-auto py-4'>
				<div>
					<Link className='cursor-pointer' to={'/'}>
						<img
							src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'
							alt='main realtor logo'
							className='h-5 cursor-pointer'
						/>
					</Link>
				</div>
				<div>
					<ul className='flex'>
						<li>
							<Link
								className={` px-3 hover:text-black hover:border-b-[3px]  hover:border-b-red-500  py-4 text-sm font-semibold text-gray-400  ${
									location.pathname === '/' &&
									'text-black border-b-[3px] border-b-red-500 '
								}  `}
								to={'/'}>
								Home
							</Link>
						</li>
						<li>
							<Link
								className={` px-3 py-4 text-sm font-semibold text-gray-400  hover:text-black hover:border-b-[3px]  hover:border-b-red-500  ${
									location.pathname === '/offers' &&
									'text-black border-b-[3px] border-b-red-500'
								} `}
								to={'/offers'}>
								Offers
							</Link>
						</li>
						<li>
							<Link
								className={`px-3 py-4 text-sm font-semibold text-gray-400  hover:text-black hover:border-b-[3px]  hover:border-b-red-500  ${
									location.pathname === '/sign-in' &&
									'text-black border-b-[3px] border-b-red-500'
								} `}
								to={'/sign-in'}>
								Sign In
							</Link>
						</li>
					</ul>
				</div>
			</header>
		</div>
	);
};
