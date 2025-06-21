// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("UserProvider: Component mounted. Setting up auth state listener.");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("UserProvider: onAuthStateChanged callback triggered. User:", user ? user.email : "null");

      if (user) {
        const docRef = doc(db, "users", user.uid);
        console.log("UserProvider: Attempting to fetch user data from Firestore using UID:", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("UserProvider: User document found in Firestore:", docSnap.id, docSnap.data());
          // Combine Firebase Auth UID with Firestore data
          setUserData({ uid: user.uid, ...docSnap.data() });
        } else {
          console.warn("UserProvider: User document NOT found in Firestore for UID:", user.uid);
          // Fallback: If no custom profile, just use basic Firebase Auth data
          setUserData({ uid: user.uid, email: user.email, username: user.displayName || 'New User' });
        }
      } else {
        console.log("UserProvider: No authenticated user. Setting userData to null.");
        setUserData(null);
      }
      console.log("UserProvider: Setting loading to false.");
      setLoading(false);
    });

    return () => {
      console.log("UserProvider: Cleaning up auth state listener.");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("UserProvider: userData state updated to:", userData);
  }, [userData]);

  // THIS IS THE KEY CHANGE
  const contextValue = {
    user: userData, // Renaming userData to 'user' for consistency with consumer
    loading: loading, // Explicitly providing 'loading'
  };

  if (loading) {
    console.log("UserProvider: Currently in loading state. Displaying loading message.");
    return <p>Loading user data...</p>;
  }

  console.log("UserProvider: Rendering children with contextValue:", contextValue);
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  // Optional: Add a check here if useUser is called outside of UserProvider
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}