import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, googleProvider, onAuthStateChanged } from "../../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   
  const [token, setToken] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
// Replace your onAuthStateChanged useEffect with this:
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const res = await fetch("https://connect-backend-8x61.onrender.com/auth/firebase-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: firebaseUser.email }),
        });

        if (!res.ok) throw new Error("Backend login failed");

        const data = await res.json();
        const userData = {
          email: firebaseUser.email,
          id: data.id,
          role: data.role,
          access_token: data.access_token
        };

        setToken(data.access_token);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", data.access_token);

      } catch (err) {
        console.error("Backend login failed:", err);
        setUser(null);
        setToken(null);
      }
    } else {
      // ✅ KEY FIX: Don't wipe user if they logged in via email/password
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("access_token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  });

  return () => unsubscribe();
}, []);
 

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.clear()
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const value = {
    user,setUser,
    token,setToken,
    isLoading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
