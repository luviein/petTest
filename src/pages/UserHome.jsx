import NavBar from "../components/NavBar";

export default function UserHome({ userData }) {
  return (
    <>
      <NavBar username={userData.username} currency={userData.currency} />
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
