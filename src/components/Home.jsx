import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";
import "./Home.css";

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

  // Colors for subject cards and title based on role
  const teacherColor = "#e74c3c"; // Red from StaffNav
  const studentColor = "#3498db"; // Blue from StudentNav

  // Select colors based on role
  const cardColor = role === "teacher" ? teacherColor : studentColor;
  const headingColor = role === "teacher" ? teacherColor : studentColor;

  return (
    <div className="home-container">
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      <h2
        className="home-title"
        style={{
          background: `linear-gradient(90deg, ${headingColor}, ${
            role === "teacher" ? "#c0392b" : "#2980b9"
          })`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        📚 Available Subjects
      </h2>

      {/* Subjects Grid */}
      <div className="home-grid">
        {Object.entries(subjects).map(([subjectName, sets]) => (
          <div
            key={subjectName}
            className="home-card"
            style={{
              background: `linear-gradient(135deg, ${
                role === "teacher" ? "rgb(231, 86, 86), #e74c3c" : "rgb(86, 160, 213), #3498db"
              })`,
            }}
            onClick={() => {
              console.log(`Navigating to /subjects/${subjectName}`);
              navigate(`/subjects/${subjectName}`);
            }}
          >
            <h2 className="home-card-title">{subjectName}</h2>
            <p className="home-card-text">
              <strong>Total Sets:</strong> {Object.keys(sets).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;