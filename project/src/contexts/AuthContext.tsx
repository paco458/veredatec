/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase"; // Asegúrate de que `db` esté exportado en lib/firebase

// Nuevo tipo para los datos adicionales del usuario
type RegisterExtraData = {
  name: string;
  surname: string;
  phone: string;
  birthDate: string;
  dni: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    fullName: string,
    extraData: RegisterExtraData
  ) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err: unknown) {
      console.error("Error al iniciar sesión:", err);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    extraData: RegisterExtraData
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar displayName
      await updateProfile(user, { displayName: fullName });

      // Guardar en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: extraData.name,
        surname: extraData.surname,
        email: email,
        phone: extraData.phone,
        birthDate: extraData.birthDate,
        dni: extraData.dni,
      });

      // Actualizar estado local
      setUser({ ...user, displayName: fullName });
      return true;
    } catch (err: unknown) {
      console.error("Error al registrar:", err);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: unknown) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
