import React from "react";
import "./footer.css"; // Import CSS for styling

const Footer = ({ username }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <footer className="footer">
      <p>Welcome, {username}</p>
      <p>Date: {currentDate}</p>
    </footer>
  );
};

export default Footer;
