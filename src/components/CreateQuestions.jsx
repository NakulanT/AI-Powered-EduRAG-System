import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function CreateQuestions() {
  const [subjectName, setSubjectName] = useState("");
  const [topics, setTopics] = useState("");
  const [shortAnswer, setShortAnswer] = useState(0);
  const [mediumAnswer, setMediumAnswer] = useState(0);
  const [longAnswer, setLongAnswer] = useState(0);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const input_data = {
      subject_name: subjectName,
      topics: topics.split(",").map(topic => topic.trim()),
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

  // Counter handlers with 0-10 range constraint
  const adjustCount = (setter, value) => {
    setter(prev => {
      const newValue = prev + value;
      return newValue >= 0 && newValue <= 10 ? newValue : prev;
    });
  };

  return (
    <div style={styles.parent}> {/* Changed from className="parent" to style={styles.parent} */}
      {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
      <div style={styles.container}>
        <h2 style={styles.title}>Create a New Question Set</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Subject Name:</label>
          <input 
            type="text" 
            value={subjectName} 
            onChange={(e) => setSubjectName(e.target.value)} 
            required 
            style={styles.input} 
          />

          <label style={styles.label}>Topics (comma-separated):</label>
          <input 
            type="text" 
            value={topics} 
            onChange={(e) => setTopics(e.target.value)} 
            required 
            style={styles.input} 
          />

          <label style={styles.label}>Short Answer Questions:</label>
          <div style={styles.counter}>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setShortAnswer, -1)}
            >-</button>
            <span style={styles.counterValue}>{shortAnswer}</span>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setShortAnswer, 1)}
            >+</button>
          </div>

          <label style={styles.label}>Medium Answer Questions:</label>
          <div style={styles.counter}>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setMediumAnswer, -1)}
            >-</button>
            <span style={styles.counterValue}>{mediumAnswer}</span>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setMediumAnswer, 1)}
            >+</button>
          </div>

          <label style={styles.label}>Long Answer Questions:</label>
          <div style={styles.counter}>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setLongAnswer, -1)}
            >-</button>
            <span style={styles.counterValue}>{longAnswer}</span>
            <button 
              type="button" 
              style={styles.counterButton} 
              onClick={() => adjustCount(setLongAnswer, 1)}
            >+</button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Create Question Set"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  parent: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  container: {
    maxWidth: "500px",
    margin: "10px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fff",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",

  },
  title: {
    textAlign: "center",
    color: "#e74c3c",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginTop: "15px",
    color: "#333",
  },
  input: {
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    fontFamily: "'Poppins', sans-serif",
  },
  counter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginTop: "5px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
  },
  counterButton: {
    width: "35px",
    height: "35px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "50%",
    fontSize: "18px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  counterValue: {
    fontSize: "18px",
    fontWeight: "500",
    minWidth: "30px",
    textAlign: "center",
    color: "#333",
  },
  button: {
    marginTop: "25px",
    padding: "12px",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default CreateQuestions;