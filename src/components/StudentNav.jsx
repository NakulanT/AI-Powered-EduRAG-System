import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaBookmark, FaUserGraduate, FaSignOutAlt, FaDatabase, FaQuestion } from "react-icons/fa";
import "./StudentNav.css";

function StudentNav({ username }) {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    console.log("Logging out student:", username);
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="student-nav">
      <h2 className="student-nav-username">
        <FaUserGraduate className="student-nav-icon" /> {name} - {username}
      </h2>
      <div className="student-nav-links">
        <Link to="/Home" className="student-nav-link">
          <FaBook className="student-nav-icon" /> Subjects
        </Link>
        <Link to="/Saved" className="student-nav-link">
          <FaBookmark className="student-nav-icon" /> Saved
        </Link>
        <Link to="/data-store" className="student-nav-link">
          <FaDatabase className="student-nav-icon" /> Data Store
        </Link>
        <Link to="/answer-retrieval" className="student-nav-link">
          <FaQuestion className="student-nav-icon" /> Ask Question
        </Link>
        <button onClick={handleLogout} className="student-nav-logout">
          <FaSignOutAlt className="student-nav-icon" /> Logout
        </button>
      </div>
    </nav>
  );
}

// Add hover effects using onMouseEnter and onMouseLeave
const StudentNavWithHover = (props) => {
  const [hoveredLink, setHoveredLink] = React.useState(null);

  return (
    <StudentNav
      {...props}
      linkClass={(index) =>
        `student-nav-link ${hoveredLink === index ? "student-nav-link-hover" : ""}`
      }
      logoutClass={`student-nav-logout ${
        hoveredLink === "logout" ? "student-nav-logout-hover" : ""
      }`}
      onLinkHover={(index) => setHoveredLink(index)}
      onLinkLeave={() => setHoveredLink(null)}
    />
  );
};

const StudentNavFinal = (props) => {
  const linkClass = props.linkClass || (() => "student-nav-link");
  const logoutClass = props.logoutClass || "student-nav-logout";
  const onLinkHover = props.onLinkHover || (() => {});
  const onLinkLeave = props.onLinkLeave || (() => {});

  return (
    <nav className="student-nav">
      <h2 className="student-nav-username">
        <FaUserGraduate className="student-nav-icon" /> {props.username}
      </h2>
      <div className="student-nav-links">
        <Link
          to="/Home"
          className={linkClass(0)}
          onMouseEnter={() => onLinkHover(0)}
          onMouseLeave={onLinkLeave}
        >
          <FaBook className="student-nav-icon" /> Subjects
        </Link>
        <Link
          to="/Saved"
          className={linkClass(1)}
          onMouseEnter={() => onLinkHover(1)}
          onMouseLeave={onLinkLeave}
        >
          <FaBookmark className="student-nav-icon" /> Saved
        </Link>
        <Link
          to="/data-store"
          className={linkClass(2)}
          onMouseEnter={() => onLinkHover(2)}
          onMouseLeave={onLinkLeave}
        >
          <FaDatabase className="student-nav-icon" /> Data Store
        </Link>
        <Link
          to="/answer-retrieval"
          className={linkClass(3)}
          onMouseEnter={() => onLinkHover(3)}
          onMouseLeave={onLinkLeave}
        >
          <FaQuestion className="student-nav-icon" /> Ask Question
        </Link>
        <button
          onClick={props.handleLogout}
          className={logoutClass}
          onMouseEnter={() => onLinkHover("logout")}
          onMouseLeave={onLinkLeave}
        >
          <FaSignOutAlt className="student-nav-icon" /> Logout
        </button>
      </div>
    </nav>
  );
};

StudentNavFinal.defaultProps = {
  handleLogout: () => {
    console.log("Logging out student:", StudentNavFinal.defaultProps.username);
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/"; // Fallback navigation
  },
};

export default StudentNavWithHover;