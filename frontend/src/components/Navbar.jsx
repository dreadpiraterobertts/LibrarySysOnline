import React from "react";
import './navbar.css'
import whlogo from '../assets/whlogo.png'
import { Link, useLocation, useNavigate } from "react-router-dom";
import logout from '../assets/logout.svg'

const Navbar = ({ username, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate to redirect after logout

  const handleLogout = () => {
    if(confirm("Are you sure you want to logout?")){

    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    onLogout(); // Call the onLogout callback passed from App
    navigate("/"); // Redirect to the Login page or dashboard
    }
  };

  return (
    <nav className="navbar">
      <img src={whlogo} className="navbar-logo" alt="Logo" />
      <h1 className="navbar-title">World Harvest Theology College</h1>
      <div className="navbar-buttons">
        <Link style={{textDecoration: 'none', color: 'white'}} to='/'>
          <button className={location.pathname === "/" ? "active" : ""}>Dashboard</button>
        </Link>
        <Link style={{textDecoration: 'none', color: 'white'}} to='/loan'>
          <button className={location.pathname === "/loan" ? "active" : ""}>Loan Management</button>
        </Link>
        <Link style={{textDecoration: 'none', color: 'white'}} to='/book'>
          <button className={location.pathname === "/book" ? "active" : ""}>Book Management</button>
        </Link>
        <Link style={{textDecoration: 'none', color: 'white'}} to='/user'>
          <button className={location.pathname === "/user" ? "active" : ""}>User Management</button>
        </Link>
          <button className="logout-btn" onClick={handleLogout}><img src={logout} alt="" /></button>
       
      </div>
    </nav>
  );
};

export default Navbar;
