import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function Home() {
  const navigate = useNavigate();

  // Use email instead of username
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [subjects, setSubjects] = useState([]);

  // Debug: Log email and role to confirm their values
  useEffect(() => {
    console.log("Home component rendered");
    console.log("Email from localStorage:", email);
    console.log("Role from localStorage:", role);

    // Redirect to "/" if email or role is missing
    if (!email || !role) {
      console.log("Email or role missing, redirecting to /");
      navigate("/");
    }
  }, [email, role, navigate]);

  // Fetch subjects only if the user is authenticated
  useEffect(() => {
    if (email && role) {
      console.log("Fetching subjects...");
      axios
        .get("http://localhost:5000/subjects")
        .then((response) => {
          console.log("Subjects fetched:", response.data);
          setSubjects(response.data);
        })
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [email, role]);

  // Colors for subject cards based on role
  const teacherColor = "#e74c3c"; // Red from StaffNav
  const studentColor = "#3498db"; // Blue from StudentNav

  // Select color based on role
  const cardColor = role === "teacher" ? teacherColor : studentColor;

  return (
    <div style={styles.container}>
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      <h2 style={styles.title}>📚 Available Subjects</h2>

      {/* Subjects Grid */}
      <div style={styles.gridContainer}>
        {Object.entries(subjects).map(([subjectName, sets]) => (
          <div
            key={subjectName}
            style={{ ...styles.card, background: cardColor }}
            onClick={() => {
              console.log(`Navigating to /subjects/${subjectName}`);
              navigate(`/subjects/${subjectName}`);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <h2 style={styles.cardTitle}>{subjectName}</h2>
            <p style={styles.cardText}>
              <strong>Total Sets:</strong> {Object.keys(sets).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  title: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    paddingBottom: "20px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Allow columns to grow
    gap: "30px", // Increased gap for better spacing
    padding: "20px", // Reduced padding to avoid overflow
    justifyContent: "center",
    maxWidth: "1200px", // Limit max width for larger screens
    margin: "0 auto", // Center the grid
  },
  card: {
    height: "160px",
    color: "white",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid rgba(255,255,255,0.3)",
    overflow: "hidden",
    position: "relative",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "0",
    textTransform: "capitalize",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  cardText: {
    fontSize: "16px",
    margin: "10px 0 0",
    fontWeight: "500",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  },
};

export default Home;