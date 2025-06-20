
// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ maxWidth: 600, width: "100%", textAlign: "center", paddingTop: "15%" }}>
      <h1>🐾 Welcome to Virtual Pet World</h1>
      <p>Start raising your digital pet today!</p>
      <div style={{ marginTop: 20 }}>
        <Link to="/signin">
          <button style={{ marginRight: 10 }}>Login</button>
        </Link>
      
      </div>
    </div>
  );
}
