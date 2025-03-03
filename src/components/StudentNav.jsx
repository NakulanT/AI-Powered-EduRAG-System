import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaBookmark, FaUserGraduate, FaSignOutAlt } from "react-icons/fa"; 

function StudentNav({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.username}> <FaUserGraduate style={styles.icon} /> {username} </h2>
      <div style={styles.links}>
        <Link to="/subjects" style={styles.link}><FaBook style={styles.icon} /> Subjects</Link>
        <Link to="/saved" style={styles.link}><FaBookmark style={styles.icon} /> Saved</Link>
        <button onClick={handleLogout} style={styles.logout}><FaSignOutAlt style={styles.icon} /> Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "white",
    borderBottom: "3px solid #3498db",
    fontFamily: "'Poppins', sans-serif",
  },
  username: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#3498db",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  links: {
    display: "flex",
    gap: "25px",
  },
  link: {
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    color: "#3498db",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "0.3s",
  },
  logout: {
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    color: "#e74c3c",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
  icon: {
    fontSize: "18px",
  },
};

export default StudentNav;