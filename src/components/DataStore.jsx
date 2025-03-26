import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffNav from './StaffNav';
import StudentNav from './StudentNav';

const DataStore = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve username and role from localStorage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  useEffect(() => {
    console.log("Role:", role);
    console.log("Username:", username);
    // You could add an initial GET request here if needed
  }, []); // Empty dependency array since we only want this to run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/store', {
        text: text
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage('Data stored successfully!');
      setText('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to store data');
      } else {
        setError('An error occurred while storing data');
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
      {role === "teacher" ? (
        <StaffNav username={username} />
      ) : (
        <StudentNav username={username} />
      )}
      <div style={styles.parent}>
        <div style={styles.container}>
          <h2 style={{ ...styles.title, color: themeColor }}>Store Data</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to store"
              rows="10" // Increased from 5 to 10 for more visible lines
              cols="50"
              disabled={loading}
              style={styles.textarea}
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{ ...styles.button, backgroundColor: themeColor }}
            >
              {loading ? 'Storing...' : 'Store Data'}
            </button>
          </form>
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  parent: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Consistent subtle gradient
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    margin: '10px',
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
    gap: '10px',
  },
  textarea: {
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical', // Allow vertical resizing only
    minHeight: '350px', // Increased from 120px to 200px for a taller textarea
    backgroundColor: '#fafafa',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.3s',
    ':focus': { // Note: This pseudo-class won't work in inline styles; consider CSS file for full effect
      borderColor: '#666',
    },
  },
  button: {
    padding: '14px',
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
    marginTop: '15px',
    fontWeight: '500',
  },
  error: {
    color: '#e74c3c', // Red for error (consistent across roles)
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '15px',
    fontWeight: '500',
  },
};

export default DataStore;