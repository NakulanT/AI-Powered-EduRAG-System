import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetDetails.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function SetDetails() {
  const { subjectName, setName } = useParams();
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const teacherColor = "#e74c3c";
  const studentColor = "#3498db";
  const headingColor = role === "teacher" ? teacherColor : studentColor;

  const gradientStart = role === "teacher" ? "#ff8787" : "#7ec0ee";
  const gradientEnd = role === "teacher" ? "#e74c3c" : "#3498db";

  useEffect(() => {
    if (!email || !role) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/subjects/${subjectName}/${setName}`, {
        headers: {
          Email: email,
        },
      })
      .then(async (response) => {
        setQuestions(response.data);

        const payload = {
          subject_name: subjectName,
          set_name: setName,
          questions: {
            short: response.data.short,
            medium: response.data.medium,
            long: response.data.long,
          },
        };

        const answerResponse = await axios.post("http://localhost:5000/answers/create", payload);
        setAnswers(answerResponse.data.data); // ✅ Store only answer data
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions(null);
      });
  }, [subjectName, setName, email, role, navigate]);

  const renderQuestions = (type, label) => {
    if (!questions?.[type] || questions[type].length === 0) return null;

    return (
      <div className="question-section">
        <h3>{label}:</h3>
        <div className="question-list">
          {questions[type].map((q, index) => (
            <div
              key={index}
              className="question-item"
              style={{
                background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
              }}
              onMouseEnter={() => setHoveredIndex(`${type}-${index}`)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="question-text">
                <span className="question-number">{index + 1}.</span> {q}
              </div>

              {/* ✅ Only teachers can see answer on hover */}
              {role === "teacher" &&
                hoveredIndex === `${type}-${index}` &&
                answers?.[type]?.[index] && (
                  <div className="answer-hover">
                    <strong>Answer:</strong> {answers[type][index]}
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

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

        {renderQuestions("short", "Short Answer Questions")}
        {renderQuestions("medium", "Medium Answer Questions")}
        {renderQuestions("long", "Long Answer Questions")}
      </div>
    </div>
  );
}

export default SetDetails;
