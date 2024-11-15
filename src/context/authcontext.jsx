import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Rehidratar el usuario desde localStorage al cargar
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Sincroniza con localStorage
      } else {
        setUser(null);
        localStorage.removeItem("user"); // Limpia localStorage si no hay usuario
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setUser(null);
      localStorage.removeItem("user");
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
