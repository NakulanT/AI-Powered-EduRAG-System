import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function CreateQuestions() {
  const [subjectName, setSubjectName] = useState("");
  const [topics, setTopics] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [mediumAnswer, setMediumAnswer] = useState("");
  const [longAnswer, setLongAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const input_data = {
      subject_name: subjectName,
      topics: topics.split(",").map(topic => topic.trim()), // Convert topics into an array
      short_answer: shortAnswer,
      medium_answer: mediumAnswer,
      long_answer: longAnswer,
    };

    try {
      const response = await axios.post("http://localhost:5000/questions/create", input_data);
      if (response.data.status === "success") {
        setLoading(false);
        navigate(`/subjects/${subjectName}/${response.data.set}`);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
      <div style={styles.container}>
        <h2 style={styles.title}>Create a New Question</h2>
        

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Subject Name:</label>
          <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required style={styles.input} />

          <label style={styles.label}>Topics (comma-separated):</label>
          <input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} required style={styles.input} />

          <label style={styles.label}>Short Answer:</label>
          <textarea value={shortAnswer} onChange={(e) => setShortAnswer(e.target.value)} required style={styles.textarea}></textarea>

          <label style={styles.label}>Medium Answer:</label>
          <textarea value={mediumAnswer} onChange={(e) => setMediumAnswer(e.target.value)} required style={styles.textarea}></textarea>

          <label style={styles.label}>Long Answer:</label>
          <textarea value={longAnswer} onChange={(e) => setLongAnswer(e.target.value)} required style={styles.textarea}></textarea>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Create Question"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "10px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#e74c3c",
  },
  message: {
    textAlign: "center",
    fontWeight: "bold",
    color: "green",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginTop: "10px",
  },
  input: {
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    height: "80px",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default CreateQuestions;