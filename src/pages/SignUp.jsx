// src/pages/SignUp.jsx
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const navigate = useNavigate();

  const onRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    try {
      // Optionally, you can verify the reCAPTCHA token on your backend here

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      await setDoc(doc(db, "users", uid), {
        username,
        email,
        profileImageUrl: "",
        currency: 0,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);

      setMessage("Verification email sent! Please check your inbox.");

      await auth.signOut();

      // Optionally navigate to sign in page after sign out
      // navigate("/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Sign Up</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ marginBottom: 15, padding: 8, width: "100%", boxSizing: "border-box" }}
      />

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
        style={{ marginBottom: 15, padding: 8, width: "100%", boxSizing: "border-box" }}
      />

      {/* reCAPTCHA widget */}
      <div style={{ marginBottom: 20 }}>
        <ReCAPTCHA
          sitekey="6LfY72crAAAAAIj05fNjW_stli1AB8oaKXHniFPP"
          onChange={onRecaptchaChange}
        />
      </div>

      <button
        type="submit"
        style={{ marginBottom: 20, padding: "10px 0", width: "100%", cursor: "pointer" }}
      >
        Create Account
      </button>

      {error && <p style={{ color: "red", marginBottom: 20 }}>{error}</p>}
      {message && <p style={{ color: "green", marginBottom: 20 }}>{message}</p>}
    </form>
  );
}
