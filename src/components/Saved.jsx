import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";
import "./Saved.css";

function Saved() {
  const [viewedSetsData, setViewedSetsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email || !role) {
      console.log("Email or role missing, redirecting to /");
      navigate("/");
    }
  }, [email, role, navigate]);

  // Fetch viewed sets data for the user
  useEffect(() => {
    if (!email) return;

    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:5000/students/viewed-sets", {
        headers: {
          Email: email, // Send the user's email in headers
        },
      })
      .then((response) => {
        console.log("Viewed sets data fetched:", response.data);
        setViewedSetsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching viewed sets data:", error);
        setError(
          error.response?.data?.error || "Failed to load viewed sets data. Please try again."
        );
        setViewedSetsData({});
        setLoading(false);
      });
  }, [email]);

  // Get the list of viewed subjects
  const getViewedSubjects = () => {
    return Object.keys(viewedSetsData);
  };

  // Get the sets for the selected subject
  const getSetsForSubject = () => {
    if (!selectedSubject || !viewedSetsData[selectedSubject]) return [];
    return Object.keys(viewedSetsData[selectedSubject]).map((setName) => ({
      setName,
      ...viewedSetsData[selectedSubject][setName],
    }));
  };

  // Handle set click to redirect
  const handleSetClick = (subject, setName) => {
    navigate(`/subjects/${subject}/${setName}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading">🔄 Loading saved sets, please wait...</h2>
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

  if (Object.keys(viewedSetsData).length === 0) {
    return (
      <div className="error-container">
        <h2 className="not-found">❌ You have not viewed any sets yet.</h2>
        <button className="back-button" onClick={() => navigate("/Home")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="saved-page">
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}

      <div className="saved-container">

        {/* Subject Selection */}
        <div className="selection-container">
          <div className="select-wrapper">
            <label className="label">Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select"
            >
              <option value="">-- Choose a Subject --</option>
              {getViewedSubjects().map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Sets for Selected Subject */}
        {selectedSubject && (
          <div className="sets-container">
            <h3 className="sets-title" style={{ borderBottomColor: "#3498db" }}>
              Viewed Sets for "{selectedSubject}"
            </h3>
            {getSetsForSubject().length > 0 ? (
              <table className="sets-table">
                <thead>
                  <tr>
                    <th>Set Name</th>
                    <th>Short Questions</th>
                    <th>Medium Questions</th>
                    <th>Long Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSetsForSubject().map((set, idx) => (
                    <tr
                      key={idx}
                      className="set-row"
                      onClick={() => handleSetClick(selectedSubject, set.setName)}
                    >
                      <td>{set.setName}</td>
                      <td>{set.short}</td>
                      <td>{set.medium}</td>
                      <td>{set.long}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-sets">No sets viewed for this subject.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Saved;