import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import "./Authentication.css";

function Authentication() {
  const [student, setStudent] = useState({ username: "", password: "" });
  const [teacher, setTeacher] = useState({ username: "", password: "" });

  const [isStudentSignUp, setIsStudentSignUp] = useState(false);
  const [isTeacherSignUp, setIsTeacherSignUp] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e, role) => {
    if (role === "student") {
      setStudent({ ...student, [e.target.name]: e.target.value });
    } else {
      setTeacher({ ...teacher, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    const user = role === "student" ? student : teacher;
    const isSignUp = role === "student" ? isStudentSignUp : isTeacherSignUp;

    const endpoint = `http://localhost:5000/${isSignUp ? "register" : "login"}/${role}`;

    try {
      const response = await axios.post(endpoint, user);

      if (!isSignUp) {
        // Store user details in local storage
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", role);

        // Redirect to home page
        navigate("home");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong!"));
    }
  };

  return (
    <div className="auth-container">
      {/* Student Authentication Card */}
      <div className="auth-card student-card">
        <h2>
          <FaUserGraduate className="icon" /> {isStudentSignUp ? "Student Sign-Up" : "Student Sign-In"}
        </h2>

        <form onSubmit={(e) => handleSubmit(e, "student")}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={student.username}
            onChange={(e) => handleChange(e, "student")}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={student.password}
            onChange={(e) => handleChange(e, "student")}
            required
          />
          <button type="submit">{isStudentSignUp ? "Sign Up" : "Sign In"}</button>
        </form>

        <p className="switch-text">
          {isStudentSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsStudentSignUp(!isStudentSignUp)}>
            {isStudentSignUp ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>

      {/* Teacher Authentication Card */}
      <div className="auth-card teacher-card">
        <h2>
          <FaChalkboardTeacher className="icon" /> {isTeacherSignUp ? "Teacher Sign-Up" : "Teacher Sign-In"}
        </h2>

        <form onSubmit={(e) => handleSubmit(e, "teacher")}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={teacher.username}
            onChange={(e) => handleChange(e, "teacher")}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={teacher.password}
            onChange={(e) => handleChange(e, "teacher")}
            required
          />
          <button type="submit">{isTeacherSignUp ? "Sign Up" : "Sign In"}</button>
        </form>

        <p className="switch-text">
          {isTeacherSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsTeacherSignUp(!isTeacherSignUp)}>
            {isTeacherSignUp ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Authentication;
