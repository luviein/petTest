import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser, loading: userLoading } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileData(userSnap.data());
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading || userLoading) return <p>Loading...</p>;
  if (!profileData) return <p>User not found</p>;

  const isOwner = currentUser?.uid === userId;

  const {
    username,
    profileImageUrl,
    createdAt,
    pets = []
  } = profileData;

  // pets stored as array? If stored as object, convert to array like Object.values(pets)
  const petsArray = Array.isArray(pets) ? pets : Object.values(pets);

  const featuredPet = petsArray.find((pet) => pet.featured);

  return (
    <div style={{ padding: "80px 20px", maxWidth: 1000, margin: "auto", color: "black" }}>
      <h2>{username}'s Profile</h2>

      <div style={{ marginTop: 20 }}>
        {/* Navigation Links */}
        <div style={{ marginBottom: 20 }}>
          {isOwner && <button style={{ marginRight: 10 }}>Profile Settings</button>}
          <button>Add Friend</button>
        </div>

        {/* Profile and Featured Pet Section */}
        <div style={{ display: "flex", gap: "20px", marginBottom: 30 }}>
          <div style={{ flex: 1, border: "1px solid #ccc", padding: 20 }}>
            <h3>Profile Picture</h3>
            <img
              src={profileImageUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover" }}
            />
          </div>

          <div style={{ flex: 1, border: "1px solid #ccc", padding: 20 }}>
            <h3>Featured Pet</h3>
            {featuredPet ? (
              <>
                <p>Name: {featuredPet.petName}</p>
                <p>Hunger: {featuredPet.hunger}</p>
                <p>Boredom: {featuredPet.boredom}</p>
              </>
            ) : (
              <p>No featured pet</p>
            )}
          </div>
        </div>

        {/* Profile Description Section */}
        <div style={{ marginBottom: 30 }}>
          <h3>Description</h3>
          <p>Joined on {createdAt?.toDate?.().toLocaleDateString()}</p>
        </div>

        {/* Pets Section */}
        <div>
          <h3>Pets</h3>
          <div style={{ display: "flex", overflowX: "auto", gap: "15px" }}>
            {petsArray.map((pet, index) => (
              <div key={index} style={{ border: "1px solid #ddd", minWidth: 200, padding: 10 }}>
                <h4>{pet.petName}</h4>
                <p>Hunger: {pet.hunger}</p>
                <p>Boredom: {pet.boredom}</p>
                <p>Food Collected: {Object.keys(pet.collectedItems?.food || {}).length}</p>
                <p>Toys Collected: {Object.keys(pet.collectedItems?.toys || {}).length}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
