import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinier from './Spinier';

function PrivateRoute() {
	const { loggedIn, checkingStatus } = useAuthStatus();
	if (checkingStatus) {
		return <Spinier />;
	}
	return loggedIn ? <Outlet /> : <Navigate to={'/sign-in'} />;
}

export default PrivateRoute;
