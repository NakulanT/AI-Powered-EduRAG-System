import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaUserTie, FaSignOutAlt, FaPlus, FaDatabase, FaQuestion } from "react-icons/fa";

function StaffNav({ username }) { // username prop is actually email
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out staff:", username);
    localStorage.removeItem("email"); // Changed from username to email
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.username}>
        <FaUserTie style={styles.icon} /> {username}
      </h2>
      <div style={styles.links}>
        <Link to="/Home" style={styles.link}>
          <FaBook style={styles.icon} /> Subjects
        </Link>
        <Link to="/students/viewed" style={styles.link}>
          <FaUsers style={styles.icon} /> Students
        </Link>
        <Link to="/create-questions" style={styles.create}>
          <FaPlus style={styles.icon} /> Create
        </Link>
        <Link to="/data-store" style={styles.link}>
          <FaDatabase style={styles.icon} /> Data Store
        </Link>
        <Link to="/answer-retrieval" style={styles.link}>
          <FaQuestion style={styles.icon} /> Ask Question
        </Link>
        <button onClick={handleLogout} style={styles.logout}>
          <FaSignOutAlt style={styles.icon} /> Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    backgroundColor: "#e74c3c", // Red background for teachers
    borderBottom: "2px solid #ffffff",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  },
  username: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    margin: "0",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "color 0.3s, transform 0.2s", // Added transform transition
  },
  linkHover: {
    color: "#ffd1d1", // Lighter red on hover
    transform: "scale(1.05)", // Slight scale effect on hover
  },
  create: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    transition: "color 0.3s, transform 0.2s", // Added transform transition
    textDecoration: "none",
  },
  createHover: {
    color: "#ffd1d1", // Lighter red on hover
    transform: "scale(1.05)", // Slight scale effect on hover
  },
  logout: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    transition: "color 0.3s, transform 0.2s", // Added transform transition
  },
  logoutHover: {
    color: "#ffd1d1", // Lighter red on hover
    transform: "scale(1.05)", // Slight scale effect on hover
  },
  icon: {
    fontSize: "16px",
  },
};

// Add hover effects using onMouseEnter and onMouseLeave
const StaffNavWithHover = (props) => {
  const [hoveredLink, setHoveredLink] = React.useState(null);

  return (
    <StaffNav
      {...props}
      linkStyle={(index) => ({
        ...styles.link,
        ...(hoveredLink === index ? styles.linkHover : {}),
      })}
      createStyle={{
        ...styles.create,
        ...(hoveredLink === "create" ? styles.createHover : {}),
      }}
      logoutStyle={{
        ...styles.logout,
        ...(hoveredLink === "logout" ? styles.logoutHover : {}),
      }}
      onLinkHover={(index) => setHoveredLink(index)}
      onLinkLeave={() => setHoveredLink(null)}
    />
  );
};

const StaffNavFinal = (props) => {
  const linkStyle = props.linkStyle || (() => styles.link);
  const createStyle = props.createStyle || styles.create;
  const logoutStyle = props.logoutStyle || styles.logout;
  const onLinkHover = props.onLinkHover || (() => {});
  const onLinkLeave = props.onLinkLeave || (() => {});

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.username}>
        <FaUserTie style={styles.icon} /> {props.username}
      </h2>
      <div style={styles.links}>
        <Link
          to="/Home"
          style={linkStyle(0)}
          onMouseEnter={() => onLinkHover(0)}
          onMouseLeave={onLinkLeave}
        >
          <FaBook style={styles.icon} /> Subjects
        </Link>
        <Link
          to="/students/viewed"
          style={linkStyle(1)}
          onMouseEnter={() => onLinkHover(1)}
          onMouseLeave={onLinkLeave}
        >
          <FaUsers style={styles.icon} /> Students
        </Link>
        <Link
          to="/create-questions"
          style={createStyle}
          onMouseEnter={() => onLinkHover("create")}
          onMouseLeave={onLinkLeave}
        >
          <FaPlus style={styles.icon} /> Create
        </Link>
        <Link
          to="/data-store"
          style={linkStyle(2)}
          onMouseEnter={() => onLinkHover(2)}
          onMouseLeave={onLinkLeave}
        >
          <FaDatabase style={styles.icon} /> Data Store
        </Link>
        <Link
          to="/answer-retrieval"
          style={linkStyle(3)}
          onMouseEnter={() => onLinkHover(3)}
          onMouseLeave={onLinkLeave}
        >
          <FaQuestion style={styles.icon} /> Ask Question
        </Link>
        <button
          onClick={props.handleLogout}
          style={logoutStyle}
          onMouseEnter={() => onLinkHover("logout")}
          onMouseLeave={onLinkLeave}
        >
          <FaSignOutAlt style={styles.icon} /> Logout
        </button>
      </div>
    </nav>
  );
};

StaffNavFinal.defaultProps = {
  handleLogout: () => {
    console.log("Logging out staff:", StaffNavFinal.defaultProps.username);
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    window.location.href = "/"; // Fallback navigation
  },
};

export default StaffNavWithHover;