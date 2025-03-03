import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./SubjectDetails.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

const colors = [
  "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
  "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
  "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",
  "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
  "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
];

function SubjectDetails() {
  const { subjectName } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate function

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/subjects/${subjectName}`)
      .then((response) => {
        setSubject(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subject details:", error);
        setLoading(false);
      });
  }, [subjectName]);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!subject) return <h2 className="not-found">Subject not found.</h2>;

  return (
    <div>
      {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
      <div className="subject-container">
        <h1 className="subject-title">{subjectName.toUpperCase()}</h1>

        <div className="grid-container">
          {Object.entries(subject).map(([setName, setData], index) => (
            <div
              key={setName}
              className="set-card"
              style={{ background: colors[index % colors.length] }}
              onClick={() => navigate(`/subjects/${subjectName}/${setName}`)} // Navigate to QuestionsPage
            >
              <h3>{setName}</h3>
              <p><strong>Short Answers:</strong> {setData.short.length}</p>
              <p><strong>Medium Answers:</strong> {setData.medium.length}</p>
              <p><strong>Long Answers:</strong> {setData.long.length}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;