import NavBar from "../components/NavBar";
import { useUser } from "../contexts/UserContext";

export default function UserHome() {
  const userData = useUser();

  if (!userData) {
    return <p>Loading user data or please login.</p>;
  }

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "80px", textAlign: "center" }}>
        <h2>Welcome back, {userData.username}!</h2>
        <p>Your balance: {userData.currency} coins</p>

        <h3>📢 Latest News</h3>
        <ul>
          <li>🐶 New pet species available soon!</li>
          <li>🛒 Daily shop restock at 8AM</li>
        </ul>
      </div>
    </>
  );
}
