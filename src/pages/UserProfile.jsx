import React from "react";
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId) {
          setError("User ID not provided in URL.");
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfileData(userSnap.data());
        } else {
          setError("Profile not found.");
          setProfileData(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // --- DEBUGGING LOGS ---
  console.log("--- UserProfile Debug ---");
  console.log("Current URL userId:", userId);
  console.log("Logged-in currentUser:", currentUser);
  console.log("currentUser UID:", currentUser?.uid);
  console.log("Is user context loading (userLoading)?", userLoading);
  console.log("Is profile data loading (loading)?", loading);

  const isOwner = currentUser?.uid === userId;
  console.log("Calculated isOwner:", isOwner);
  console.log("--- End Debug ---");
  // --- END DEBUGGING LOGS ---

  if (loading || userLoading) {
    return <div style={styles.loadingContainer}><p style={styles.loadingText}>Loading profile...</p></div>;
  }

  if (error) {
    return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
  }

  if (!profileData) {
    return <div style={styles.container}><p style={styles.errorText}>No profile data available.</p></div>;
  }

  const {
    username,
    profileImageUrl,
    createdAt,
    pets = [],
  } = profileData;

  const petsArray = Array.isArray(pets) ? pets : Object.values(pets);

  const featuredPet = petsArray.find((pet) => pet.featured);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{username}'s Profile</h2>

      <div style={styles.section}>
        <div style={styles.buttonGroup}>
          {isOwner ? (
            <button style={styles.ownerActionButton}>Profile Settings</button>
          ) : (
            <button style={styles.visitorActionButton}>Add Friend</button>
          )}
        </div>

        <div style={styles.flexContainer}>
          {/* COMBINED PROFILE PICTURE AND ABOUT USER CARD */}
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>About {username}</h3> {/* Main heading for the combined card */}
            <img
              src={profileImageUrl || "https://via.placeholder.com/150/007bff/FFFFFF?text=No+Image"}
              alt="Profile"
              style={styles.profileImage}
            />
            <p>Joined on {createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</p>
            {/* Add more descriptive text or bio field here if available in profileData */}
          </div>

          {/* FEATURED PET CARD (remains separate) */}
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Featured Pet</h3>
            {featuredPet ? (
              <>
                <p>Name: {featuredPet.petName}</p>
                <p>Hunger: {featuredPet.hunger}</p>
                <p>Boredom: {featuredPet.boredom}</p>
                {featuredPet.imageUrl && (
                  <img
                    src={featuredPet.imageUrl}
                    alt={featuredPet.petName}
                    style={styles.featuredPetImage}
                  />
                )}
              </>
            ) : (
              <p>No featured pet selected.</p>
            )}
          </div>
        </div>

        {/* PETS SECTION */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeading}>All Pets</h3>
          {petsArray.length > 0 ? (
            <div style={styles.petsGrid}>
              {petsArray.map((pet, index) => (
                <div key={index} style={styles.petCard}>
                  <h4 style={styles.petCardHeading}>{pet.petName}</h4>
                  <p>Hunger: {pet.hunger}</p>
                  <p>Boredom: {pet.boredom}</p>
                  <p>Food Collected: {Object.keys(pet.collectedItems?.food || {}).length}</p>
                  <p>Toys Collected: {Object.keys(pet.collectedItems?.toys || {}).length}</p>
                  {pet.imageUrl && (
                    <img
                      src={pet.imageUrl}
                      alt={pet.petName}
                      style={styles.petCardImage}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{isOwner ? "You don't have any pets yet." : `${username} doesn't have any pets yet.`}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    marginTop: "80px",
    width: "100%",
    maxWidth: "1000px",
    margin: "80px auto 20px auto",
    boxSizing: "border-box",
    color: "#333",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 60px)",
    color: "white",
  },
  loadingText: {
    fontSize: "1.2em",
  },
  errorText: {
    color: "red",
    fontSize: "1.1em",
    textAlign: "center",
  },
  heading: {
    color: "white",
    marginBottom: "30px",
    fontSize: "2.5em",
  },
  section: {
    width: "100%",
    marginBottom: "30px",
    textAlign: "center",
  },
  sectionHeading: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "1.8em",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
  },
  ownerActionButton: {
    padding: "12px 25px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    // REMOVED: "&:hover": { backgroundColor: "#218838" },
  },
  visitorActionButton: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    // REMOVED: "&:hover": { backgroundColor: "#0056b3" },
  },
  flexContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    width: "100%",
    justifyContent: "center",
    marginBottom: "30px",
  },
  card: {
    flex: 1,
    minWidth: "300px",
    maxWidth: "450px",
    backgroundColor: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
  },
  cardHeading: {
    color: "#333",
    marginBottom: "15px",
    fontSize: "1.5em",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #007bff",
    marginBottom: "15px",
  },
  featuredPetImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #28a745",
    marginTop: "10px",
  },
  petsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    width: "100%",
  },
  petCard: {
    backgroundColor: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  petCardHeading: {
    color: "#333",
    marginBottom: "10px",
    fontSize: "1.3em",
  },
  petCardImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
};