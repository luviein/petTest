// src/contexts/UserContext.jsx (Updated)
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc }  from "firebase/firestore"; // Import doc and getDoc, no need for collection, query, where, getDocs for this approach

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("UserProvider: Component mounted. Setting up auth state listener.");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("UserProvider: onAuthStateChanged callback triggered. User:", user ? user.email : "null");

      if (user) {
        // *** THE CRITICAL CHANGE HERE ***
        // Use user.uid as the document ID to directly fetch the user's document
        const docRef = doc(db, "users", user.uid);
        console.log("UserProvider: Attempting to fetch user data from Firestore using UID:", user.uid);

        const docSnap = await getDoc(docRef); // Use getDoc, not getDocs

        if (docSnap.exists()) {
          console.log("UserProvider: User document found in Firestore:", docSnap.id, docSnap.data());
          setUserData({ uid: user.uid, ...docSnap.data() });
        } else {
          // This else block is important: If a user logs in but their Firestore profile hasn't been created yet.
          // You might want to create it here or ensure it's created during signup.
          console.warn("UserProvider: User document NOT found in Firestore for UID:", user.uid);
          // Fallback: If no custom profile, just use basic Firebase Auth data
          setUserData({ uid: user.uid, email: user.email, username: user.displayName || 'New User' }); // Add a default username
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
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    console.log("UserProvider: userData state updated to:", userData);
  }, [userData]);

  if (loading) {
    console.log("UserProvider: Currently in loading state. Displaying loading message.");
    return <p>Loading user data...</p>;
  }

  console.log("UserProvider: Rendering children with userData:", userData);
  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}