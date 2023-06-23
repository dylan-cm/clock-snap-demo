import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCVfk4iCSTcXsR2FJQ43iqNZc10coIo_yg",
  authDomain: "clock-snap.firebaseapp.com",
  projectId: "clock-snap",
  storageBucket: "clock-snap.appspot.com",
  messagingSenderId: "284187482325",
  appId: "1:284187482325:web:a9878e7d71b0c597452a5c",
  measurementId: "G-N9KXHDQ9G3",
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
