import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth"; 
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../contexts/UserContext";

export default function NavBar() {
  const navigate = useNavigate();
  const user = useUser(); // get user from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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
      {/* Left side: Logo and Home with dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link
          to={isLoggedIn ? "/userhome" : "/"}
          style={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          🐾 Virtual Pet
        </Link>

        {isLoggedIn && (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              style={{
                background: "none",
                border: "none",
                color: "black",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "inherit",
                padding: 0,
              }}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Home ▼
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                  marginTop: "5px",
                  minWidth: "150px",
                  zIndex: 2000,
                }}
              >
                <Link to="/create-pet" className="dropdown-link" style={dropdownLinkStyle}>
                  Create a Pet
                </Link>
                <Link to="/userhome" className="dropdown-link" style={dropdownLinkStyle}>
                  Dashboard
                </Link>
              </div>
            )}
          </div>
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
            <Link
              to={`/profile/${user?.uid}`}
              style={{ color: "black", textDecoration: "none" }}
              title="View your profile"
            >
              👤 {user?.username || "User"}
            </Link>
            <span>💰 {typeof user?.currency === "number" ? user.currency : 0}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

const dropdownLinkStyle = {
  display: "block",
  padding: "10px 15px",
  color: "black",
  textDecoration: "none",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  backgroundColor: "white",
  transition: "background-color 0.2s ease",
};
