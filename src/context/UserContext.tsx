import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as FBSignOut,
  User,
} from "firebase/auth";

interface UserContextProps {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "demo@demo.com",
      "123demo"
    );
    return userCredential.user;
  };

  const signOut = () => FBSignOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserContext Provider");
  }
  return context;
};
