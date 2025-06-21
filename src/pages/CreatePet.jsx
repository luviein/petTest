// src/pages/CreatePet.jsx
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

const CreatePet = () => {
  // --- CHANGE STARTS HERE ---
  // Destructure 'user' (which is the actual user data) and 'loading' from the context
  const { user, loading: userContextLoading } = useUser();
  const userId = user?.uid; // Now userId will correctly get the UID from the user object
  // --- CHANGE ENDS HERE ---

  const [petName, setPetName] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false); // For local form submission loading
  const [error, setError] = useState(null);

  const handleCreatePet = async () => {
    if (!userId) {
      setError("User not logged in. Please refresh or log in again.");
      return;
    }
    if (!petName.trim()) { // Basic validation for pet name
        setError("Pet name cannot be empty.");
        return;
    }

    setLoading(true);
    setError(null);

    const newPet = {
      id: Date.now(), // Simple unique ID, consider UUID for robustness
      petName: petName.trim(), // Trim whitespace
      gender,
      hunger: 100, // Initial hunger value
      boredom: 0,  // Initial boredom value
      featured: false, // Default to not featured
      collectedItems: { food: {}, toys: {} }, // Initialize empty objects for collected items
      // Add other default pet properties here as needed (e.g., happiness, health, species)
    };

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        pets: arrayUnion(newPet),
      });
      setPetName(""); // Clear form fields on success
      setGender("male");
      // Optional: Add a success message
      alert("Pet created successfully!");
    } catch (e) {
      console.error("Error adding pet:", e);
      setError("Failed to add pet: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Display a loading state if the user context is still loading
  if (userContextLoading) {
    return <p>Loading user data...</p>;
  }

  // Display message if user is not logged in after context has loaded
  if (!userId) { // This will now correctly check if the user is available from context
    return <p>Please log in to create a pet.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create New Pet</h2>
      <input
        type="text"
        placeholder="Pet Name"
        value={petName}
        onChange={(e) => setPetName(e.target.value)}
        disabled={loading} // Disable during local submission loading
        style={{ marginBottom: 10, padding: 8, width: "100%" }}
      />

      <div style={{ marginBottom: 10 }}>
        <label>
          Gender:&nbsp;
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={loading} // Disable during local submission loading
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <button onClick={handleCreatePet} disabled={loading || !petName.trim()}>
        {loading ? "Adding..." : "Add Pet"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreatePet;