import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzUhW_8KqvCUk6I9RZAOZXcY17sy8zAD0",
  authDomain: "gym-buddy-eae7c.firebaseapp.com",
  projectId: "gym-buddy-eae7c",
  storageBucket: "gym-buddy-eae7c.firebasestorage.app",
  messagingSenderId: "255361484765",
  appId: "1:255361484765:web:6ec5a752b8560c3c6a5834",
};

export const app = initializeApp(firebaseConfig);

const storage = getStorage(app);