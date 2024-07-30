import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt6Ho1P78lOQq9ufbWJw-9p8RHgAb8aN0",
  authDomain: "iptv-7f384.firebaseapp.com",
  projectId: "iptv-7f384",
  storageBucket: "iptv-7f384.appspot.com",
  messagingSenderId: "988838499883",
  appId: "1:988838499883:web:80645db228ab823979bc6e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
