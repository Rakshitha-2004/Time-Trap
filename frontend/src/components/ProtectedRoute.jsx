 import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check login from localStorage
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" />;
  }

  // Render the protected component
  return children;
}