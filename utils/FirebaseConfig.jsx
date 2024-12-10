// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBdy7gCjwgboWHXvOHgw2_fRO3cnAFPeYU",
    authDomain: "safe-swim-app-52514.firebaseapp.com",
    projectId: "safe-swim-app-52514",
    storageBucket: "safe-swim-app-52514.firebasestorage.app",
    messagingSenderId: "682214000283",
    appId: "1:682214000283:web:78eb012276eb9f6b79a83e",
    measurementId: "G-5H4PTVGX3P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);   