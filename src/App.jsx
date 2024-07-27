import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import RegistrationForm from "./RegistrationForm";
import UniversityList from "./UniversityList"; // Import the UniversityList component

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/universities" element={<UniversityList />} />
    </Routes>
  );
}

export default App;
