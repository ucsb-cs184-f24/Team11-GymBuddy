// Firebase SDK imports
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCznLkGE1-5moDGY5aCTDEhGgoZRsrZVAU",
  authDomain: "cs184-399bb.firebaseapp.com",
  projectId: "cs184-399bb",
  storageBucket: "cs184-399bb.appspot.com",
  messagingSenderId: "1079540490409",
  appId: "1:1079540490409:web:258416084cd8ba149e89b8",
  measurementId: "G-T9WPD5CLXC"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const FIREBASE_AUTH = getAuth(app);
