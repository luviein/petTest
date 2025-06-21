// src/App.jsx - IMPORTANT CHANGES HERE
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"; // Assuming this is the correct path
import NavBar from "./components/NavBar";
import UserHome from "./pages/UserHome";
import UserProfile from "./pages/UserProfile";
import CreatePet from "./pages/CreatePet";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <Router basename="/">
      <UserProvider>
        <NavBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",  // center horizontally
            alignItems: "center",  // <--- CHANGE THIS TO CENTER VERTICALLY
            width: "100vw",
            minHeight: "calc(100vh - 60px)", // Adjust for navbar height, assuming it's 60px.
                                             // This ensures the div takes up the remaining viewport height.
            boxSizing: "border-box",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} /> {/* Your SignUp Component */}
            <Route
              path="/userhome"
              element={
                <ProtectedRoute>
                  {({ userData }) => <UserHome userData={userData} />}
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route
              path="/create-pet"
              element={
                <ProtectedRoute>
                  {({ userData }) => <CreatePet userId={userData.uid} />}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}