// Firebase SDK imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZt00ij7RiUYQowB-oJba7nuM5MZa5A8o",
    authDomain: "cs184-homework2-56ebd.firebaseapp.com",
    projectId: "cs184-homework2-56ebd",
    storageBucket: "cs184-homework2-56ebd.appspot.com",
    messagingSenderId: "38527542630",
    appId: "1:38527542630:web:3af836eb8c949a1e8b54a7",
    measurementId: "G-M7RS6TFE7J"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const firebase_auth = getAuth(app);