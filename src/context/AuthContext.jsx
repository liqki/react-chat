import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState } from "react";
import { auth } from "../firebase/firebase";

// create context
export const AuthContext = createContext();

// create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // listen for auth state changes and set user
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
