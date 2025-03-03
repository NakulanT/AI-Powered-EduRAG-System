import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function StudentsView() {
  const [viewedData, setViewedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");


  useEffect(() => {
    axios.get("http://localhost:5000/students/viewed")
      .then((response) => {
        setViewedData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching viewed students:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!viewedData) return <h2>No data available.</h2>;

  return (
    <div>
    {role === "teacher" ? <StaffNav username={username} /> : <StudentNav username={username} />}
    <div style={styles.container}>
      <h1 style={styles.title}>Students' Viewed Sets</h1>
      {Object.keys(viewedData).map((subject, index) => (
        <div key={index} style={styles.subjectBox}>
          <h2 style={styles.subjectTitle}>{subject}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student Username</th>
                <th>Viewed Sets</th>
              </tr>
            </thead>
            <tbody>
              {viewedData[subject].map((student, idx) => (
                <tr key={idx}>
                  <td>{student.username}</td>
                  <td>{student.viewed_sets.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    color: "#e74c3c",
    textAlign: "center",
  },
  subjectBox: {
    background: "#f9f9f9",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  subjectTitle: {
    color: "#e74c3c",
    borderBottom: "2px solid #e74c3c",
    paddingBottom: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    background: "#e74c3c",
    color: "white",
    padding: "8px",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default StudentsView;
