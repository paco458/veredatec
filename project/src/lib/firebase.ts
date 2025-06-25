// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvxTKbQvtksD9LhdaFHMZR0b1cLCYxsfg",
  authDomain: "veradec-1706b.firebaseapp.com",
  projectId: "veradec-1706b",
  storageBucket: "veradec-1706b.firebasestorage.app",
  messagingSenderId: "342905003636",
  appId: "1:342905003636:web:a4f15975910e34276d3b21",
  measurementId: "G-6M82LCC238"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
