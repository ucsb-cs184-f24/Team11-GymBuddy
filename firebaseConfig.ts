import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdyuK73K4IwL1jHy02vNgT0psZiSR1kuc",
  authDomain: "rnlocalauth.firebaseapp.com",
  projectId: "rnlocalauth",
  storageBucket: "rnlocalauth.appspot.com",
  messagingSenderId: "959633648851",
  appId: "1:959633648851:web:335af1294f4cbe27c57826"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);