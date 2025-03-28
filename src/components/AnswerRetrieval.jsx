import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffNav from './StaffNav';
import StudentNav from './StudentNav';

const AnswerRetrieval = () => {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Retrieve username and role from localStorage
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  useEffect(() => {
    console.log("Role:", role);
  }, []); // Empty dependency array since we only want this to run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await axios.post('http://localhost:5000/query', {
        query: query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage('Query processed successfully!');
      setResults(response.data); // Assuming the backend returns { "answer": "some text" }
      setQuery('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to process query');
      } else {
        setError('An error occurred while processing query');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic theme based on role
  const themeColor = role === 'teacher' ? '#e74c3c' : '#3498db'; // Red for teacher, Blue for student

  return (
    <div>
      {/* Navigation outside the parent container */}
      {role === "teacher" ? <StaffNav username={email} /> : <StudentNav username={email} />}
      
      {/* Parent container for the main content */}
      <div style={styles.parent}>
        <div style={styles.container}>
          <h2 style={{ ...styles.title, color: themeColor }}>Retrieve Answers</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query"
              disabled={loading}
              style={styles.input}
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{ ...styles.button, backgroundColor: themeColor }}
            >
              {loading ? 'Processing...' : 'Submit Query'}
            </button>
          </form>
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
          {results && (
            <div style={styles.resultsContainer}>
              <h3 style={{ ...styles.resultsTitle, color: themeColor }}>Answer:</h3>
              <p style={styles.resultsText}>{results.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  parent: {
    minHeight: 'calc(100vh - 70px)', // Adjusted for nav height
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '700px',
    width: '100%',
    margin: '20px',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '25px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fafafa',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '14px 30px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  success: {
    color: '#2ecc71', // Green for success
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '500',
  },
  error: {
    color: '#e74c3c', // Red for error
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '500',
  },
  resultsContainer: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  resultsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  resultsText: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.6', // Better readability
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee',
    wordWrap: 'break-word', // Ensure long words break properly
  },
};

export default AnswerRetrieval;