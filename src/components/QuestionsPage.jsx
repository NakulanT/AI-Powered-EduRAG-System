import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuestionsPage.css";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function QuestionsPage() {
  const { subjectName, setName } = useParams();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");




  useEffect(() => {
    console.log("Role:", role);
console.log("Username:", username);
console.log("Subject Name:", subjectName);
    axios
      .get(`http://localhost:5000/subjects/${subjectName}/${setName}`)
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions(null);
        setLoading(false);
      });
  }, [subjectName, setName]);

  if (loading)
    return <h2 className="loading">🔄 Loading questions, please wait...</h2>;

  if (!questions)
    return <h2 className="not-found">❌ No questions found for this set.</h2>;

  return (
    <div>
      {role === "teacher" ? (
        <StaffNav username={username} />
      ) : (
        <StudentNav username={username} />
      )}

      <div className="questions-container">
        <h1>{setName} - {subjectName}</h1>

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