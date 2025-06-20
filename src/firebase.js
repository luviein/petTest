// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzuO7fHrahNf5EMkfzUcdK1PRhXRykDRk",
  authDomain: "pettest-ad941.firebaseapp.com",
  projectId: "pettest-ad941",
  storageBucket: "pettest-ad941.firebasestorage.app",
  messagingSenderId: "301350770597",
  appId: "1:301350770597:web:0a34fe12cba3a3b08fba4c",
  measurementId: "G-338BKLLMEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);  // <-- export here
export const db = getFirestore(app);  // <-- export here