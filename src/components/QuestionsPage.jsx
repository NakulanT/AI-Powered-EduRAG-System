import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QuestionsPage.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function QuestionsPage() {
  const { subjectName, setName } = useParams();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email"); // Changed from username to email
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email || !role) {
      navigate("/");
    }
  }, [email, role, navigate]);

  // Fetch questions and send Email header
  useEffect(() => {
    if (!email || !role) return; // Skip if not authenticated

    console.log("Role:", role);
    console.log("Email:", email); // Changed from Username to Email
    console.log("Subject Name:", subjectName);
    console.log("Set Name:", setName);

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5000/subjects/${subjectName}/${setName}`, {
        headers: {
          Email: email, // Send Email header for tracking viewed sets
        },
      })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setError(
          error.response?.data?.error || "Failed to load questions. Please try again."
        );
        setQuestions(null);
        setLoading(false);
      });
  }, [subjectName, setName, email, role]);

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading">🔄 Loading questions, please wait...</h2>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="error-container">
        <h2 className="not-found">❌ {error || "No questions found for this set."}</h2>
      </div>
    );
  }

  return (
    <div className="questions-page">
      {role === "teacher" ? (
        <StaffNav username={email} /> // Pass email as username prop (update StaffNav to handle this)
      ) : (
        <StudentNav username={email} /> // Pass email as username prop (update StudentNav to handle this)
      )}

      <div className="questions-container">
        <h1>
          {setName} - {subjectName}
        </h1>

        <div className="questions-list">
          {["short", "medium", "long"].map((category) => (
            questions?.[category]?.length > 0 && (
              <div key={category} className="question-category">
                <h3>
                  {category === "short"
                    ? "Short Answer Questions"
                    : category === "medium"
                    ? "Medium Answer Questions"
                    : "Long Answer Questions"}
                </h3>
                <ul>
                  {questions[category].map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;