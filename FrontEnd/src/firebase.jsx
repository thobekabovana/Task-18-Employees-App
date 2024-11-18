import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCN7U4GiRaZ8Qs9bSUW3zR-gHaCXDhAl6Q",
  authDomain: "task-18-employees-app.firebaseapp.com",
  projectId: "task-18-employees-app",
  storageBucket: "task-18-employees-app.firebasestorage.app",
  messagingSenderId: "122848514794",
  appId: "1:122848514794:web:b6b81bb4961d3da7ce7d93",
  measurementId: "G-0586EH816C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 
const auth = getAuth(app); 
const firestore = getFirestore(app);

export { db, auth, firestore };