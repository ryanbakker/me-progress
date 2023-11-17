import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCzQKvolivWnZBfHNQl1CzSuBX9j7-Zngw",
  authDomain: "meprogress-54172.firebaseapp.com",
  projectId: "meprogress-54172",
  storageBucket: "meprogress-54172.appspot.com",
  messagingSenderId: "653170902690",
  appId: "1:653170902690:web:17daaa4db5728071b6b9fb",
  measurementId: "G-XZWZ70QR2W",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const firestore = getFirestore(app);

export { db, auth, functions, firestore };
