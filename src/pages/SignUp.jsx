// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Added sendEmailVerification
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); // Used for form submission button
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages like email verification sent

  // ReCAPTCHA states and handler
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const onRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null); // Clear previous messages

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Firebase Auth User created:", user);

      // 2. Create user document in Firestore using user.uid as the document ID
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        username: username,
        email: user.email,
        createdAt: new Date(),
        currency: 0,
        profileImageUrl: "",
      });

      console.log("User profile created in Firestore for UID:", user.uid);

      // 3. Send email verification (as per your original code)
      await sendEmailVerification(user);
      setMessage("A verification email has been sent to your inbox. Please verify your email before logging in.");
      console.log("Verification email sent.");

      // 4. Sign out the user immediately after signup (as per your original code)
      // This is common when email verification is required before login
      await auth.signOut();
      console.log("User signed out after signup.");

      // Optionally navigate to sign in page after successful signup and sign out
      // navigate("/signin"); // You can uncomment this if you want to redirect automatically

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
          errorMessage = "Email/password authentication is not enabled. Please check Firebase settings.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. It should be at least 6 characters.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = err.message;
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

        {/* ReCAPTCHA Widget */}
        <div style={styles.recaptchaContainer}>
          <ReCAPTCHA
            sitekey="6LfY72crAAAAAIj05fNjW_stli1AB8oaKXHniFPP" // Use your actual site key here
            onChange={onRecaptchaChange}
            // Add a ref if you need to call reset() on the recaptcha
            // ref={recaptchaRef}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.successMessage}>{message}</p>} {/* Display success message */}

        <button type="submit" disabled={loading || !recaptchaValue} style={styles.button}>
          {loading ? "Creating Account..." : "Create Account"}
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
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "transparent",
    width: "100%",
    boxSizing: "border-box",
    margin: "auto",
  },
  heading: {
    marginBottom: "20px",
    color: "white",
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
    color: "#555",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  recaptchaContainer: {
    display: "flex",
    justifyContent: "center", // Center the reCAPTCHA widget
    marginTop: "5px",
    marginBottom: "5px", // Adjust spacing as needed
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
  // Update buttonDisabled to also include opacity for visual feedback
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
    opacity: 0.7, // Added opacity for disabled state
  },
  error: {
    color: "red",
    marginTop: "-10px",
    marginBottom: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
  successMessage: { // New style for success messages
    color: "green",
    marginTop: "-10px",
    marginBottom: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
  linkText: {
    marginTop: "20px",
    color: "#555",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};