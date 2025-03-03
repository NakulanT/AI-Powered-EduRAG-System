import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SetDetails.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function SetDetails() {
  const { subjectName, setName } = useParams();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!username) {
      console.error("Username not found. Please log in.");
      return;
    }

    axios
      .get(`http://localhost:5000/subjects/${subjectName}/${setName}`, {
        headers: {
          Username: username, // Send username in headers
        },
      })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, [subjectName, setName, username]);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!questions) return <h2 className="not-found">Questions not found.</h2>;

  return (
    <div>  
    {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
    <div className="set-container">
      <h1 className="set-title">{setName} - {subjectName}</h1>

      <div className="question-section">
        <h3>Short Answer Questions:</h3>
        <ul>
          {questions.short.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>

        <h3>Medium Answer Questions:</h3>
        <ul>
          {questions.medium.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>

        <h3>Long Answer Questions:</h3>
        <ul>
          {questions.long.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default SetDetails;