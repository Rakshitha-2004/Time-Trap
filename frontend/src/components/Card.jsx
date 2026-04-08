// src/components/Card.jsx
import React from "react";

export default function Card({ icon, title, value, adminOnly = false, isAdmin = false }) {
  // If this card is admin-only and user is not admin, hide it
  if (adminOnly && !isAdmin) return null;

  return (
    <div className="card" style={cardStyle}>
      <i className={icon} style={iconStyle}></i>
      <h4 style={titleStyle}>{title}</h4>
      <div style={counterStyle}>{value}</div>
    </div>
  );
}

// Inline styles (you can later move to CSS)
const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
  transition: "0.3s",
  textAlign: "center",
  marginBottom: "20px",
};

const iconStyle = {
  fontSize: "32px",
  color: "#1d2671",
};

const titleStyle = {
  marginTop: "10px",
  fontSize: "18px",
  color: "#333",
};

const counterStyle = {
  fontSize: "26px",
  marginTop: "10px",
  fontWeight: "600",
};