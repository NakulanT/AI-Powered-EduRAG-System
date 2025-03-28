import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetDetails.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function SetDetails() {
  const { subjectName, setName } = useParams();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Define color constants for heading
  const teacherColor = "#e74c3c"; // Red for teachers
  const studentColor = "#3498db"; // Blue for students

  // Define gradient colors for question cards
  const teacherGradientStart = "#ff8787"; // Light red for teachers
  const teacherGradientEnd = "#e74c3c"; // Dark red for teachers
  const studentGradientStart = "#7ec0ee"; // Light blue for students
  const studentGradientEnd = "#3498db"; // Dark blue for students

  // Determine the heading color and question card gradient based on role
  const headingColor = role === "teacher" ? teacherColor : studentColor;
  const gradientStart = role === "teacher" ? teacherGradientStart : studentGradientStart;
  const gradientEnd = role === "teacher" ? teacherGradientEnd : studentGradientEnd;
  const gradientHoverStart = role === "teacher" ? "#ff9999" : "#9fd3f5"; // Lighter shades for hover
  const gradientHoverEnd = role === "teacher" ? "#c0392b" : "#2980b9"; // Darker shades for hover

  useEffect(() => {
    if (!email || !role) {
      console.error("Email or role not found. Redirecting to login.");
      navigate("/");
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/subjects/${subjectName}/${setName}`, {
        headers: {
          Email: email, // Send email in headers
        },
      })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions(null);
        setLoading(false);
      });
  }, [subjectName, setName, email, role, navigate]);

  if (loading) return <h2 className="loading">🔄 Loading questions, please wait...</h2>;
  if (!questions) return <h2 className="not-found">❌ Questions not found.</h2>;

  return (
    <div>
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      <div className="set-container">
        <h1
          className="set-title"
          style={{
            background: `linear-gradient(90deg, ${headingColor}, ${
              role === "teacher" ? "#c0392b" : "#2980b9"
            })`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {setName} - {subjectName}
        </h1>

        {questions.short && questions.short.length > 0 && (
          <div className="question-section">
            <h3>Short Answer Questions:</h3>
            <ol className="question-list">
              {questions.short.map((q, index) => (
                <li
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                  }}
                  className="question-item"
                >
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}

        {questions.medium && questions.medium.length > 0 && (
          <div className="question-section">
            <h3>Medium Answer Questions:</h3>
            <ol className="question-list">
              {questions.medium.map((q, index) => (
                <li
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                  }}
                  className="question-item"
                >
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}

        {questions.long && questions.long.length > 0 && (
          <div className="question-section">
            <h3>Long Answer Questions:</h3>
            <ol className="question-list">
              {questions.long.map((q, index) => (
                <li
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                  }}
                  className="question-item"
                >
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default SetDetails;