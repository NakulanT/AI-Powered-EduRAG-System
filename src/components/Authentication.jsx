import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Authentication.css";

function Authentication() {
  const [student, setStudent] = useState({ firstName: "", lastName: "", email: "", password: "", dept: "", year: "" });
  const [teacher, setTeacher] = useState({ firstName: "", lastName: "", email: "", password: "", dept: "", position: "" });
  const [isStudentSignUp, setIsStudentSignUp] = useState(false);
  const [isTeacherSignUp, setIsTeacherSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const departments = [
    "Agricultural Engineering",
    "Artificial Intelligence and Data Science",
    "Chemical Engineering",
    "Information Technology",
    "Biomedical Engineering",
    "Civil Engineering",
    "Computer Science and Engineering",
    "Cyber Security",
    "Internet of Things",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
  ];

  const years = ["I", "II", "III", "IV"];
  const positions = ["Assistant Professor", "Professor", "HoD"];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e, role) => {
    if (role === "student") {
      setStudent({ ...student, [e.target.name]: e.target.value });
    } else {
      setTeacher({ ...teacher, [e.target.name]: e.target.value });
    }
  };

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    const user = role === "student" ? student : teacher;
    const isSignUp = role === "student" ? isStudentSignUp : isTeacherSignUp;

    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const endpoint = `http://localhost:5000/${isSignUp ? "register" : "login"}/${role}`;

    setLoading(true);

    try {
      const response = await axios.post(endpoint, user);
      console.log("Response from backend:", response.data); // Debug
      console.log("isSignUp:", isSignUp); // Debug

      if (!isSignUp) {
        console.log("Login successful, storing email and role in localStorage");
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", role);

        console.log("Navigating to /Home");
        toast.success("Login successful! Redirecting...");
        navigate("/Home", { replace: true }); // Use replace to avoid adding to history stack

        // Fallback navigation in case navigate fails
        setTimeout(() => {
          if (window.location.pathname !== "/Home") {
            console.log("Fallback navigation triggered");
            window.location.href = "/Home";
          }
        }, 500);
      } else {
        toast.success(response.data.message);
        if (role === "student") {
          setStudent({ firstName: "", lastName: "", email: "", password: "", dept: "", year: "" });
          setIsStudentSignUp(false);
        } else {
          setTeacher({ firstName: "", lastName: "", email: "", password: "", dept: "", position: "" });
          setIsTeacherSignUp(false);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong!";
      console.error("Error during authentication:", errorMessage);
      toast.error(`Error: ${errorMessage}`);
      if (!isSignUp) {
        if (role === "student") {
          setStudent({ ...student, email: "", password: "" });
        } else {
          setTeacher({ ...teacher, email: "", password: "" });
        }
      }
    } finally {
      setLoading(false);
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
          {isStudentSignUp && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={student.firstName}
                onChange={(e) => handleChange(e, "student")}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={student.lastName}
                onChange={(e) => handleChange(e, "student")}
                required
                disabled={loading}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={(e) => handleChange(e, "student")}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={student.password}
            onChange={(e) => handleChange(e, "student")}
            required
            disabled={loading}
          />
          {isStudentSignUp && (
            <>
              <select
                name="dept"
                value={student.dept}
                onChange={(e) => handleChange(e, "student")}
                required
                disabled={loading}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={student.year}
                onChange={(e) => handleChange(e, "student")}
                required
                disabled={loading}
              >
                <option value="">-- Select Year --</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isStudentSignUp ? "Sign Up" : "Sign In"}
          </button>
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
          {isTeacherSignUp && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={teacher.firstName}
                onChange={(e) => handleChange(e, "teacher")}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={teacher.lastName}
                onChange={(e) => handleChange(e, "teacher")}
                required
                disabled={loading}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={teacher.email}
            onChange={(e) => handleChange(e, "teacher")}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={teacher.password}
            onChange={(e) => handleChange(e, "teacher")}
            required
            disabled={loading}
          />
          {isTeacherSignUp && (
            <>
              <select
                name="dept"
                value={teacher.dept}
                onChange={(e) => handleChange(e, "teacher")}
                required
                disabled={loading}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                name="position"
                value={teacher.position}
                onChange={(e) => handleChange(e, "teacher")}
                required
                disabled={loading}
              >
                <option value="">-- Select Position --</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isTeacherSignUp ? "Sign Up" : "Sign In"}
          </button>
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