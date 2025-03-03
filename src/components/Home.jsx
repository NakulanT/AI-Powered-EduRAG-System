import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function Home() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const [subjects, setSubjects] = useState([]);

  // Redirect to "/" if username or role is missing
  useEffect(() => {
    if (!username || !role) {
      navigate("/");
    }
  }, [username, role, navigate]);

  // Fetch subjects only if the user is authenticated
  useEffect(() => {
    if (username && role) {
      axios.get("http://localhost:5000/subjects")
        .then(response => setSubjects(response.data))
        .catch(error => console.error("Error fetching subjects:", error));
    }
  }, [username, role]);

  // Colors for subject cards
  const colors = [
    "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)", // Red-Orange
    "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)", // Blue
    "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)", // Aqua-Green
    "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)", // Yellow-Orange
    "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", // Purple
  ];

  return (
    <div>
      {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
      <h2 style={styles.title}>📚 Available Subjects</h2>

      {/* Subjects Grid */}
      <div style={styles.gridContainer}>
        {Object.entries(subjects).map(([subjectName, sets], index) => (
          <div 
            key={subjectName} 
            style={{ ...styles.card, background: colors[index % colors.length] }} 
            onClick={() => navigate(`/subjects/${subjectName}`)}
          >
            <h2>{subjectName}</h2>
            <p><strong>Total Sets:</strong> {Object.keys(sets).length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  title: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "30px",
  },
  card: {
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
};

export default Home;
