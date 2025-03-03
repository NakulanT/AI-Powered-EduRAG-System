import './App.css';
import React from 'react';
import Authentication from './components/Authentication.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import SubjectDetails from "./components/SubjectDetails";
import SetDetails from "./components/SetDetails";
import StudentsView from "./components/StudentsView";
import CreateQuestions from "./components/CreateQuestions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subjects/:subjectName" element={<SubjectDetails />} />
        <Route path="/subjects/:subjectName/:setName" element={<SetDetails />} />
        <Route path="/students/viewed" element={<StudentsView />} />
        <Route path="/create-questions" element={<CreateQuestions />} /> 
      </Routes>
    </Router>
  );
}

export default App;