import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaUserTie, FaSignOutAlt, FaPlus, FaDatabase, FaQuestion } from "react-icons/fa";
import "./StaffNav.css";

function StaffNav({ username }) {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    console.log("Logging out staff:", username);
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="staff-nav">
      <h2 className="staff-nav-username">
        <FaUserTie className="staff-nav-icon" /> {name} - {username}
      </h2>
      <div className="staff-nav-links">
        <Link to="/Home" className="staff-nav-link">
          <FaBook className="staff-nav-icon" /> Subjects
        </Link>
        <Link to="/students/viewed" className="staff-nav-link">
          <FaUsers className="staff-nav-icon" /> Students
        </Link>
        <Link to="/create-questions" className="staff-nav-create">
          <FaPlus className="staff-nav-icon" /> Create
        </Link>
        <Link to="/data-store" className="staff-nav-link">
          <FaDatabase className="staff-nav-icon" /> Data Store
        </Link>
        <Link to="/answer-retrieval" className="staff-nav-link">
          <FaQuestion className="staff-nav-icon" /> Ask Question
        </Link>
        <button onClick={handleLogout} className="staff-nav-logout">
          <FaSignOutAlt className="staff-nav-icon" /> Logout
        </button>
      </div>
    </nav>
  );
}

// Add hover effects using onMouseEnter and onMouseLeave
const StaffNavWithHover = (props) => {
  const [hoveredLink, setHoveredLink] = React.useState(null);

  return (
    <StaffNav
      {...props}
      linkClass={(index) =>
        `staff-nav-link ${hoveredLink === index ? "staff-nav-link-hover" : ""}`
      }
      createClass={`staff-nav-create ${
        hoveredLink === "create" ? "staff-nav-create-hover" : ""
      }`}
      logoutClass={`staff-nav-logout ${
        hoveredLink === "logout" ? "staff-nav-logout-hover" : ""
      }`}
      onLinkHover={(index) => setHoveredLink(index)}
      onLinkLeave={() => setHoveredLink(null)}
    />
  );
};

const StaffNavFinal = (props) => {
  const linkClass = props.linkClass || (() => "staff-nav-link");
  const createClass = props.createClass || "staff-nav-create";
  const logoutClass = props.logoutClass || "staff-nav-logout";
  const onLinkHover = props.onLinkHover || (() => {});
  const onLinkLeave = props.onLinkLeave || (() => {});

  return (
    <nav className="staff-nav">
      <h2 className="staff-nav-username">
        <FaUserTie className="staff-nav-icon" /> {props.username}
      </h2>
      <div className="staff-nav-links">
        <Link
          to="/Home"
          className={linkClass(0)}
          onMouseEnter={() => onLinkHover(0)}
          onMouseLeave={onLinkLeave}
        >
          <FaBook className="staff-nav-icon" /> Subjects
        </Link>
        <Link
          to="/students/viewed"
          className={linkClass(1)}
          onMouseEnter={() => onLinkHover(1)}
          onMouseLeave={onLinkLeave}
        >
          <FaUsers className="staff-nav-icon" /> Students
        </Link>
        <Link
          to="/create-questions"
          className={createClass}
          onMouseEnter={() => onLinkHover("create")}
          onMouseLeave={onLinkLeave}
        >
          <FaPlus className="staff-nav-icon" /> Create
        </Link>
        <Link
          to="/data-store"
          className={linkClass(2)}
          onMouseEnter={() => onLinkHover(2)}
          onMouseLeave={onLinkLeave}
        >
          <FaDatabase className="staff-nav-icon" /> Data Store
        </Link>
        <Link
          to="/answer-retrieval"
          className={linkClass(3)}
          onMouseEnter={() => onLinkHover(3)}
          onMouseLeave={onLinkLeave}
        >
          <FaQuestion className="staff-nav-icon" /> Ask Question
        </Link>
        <button
          onClick={props.handleLogout}
          className={logoutClass}
          onMouseEnter={() => onLinkHover("logout")}
          onMouseLeave={onLinkLeave}
        >
          <FaSignOutAlt className="staff-nav-icon" /> Logout
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
    localStorage.removeItem("name");
    window.location.href = "/"; // Fallback navigation
  },
};

export default StaffNavWithHover;