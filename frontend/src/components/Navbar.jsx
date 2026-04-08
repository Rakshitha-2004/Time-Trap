import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ theme, setTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user?.name || "User";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    // ✅ clear everything properly
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  return (
    <header className="tt-navbar">
      <div className="tt-navbar-left">
        <div className="tt-logo-box">
          <div className="tt-logo-icon">⏳</div>
          <div className="tt-logo-content">
            <h2 className="tt-logo-text">Time Trap</h2>
            <p className="tt-logo-sub">Own your time before it owns you</p>
          </div>
        </div>
      </div>

      <nav className="tt-navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Dashboard
        </NavLink>

        <NavLink to="/monitor" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Monitor
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Reports
        </NavLink>

        <NavLink to="/alerts" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Alerts
        </NavLink>

        <NavLink to="/suggestions" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Suggestions
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? "tt-link active-link" : "tt-link"}>
          Settings
        </NavLink>
      </nav>

      <div className="tt-navbar-right">
        <div className="tt-info-chip">
          {currentTime.toLocaleDateString()}
        </div>

        <div className="tt-info-chip">
          {currentTime.toLocaleTimeString()}
        </div>

        <div className="tt-user-chip">
          <div className="tt-user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="tt-user-name">{userName}</span>
        </div>

        <button
          onClick={handleThemeToggle}
          className="tt-nav-btn"
          type="button"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <button
          onClick={handleLogout}
          className="tt-nav-btn tt-logout-btn"
          type="button"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}