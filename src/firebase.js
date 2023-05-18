import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as FBSignOut,
} from "firebase/auth";
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
const auth = getAuth(app);

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signOut = () => {
    FBSignOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};

export default app;
