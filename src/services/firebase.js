// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1Q9SVkTOh26dWlVXtEY0SSToDh4b6QwY",
  authDomain: "blog--react-01.firebaseapp.com",
  projectId: "blog--react-01",
  storageBucket: "blog--react-01.firebasestorage.app",
  messagingSenderId: "274718729183",
  appId: "1:274718729183:web:48b8fc0dd915abee829a6a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
