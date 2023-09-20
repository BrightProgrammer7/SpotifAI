import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
} from "firebase/auth";

// console.log(import.meta.env.VITE_API_KEY);

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_KEY,
	authDomain: "spotifai-lablab.firebaseapp.com",
	projectId: "spotifai-lablab",
	storageBucket: "spotifai-lablab.appspot.com",
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	// measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


const googleProvider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = {
	"google.com": googleProvider,
};