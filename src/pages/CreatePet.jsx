// src/pages/CreatePet.jsx
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

const CreatePet = () => {
  const user = useUser();
  const userId = user?.uid;

  const [petName, setPetName] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePet = async () => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);

    const newPet = {
      id: Date.now(),
      petName,
      gender,
      hunger: 100,
      boredom: 0,
      featured: false,
      collectedItems: { food: {}, toys: {} },
    };

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        pets: arrayUnion(newPet),
      });
      setPetName("");
      setGender("male");
    } catch (e) {
      setError("Failed to add pet: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
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
        disabled={loading}
        style={{ marginBottom: 10, padding: 8, width: "100%" }}
      />

      <div style={{ marginBottom: 10 }}>
        <label>
          Gender:&nbsp;
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={loading}
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
