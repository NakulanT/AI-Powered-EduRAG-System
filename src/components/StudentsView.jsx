import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffNav from "./StaffNav";
import StudentNav from "./StudentNav";

function StudentsView() {
  const [viewedData, setViewedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get("http://localhost:5000/students/viewed")
      .then((response) => {
        console.log("Viewed students data:", response.data);
        setViewedData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching viewed students:", error);
        setLoading(false);
      });
  }, []);

  // Handle subject selection
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedSet(""); // Reset selected set when subject changes
  };

  // Handle set selection
  const handleSetChange = (e) => {
    setSelectedSet(e.target.value);
  };

  // Get unique sets for the selected subject
  const getSetsForSubject = (subject) => {
    if (!subject || !viewedData[subject]) return [];
    const allSets = viewedData[subject].flatMap(student => student.viewed_sets);
    return [...new Set(allSets)]; // Remove duplicates
  };

  // Get students who viewed the selected set
  const getStudentsForSet = (subject, setName) => {
    if (!subject || !setName || !viewedData[subject]) return [];
    return viewedData[subject]
      .filter(student => student.viewed_sets.includes(setName))
      .map(student => student.username);
  };

  if (loading) return <h2 style={styles.loading}>Loading...</h2>;
  if (!viewedData || Object.keys(viewedData).length === 0) return <h2 style={styles.noData}>No data available.</h2>;

  return (
    <div style={styles.page}>
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      <div style={styles.parent}>
        <h1 style={styles.title}>Students' Viewed Sets</h1>

        {/* Horizontal Subject and Set Selection */}
        <div style={styles.selectionContainer}>
          <div style={styles.selectWrapper}>
            <label style={styles.label}>Subject:</label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              style={styles.select}
            >
              <option value="">-- Choose a Subject --</option>
              {Object.keys(viewedData).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          {selectedSubject && (
            <div style={styles.selectWrapper}>
              <label style={styles.label}>Set:</label>
              <select
                value={selectedSet}
                onChange={handleSetChange}
                style={styles.select}
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

        {/* Students Who Viewed Selected Set */}
        {selectedSubject && selectedSet && (
          <div style={styles.studentsContainer}>
            <h3 style={styles.studentsTitle}>
              Students Who Viewed "{selectedSet}" in "{selectedSubject}"
            </h3>
            <ul style={styles.studentsList}>
              {getStudentsForSet(selectedSubject, selectedSet).length > 0 ? (
                getStudentsForSet(selectedSubject, selectedSet).map((student, idx) => (
                  <li key={idx} style={styles.studentItem}>
                    {student}
                  </li>
                ))
              ) : (
                <li style={styles.noStudents}>No students have viewed this set.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  parent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '700',
    margin: '20px 0',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
    fontFamily: "'Poppins', sans-serif",
  },
  loading: {
    textAlign: 'center',
    color: '#333',
    fontFamily: "'Poppins', sans-serif",
    marginTop: '50px',
  },
  noData: {
    textAlign: 'center',
    color: '#333',
    fontFamily: "'Poppins', sans-serif",
    marginTop: '50px',
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px',
    flexWrap: 'wrap', // Responsive for smaller screens
  },
  selectWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    fontFamily: "'Poppins', sans-serif",
  },
  select: {
    width: '250px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
  },
  studentsContainer: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
  },
  studentsTitle: {
    color: '#e74c3c',
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  studentsList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  studentItem: {
    fontSize: '16px',
    color: '#333',
    padding: '12px',
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  noStudents: {
    fontSize: '16px',
    color: '#666',
    padding: '12px',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default StudentsView;