// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Ensure firebase.js is correctly configured and exports auth, db

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // State for username
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Firebase Auth User created:", user);

      const userDocRef = doc(db, "users", user.uid); // Correctly uses user.uid as doc ID
      await setDoc(userDocRef, {
        username: username, // Store the username from the form
        email: user.email,
        createdAt: new Date(), // Timestamp for when the user was created
        currency: 0, // Initial currency
        profileImageUrl: "", // Empty string for profile image URL
      });

      console.log("User profile created in Firestore for UID:", user.uid);

      navigate("/userhome");

    } catch (err) {
      console.error("Error during sign-up:", err.code, err.message);
      let errorMessage = "An unknown error occurred.";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled. Please check Firebase settings.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. It should be at least 6 characters.";
          break;
        default:
          errorMessage = err.message; // Use Firebase's message for other errors
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p style={styles.linkText}>
        Already have an account? <Link to="/signin" style={styles.link}>Sign In</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Keeps contents (heading, form, link text) centered horizontally
    justifyContent: "center", // <--- Center content vertically within this component's available space
    // minHeight: "calc(100vh - 60px)", // Removed this here, App.jsx handles the height
    padding: "20px",
    backgroundColor: "transparent",
    width: "100%", // Take full width of its parent container (App.jsx's div)
    boxSizing: "border-box",
    margin: "auto", // <--- Allows component to be centered by parent's flexbox
  },
  heading: {
    marginBottom: "20px",
    color: "white", // <--- Changed header color to white
  },
  form: {
    width: "80%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555", // Keep label color dark for contrast with potentially dark background
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    marginTop: "-10px",
    marginBottom: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
  linkText: {
    marginTop: "20px",
    color: "#555", // Keep link text dark for contrast
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};