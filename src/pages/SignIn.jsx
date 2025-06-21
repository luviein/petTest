// src/pages/SignIn.jsx
import React, { useState } from "react"; // Ensure React is imported
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // for success/info messages
  const [loading, setLoading] = useState(false); // Added loading state for sign-in button

  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false); // Loading state for reset button

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/userhome"); // redirect after successful login
    } catch (err) {
      // More user-friendly error messages
      let errorMessage = "Invalid email or password. Please try again.";
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "Your account has been disabled.";
          break;
        default:
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // Set loading false
    }
  };

  // Show modal
  const openModal = () => {
    setShowModal(true);
    setResetEmail(email); // prefill with current email input
    setResetError("");
    setResetMessage("");
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setResetError(""); // Clear errors on close
    setResetMessage(""); // Clear messages on close
  };

  // Handle forgot password inside modal
  const handleForgotPassword = async () => {
    setResetLoading(true); // Set loading true for reset
    setResetError("");
    setResetMessage("");
    if (!resetEmail) {
      setResetError("Please enter your email to reset password.");
      setResetLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("If your account is registered, a password reset link has been sent to your email.");
    } catch (err) {
      let resetErrorMessage = "Failed to send reset email. Please try again.";
      switch (err.code) {
        case "auth/invalid-email":
          resetErrorMessage = "The email address is not valid.";
          break;
        case "auth/user-not-found":
          resetErrorMessage = "No account found with that email address.";
          break;
        default:
          resetErrorMessage = err.message;
      }
      setResetError(resetErrorMessage);
    } finally {
      setResetLoading(false); // Set loading false for reset
    }
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>Sign In</h2>

        <form onSubmit={handleSignIn} style={styles.form}>
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

          {/* Forgot password link */}
          <p style={styles.forgotPasswordLink}>
            Forgot your password? Click{" "}
            <span
              onClick={openModal}
              style={styles.link} // Re-use link style
              title="Click to reset your password"
            >
              here
            </span>.
          </p>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging In..." : "Log In"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.successMessage}>{message}</p>}

          <p style={styles.linkText}>
            Are you a newbie?{" "}
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>{" "}
            instead!
          </p>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={closeModal} style={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={styles.modalContent}>
            <h2 style={styles.modalHeading}>Reset Password</h2>
            <p style={styles.modalText}>Enter your email address to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={styles.modalInput}
            />
            <button
              onClick={handleForgotPassword}
              disabled={resetLoading}
              style={styles.modalButton}
            >
              {resetLoading ? "Sending..." : "Send Reset Email"}
            </button>

            {resetError && <p style={styles.error}>{resetError}</p>}
            {resetMessage && <p style={styles.successMessage}>{resetMessage}</p>}

            <button onClick={closeModal} style={styles.modalCloseButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// --- Styles object (similar to SignUp.jsx) ---
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centers content horizontally
    justifyContent: "center", // Centers content vertically within its own space
    padding: "20px",
    backgroundColor: "transparent",
    width: "100%", // Takes full width of parent
    boxSizing: "border-box",
    margin: "auto", // Allows component to be centered by parent's flexbox (from App.jsx)
  },
  heading: {
    marginBottom: "20px",
    color: "white", // White heading
  },
  form: {
    width: "80%", // Form elements will take 80% of the container's width
    maxWidth: "600px", // Optional: Set a max-width for readability on very wide screens
    display: "flex",
    flexDirection: "column",
    gap: "15px", // Spacing between form groups
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555", // Using a dark color for labels for contrast
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%", // Ensures input fills the width of its parent formGroup
    boxSizing: "border-box", // Include padding in width
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
    width: "100%", // Ensures button fills the width of its parent form
    boxSizing: "border-box", // Include padding in width
  },
  // Added for consistent button hover/disabled states (optional, you can add actual :hover CSS)
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
    textAlign: "center", // Center error text
  },
  successMessage: { // Style for success messages
    color: "green",
    marginTop: "-10px",
    marginBottom: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
  linkText: { // Style for "Are you a newbie?" paragraph
    marginTop: "20px",
    color: "#555",
    textAlign: "center", // Center the text
  },
  link: {
    color: "#007bff",
    textDecoration: "underline", // Underline for visual cue
    fontWeight: "bold",
    cursor: "pointer", // Indicate clickable for the span
  },
  forgotPasswordLink: { // New style for the "Forgot password" paragraph
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "center",
  },
  // --- Modal Styles (tuned to look consistent) ---
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)", // Slightly darker overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px", // More padding
    borderRadius: "8px",
    width: "90%",
    maxWidth: "450px", // Slightly larger modal max width
    boxSizing: "border-box",
    textAlign: "center",
    color: "#333", // Default text color inside modal
    display: "flex",
    flexDirection: "column",
    gap: "15px", // Spacing between modal elements
  },
  modalHeading: {
    color: "#333",
    marginBottom: "10px",
  },
  modalText: {
    color: "#555",
    marginBottom: "10px",
  },
  modalInput: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  modalButton: {
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
  modalCloseButton: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: "#6c757d", // A neutral close button color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};