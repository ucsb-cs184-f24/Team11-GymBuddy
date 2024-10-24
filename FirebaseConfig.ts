// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvYYBu6ZuOjTppMJ0WKq_eSbhbRZKJk9w",
  authDomain: "logintest-1126b.firebaseapp.com",
  projectId: "logintest-1126b",
  storageBucket: "logintest-1126b.appspot.com",
  messagingSenderId: "451613497974",
  appId: "1:451613497974:web:ede460779521ef6e621d57",
  measurementId: "G-CR3WYEK84V"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
const analytics = getAnalytics(FIREBASE_APP);