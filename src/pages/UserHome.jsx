import NavBar from "../components/NavBar";
import { useUser } from "../contexts/UserContext";

export default function UserHome() {
  // Destructure 'user' and 'loading' from the useUser() hook
  const { user, loading } = useUser();

  // If the user data is still loading, display a loading message.
  // This is important to prevent rendering issues while data is being fetched.
  if (loading) {
    return (
      <>
        <NavBar /> {/* Render NavBar even during loading */}
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
          <p>Loading user data...</p>
        </div>
      </>
    );
  }

  // If loading is complete but no user data is available (e.g., not logged in),
  // display a message or redirect.
  if (!user) {
    return (
      <>
        <NavBar />
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
          <p>Please log in to view your home dashboard.</p>
          {/* Optionally, add a link to the sign-in page */}
          {/* <Link to="/signin">Go to Login</Link> */}
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "80px", textAlign: "center" }}>
        {/* Access user.username directly from the destructured 'user' object */}
        <h2>Welcome back, {user.username}!</h2>
        {/* Access user.currency directly */}
        <p>Your balance: {user.currency} coins</p>

        <h3>📢 Latest News</h3>
        <ul>
          <li>🐶 New pet species available soon!</li>
          <li>🛒 Daily shop restock at 8AM</li>
        </ul>
      </div>
    </>
  );
}