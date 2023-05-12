import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as FBSignOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

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
export const signIn = signInWithEmailAndPassword;

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

// export const login = (email, password) => {
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log(user);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(errorCode, errorMessage);
//       // setErr(`${errorCode}: ${errorMessage}`);
//     });
// };

export default app;
