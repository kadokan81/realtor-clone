// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore' /* cspell: disable-line */;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyB1alf5f9OJOPOk3RvekNSZ1u2r1oQ0tUQ' /* cspell: disable-line */,
	authDomain: 'realtor-clone-a4377.firebaseapp.com' /* cspell: disable-line */,
	projectId: 'realtor-clone-a4377',
	storageBucket: 'realtor-clone-a4377.appspot.com' /* cspell: disable-line */,
	messagingSenderId: '347504900446',
	appId: '1:347504900446:web:3dfa0e94774c34bc0ef7cf',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); /* cspell: disable-line */
