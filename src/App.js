import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; /* cspell: disable-line */

import { Header } from './components/Header';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import 'react-toastify/dist/ReactToastify.css'; /* cspell: disable-line */
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Listing from './pages/Listing';

import Category from './pages/Category';
function App() {
	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/offers' element={<Offers />} />
					<Route path='/category/:categoryName' element={<Category />} />

					<Route path='/create-listing' element={<PrivateRoute />}>
						<Route path='/create-listing' element={<CreateListing />} />
					</Route>
					<Route path='/edit-listing/:listingId' element={<PrivateRoute />}>
						<Route path='/edit-listing/:listingId' element={<EditListing />} />
					</Route>
					<Route
						path='/category/:categoryName/:listingId'
						element={<Listing />}
					/>

					<Route path='/profile' element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
					</Route>
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />
				</Routes>
				<ToastContainer
					position='bottom-center'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='light'
				/>
			</Router>
		</>
	);
}

export default App;
