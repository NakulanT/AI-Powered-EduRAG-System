import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";
import "./ViewedStudents.css";

function ViewedStudents() {
  const [viewedData, setViewedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Redirect to login if not authenticated or not a teacher
  useEffect(() => {
    console.log("ViewedStudents component rendered");
    console.log("Email from localStorage:", email);
    console.log("Role from localStorage:", role);

    if (!email || !role) {
      console.log("Email or role missing, redirecting to /");
      navigate("/");
    } else if (role !== "teacher") {
      console.log("User is not a teacher, redirecting to /Home");
      navigate("/Home");
    }
  }, [email, role, navigate]);

  // Fetch viewed students data
  useEffect(() => {
    if (!email || role !== "teacher") return; // Skip if not authenticated or not a teacher

    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:5000/students/viewed", {
        headers: {
          Email: email, // Send teacher's email in headers
        },
      })
      .then((response) => {
        console.log("Viewed students data fetched:", response.data);
        setViewedData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching viewed students:", error);
        setError(
          error.response?.data?.error || "Failed to load viewed students data. Please try again."
        );
        setViewedData({});
        setLoading(false);
      });
  }, [email, role]);

  // Extract unique subjects from viewedData
  const getSubjects = () => {
    return Object.keys(viewedData); // Subjects are the top-level keys (e.g., "DSA", "Machine Learning")
  };

  // Get unique sets for the selected subject
  const getSetsForSubject = (subject) => {
    if (!subject || !viewedData[subject]) return [];
    // Aggregate all viewed_sets arrays for the subject and remove duplicates
    const allSets = viewedData[subject].flatMap((student) => student.viewed_sets);
    return [...new Set(allSets)]; // Remove duplicates
  };

  // Get students who viewed the selected set
  const getStudentsForSet = (subject, setName) => {
    if (!subject || !setName || !viewedData[subject]) return [];
    // Filter students who have viewed the selected set
    return viewedData[subject].filter((student) => student.viewed_sets.includes(setName));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading">🔄 Loading viewed students, please wait...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 className="not-found">❌ {error}</h2>
        <button className="back-button" onClick={() => navigate("/Home")}>
          Back to Home
        </button>
      </div>
    );
  }

  // Check if there is any viewed data to display
  const hasViewedData = Object.keys(viewedData).length > 0;

  if (!hasViewedData) {
    return (
      <div className="error-container">
        <h2 className="not-found">❌ No students have viewed any sets yet.</h2>
        <button className="back-button" onClick={() => navigate("/Home")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="viewed-students-page">
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}

      <div className="viewed-students-container">

        {/* Horizontal Subject and Set Selection */}
        <div className="selection-container">
          <div className="select-wrapper">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedSet(""); // Reset selected set when subject changes
              }}
              className="select"
            >
              <option value="">-- Choose a Subject --</option>
              {getSubjects().map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          {selectedSubject && (
            <div className="select-wrapper">
              <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="select"
              >
                <option value="">-- Choose a Set --</option>
                {getSetsForSubject(selectedSubject).map((setName) => (
                  <option key={setName} value={setName}>
                    {setName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table of Students Who Viewed Selected Set */}
        {selectedSubject && selectedSet && (
          <div className="students-container">
            {getStudentsForSet(selectedSubject, selectedSet).length > 0 ? (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mail</th>
                    <th>Dept</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {getStudentsForSet(selectedSubject, selectedSet).map((student, idx) => (
                    <tr key={idx} className="student-row">
                      <td>{`${student.firstName} ${student.lastName}`}</td>
                      <td>{student.email}</td>
                      <td>{student.dept}</td>
                      <td>{student.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-students">No students have viewed this set.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewedStudents;