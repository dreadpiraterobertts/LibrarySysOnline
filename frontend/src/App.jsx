import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LoanManagement from "./pages/LoanManagement";
import Books from "./pages/Books";
import Users from "./pages/Users";
import IssueLoan from "./forms/IssueLoan";
import Login from "./pages/Login";
import Footer from "./components/Footer";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [id,setId] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("user_name");
    const storedId = localStorage.getItem("id")
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername); // Restore username
      setId(storedId)
    }
  }, []);

  const handleLogin = (loggedInUsername,id) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setId(id)
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("id")
    setIsAuthenticated(false);
    setUsername(""); // Clear username
    setId("")
  };

  return isAuthenticated ? (
    <BrowserRouter>
      <Navbar username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard username={username} id={id} />} />
        <Route path="/loan" element={<LoanManagement />} />
        <Route path="/book" element={<Books />} />
        <Route path="/user" element={<Users />} />
        <Route path="/issue" element={<IssueLoan />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  ) : (
    <Login onLogin={handleLogin} />
  );
};

export default App;
