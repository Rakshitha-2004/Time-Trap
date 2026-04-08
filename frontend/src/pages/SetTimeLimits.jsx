// src/pages/SetTimeLimits.jsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SetTimeLimits() {
  const [limits, setLimits] = useState(
    JSON.parse(localStorage.getItem("timeLimits")) || {}
  );
  const [appName, setAppName] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(false), 2000);
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleAddLimit = (e) => {
    e.preventDefault();
    if (!appName || !timeLimit) return;
    const updated = { ...limits, [appName]: parseInt(timeLimit) };
    setLimits(updated);
    localStorage.setItem("timeLimits", JSON.stringify(updated));
    setAppName("");
    setTimeLimit("");
    setShowPopup(true);
  };

  const toggleDark = () => document.body.classList.toggle("dark");
  const logout = () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main">
        <Navbar onToggleDark={toggleDark} onLogout={logout} />
        <div style={{ padding: "20px" }}>
          <h2 style={{ color: "#1d2671" }}>Set Time Limits</h2>

          <form onSubmit={handleAddLimit} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="App Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              style={{
                padding: "10px",
                marginRight: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="Limit (minutes)"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              style={{
                padding: "10px",
                marginRight: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "120px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                background: "#1d2671",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </form>

          <div style={{ marginTop: "30px" }}>
            <h3>Current Limits</h3>
            <ul>
              {Object.keys(limits).length === 0 && <li>No limits set</li>}
              {Object.entries(limits).map(([app, mins]) => (
                <li key={app}>
                  {app}: {mins} min
                </li>
              ))}
            </ul>
          </div>

          {showPopup && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                background: "#1d2671",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
              }}
            >
              Time limit saved!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}