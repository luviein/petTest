import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <NavBar  />
      <div
        style={{
          display: "flex",
          justifyContent: "center",  // center horizontally
          alignItems: "flex-start",  // or "center" if you want vertical centering
          width: "100vw",
          minHeight: "100vh",      // offset navbar height if fixed
          boxSizing: "border-box",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
          path="/userhome"
          element={
            <ProtectedRoute>
            {({ userData }) => <UserHome userData={userData} />}
          </ProtectedRoute>
          }
        />
        </Routes>
      </div>


    </Router>
  );
}