import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMM3-NsYrST3R4VXX2B_xaYa7O8sD7jS0",
    authDomain: "lab04react-84bd1.firebaseapp.com",
    projectId: "lab04react-84bd1",
    storageBucket: "lab04react-84bd1.firebasestorage.app",
    messagingSenderId: "504998887146",
    appId: "1:504998887146:web:62a0464d771ee48d106193",
    measurementId: "G-B81J73FDK8"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
