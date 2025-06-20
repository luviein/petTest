// src/pages/SignIn.jsx
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // for success/info messages

  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/userhome"); // redirect after successful login
    } catch (err) {
      setError("Invalid email or password");
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
  };

  // Handle forgot password inside modal
  const handleForgotPassword = async () => {
    setResetError("");
    setResetMessage("");
    if (!resetEmail) {
      setResetError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("If your account is registered, a password reset link has been sent to your email.");
    } catch (err) {
      setResetError(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSignIn} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
        <h2>Sign In</h2>

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 15, padding: 8, width: "100%", boxSizing: "border-box" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: 5, padding: 8, width: "100%", boxSizing: "border-box" }}
        />

        {/* Forgot password link */}
        <p style={{ marginBottom: 20, fontSize: 14 }}>
          Forgot your password? Click{" "}
          <span
            onClick={openModal}
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline", userSelect: "none" }}
            title="Click to reset your password"
          >
            here
          </span>.
        </p>

        <button type="submit" style={{ marginBottom: 20, padding: "10px 0", width: "100%", cursor: "pointer" }}>
          Log In
        </button>

        {error && <p style={{ color: "red", marginBottom: 20 }}>{error}</p>}
        {message && <p style={{ color: "green", marginBottom: 20 }}>{message}</p>}

        <p style={{ marginTop: "15px", fontSize: "14px", padding: "10px 0" }}>
          Are you a newbie?{" "}
          Click{" "}
          <Link to="/signup" style={{ color: "blue", textDecoration: "underline" }}>
            here
          </Link>{" "}
          to sign up instead!
        </p>
      </form>

      {/* Modal */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              width: "90%",
              maxWidth: 400,
              boxSizing: "border-box",
              textAlign: "center",
              color: "black",
            }}
          >
            <h2 style={{ color: "black" }}>Reset Password</h2>
            <p style={{ color: "black" }}>Enter your email address to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ marginBottom: 15, padding: 8, width: "100%", boxSizing: "border-box" }}
            />
            <button
              onClick={handleForgotPassword}
              style={{ padding: "10px 0", width: "100%", cursor: "pointer" }}
            >
              Send Reset Email
            </button>

            {resetError && <p style={{ color: "red", marginTop: 15 }}>{resetError}</p>}
            {resetMessage && <p style={{ color: "green", marginTop: 15 }}>{resetMessage}</p>}

            <button onClick={closeModal} style={{ marginTop: 20, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
