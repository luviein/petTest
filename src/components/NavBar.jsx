// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function NavBar({ username, currency }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        zIndex: 1000,
        boxSizing: "border-box",
        color: "black",
        justifyContent: "space-between",
      }}
    >
      {/* Left side: Logo and Home if logged in */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link
          to={isLoggedIn ? "/userhome" : "/"}
          style={{ textDecoration: "none", color: "black", fontWeight: "bold", fontSize: "18px" }}
        >
          🐾 Virtual Pet
        </Link>

        {isLoggedIn && (
          <Link to="/userhome" style={{ color: "black", fontWeight: "bold" }}>
            Home
          </Link>
        )}
      </div>

      {/* Right side: Login or user info */}
      <div>
        {!isLoggedIn ? (
          <Link to="/signin">
            <button>Login</button>
          </Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span>👤 {username}</span>
            <span>💰 {currency}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
