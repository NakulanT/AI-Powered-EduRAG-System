import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SubjectDetails.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function SubjectDetails() {
  const { subjectName } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use email instead of username
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  // Redirect to "/" if email or role is missing
  useEffect(() => {
    console.log("SubjectDetails component rendered");
    console.log("Email from localStorage:", email);
    console.log("Role from localStorage:", role);

    if (!email || !role) {
      console.log("Email or role missing, redirecting to /");
      navigate("/");
    }
  }, [email, role, navigate]);

  // Fetch subject details
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/subjects/${subjectName}`)
      .then((response) => {
        console.log("Subject details fetched:", response.data);
        setSubject(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subject details:", error);
        setLoading(false);
      });
  }, [subjectName]);

  // Colors for cards and title based on role
  const teacherColor = "#e74c3c"; // Red for teachers (matches StaffNav)
  const studentColor = "#3498db"; // Blue for students (matches StudentNav)
  const headingColor = role === "teacher" ? teacherColor : studentColor;

  if (loading) return <h2 className="loading">🔄 Loading...</h2>;
  if (!subject) return <h2 className="not-found">❌ Subject not found.</h2>;

  return (
    <div>
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      <div className="subject-container">
        <h1
          className="subject-title"
          style={{
            background: `linear-gradient(90deg, ${headingColor}, ${
              role === "teacher" ? "#c0392b" : "#2980b9"
            })`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {subjectName.toUpperCase()}
        </h1>

        <div className="grid-container">
          {Object.entries(subject).map(([setName, setData]) => (
            <div
              key={setName}
              className="set-card"
              style={{
                background: `linear-gradient(135deg, ${
                  role === "teacher" ? "rgb(231, 86, 86), #e74c3c" : "rgb(86, 160, 213), #3498db"
                })`,
              }}
              onClick={() => {
                console.log(`Navigating to /subjects/${subjectName}/${setName}`);
                navigate(`/subjects/${subjectName}/${setName}`);
              }}
            >
              <h3 className="set-card-title">{setName}</h3>
              <p className="set-card-text">
                <strong>Short Answers:</strong> {setData.short.length}
              </p>
              <p className="set-card-text">
                <strong>Medium Answers:</strong> {setData.medium.length}
              </p>
              <p className="set-card-text">
                <strong>Long Answers:</strong> {setData.long.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;