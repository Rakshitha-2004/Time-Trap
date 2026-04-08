import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const Dashboard = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };
  const [savedLimits, setSavedLimits] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedLimits = JSON.parse(localStorage.getItem("appLimits")) || [];
      const storedAlerts = JSON.parse(localStorage.getItem("alertHistory")) || [];
      setSavedLimits(storedLimits);
      setAlertHistory(storedAlerts);
    };

    loadData();

    window.addEventListener("appLimitsUpdated", loadData);
    window.addEventListener("alertHistoryUpdated", loadData);

    return () => {
      window.removeEventListener("appLimitsUpdated", loadData);
      window.removeEventListener("alertHistoryUpdated", loadData);
    };
  }, []);

  const totalApps = savedLimits.length;

  const lowestLimit = useMemo(() => {
    if (savedLimits.length === 0) return 0;
    return Math.min(...savedLimits.map((item) => Number(item.limit) || 0));
  }, [savedLimits]);

  const mostRestrictedApp = useMemo(() => {
    if (savedLimits.length === 0) return "None";
    return savedLimits.reduce((min, item) =>
      Number(item.limit) < Number(min.limit) ? item : min
    ).appName;
  }, [savedLimits]);

  const focusScore = useMemo(() => {
    if (savedLimits.length === 0) return 50;

    const avg =
      savedLimits.reduce((sum, item) => sum + (Number(item.limit) || 0), 0) /
      savedLimits.length;

    if (avg <= 20) return 88;
    if (avg <= 35) return 78;
    if (avg <= 50) return 70;
    return 60;
  }, [savedLimits]);

  const handleResetAllData = () => {
    const shouldReset = window.confirm(
      "Are you sure you want to reset all saved Time Trap data?"
    );

    if (!shouldReset) return;

    localStorage.removeItem("appLimits");
    localStorage.removeItem("alertHistory");
    localStorage.removeItem("blockedApps");

    window.dispatchEvent(new Event("appLimitsUpdated"));
    window.dispatchEvent(new Event("alertHistoryUpdated"));

    window.location.reload();
  };

  return (
    <AnimatedBackground>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="dashboard-page">
        <div className="dashboard-topbar">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              Welcome, <span>{user.name}</span> 👋
            </h1>
            <p className="dashboard-subtitle">
              Manage your time, reduce distractions, and stay focused.
            </p>
          </div>

          <div>
            <button
              onClick={handleResetAllData}
              type="button"
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "12px 18px",
                background: "linear-gradient(90deg, #ef4444, #f97316)",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(239, 68, 68, 0.22)",
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>

        <div className="dashboard-top-cards">
          <div className="dashboard-stat-card card-blue">
            <h3>Tracked Apps</h3>
            <p className="stat-number">{totalApps}</p>
            <span>Apps saved in Settings</span>
          </div>

          <div className="dashboard-stat-card card-pink">
            <h3>Lowest Limit</h3>
            <p className="stat-number">{lowestLimit}m</p>
            <span>Most strict app limit</span>
          </div>

          <div className="dashboard-stat-card card-green">
            <h3>Focus Score</h3>
            <p className="stat-number">{focusScore}%</p>
            <span>Based on your current saved limits</span>
          </div>

          <div className="dashboard-stat-card card-yellow">
            <h3>Alert History</h3>
            <p className="stat-number">{alertHistory.length}</p>
            <span>Warnings and popup actions stored</span>
          </div>
        </div>

        <div className="dashboard-main-grid">
          <div className="dashboard-card">
            <h2>Quick Overview</h2>
            <p className="card-desc">
              A short summary of your current app control setup.
            </p>

            <div className="overview-list">
              <div className="overview-item">
                <div>
                  <h4>Most Restricted App</h4>
                  <p>{mostRestrictedApp}</p>
                </div>
                <span className="tag-pink">{lowestLimit}m</span>
              </div>

              <div className="overview-item">
                <div>
                  <h4>Total Saved Limits</h4>
                  <p>Current app tracking rules</p>
                </div>
                <span className="tag-green">{totalApps}</span>
              </div>

              <div className="overview-item">
                <div>
                  <h4>Current Status</h4>
                  <p>Settings linked across pages</p>
                </div>
                <span className="tag-blue">Live</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Today's Suggestion</h2>
            <p className="card-desc">
              {mostRestrictedApp !== "None"
                ? `${mostRestrictedApp} currently has the strictest control. You can use Suggestions to improve balance further.`
                : "Set app limits first to generate smarter guidance."}
            </p>
            <div className="suggestion-highlight">
              💡 Focus Score updates based on the limits you save in Settings.
            </div>
          </div>
        </div>

        <div className="feature-section-title">
          <h2>Open Sections</h2>
          <p>Use these sections to explore more detailed information.</p>
        </div>

        <div className="dashboard-feature-grid">
          <div
            className="feature-action-card action-monitor"
            onClick={() => navigate("/monitor")}
          >
            <div className="feature-icon">📱</div>
            <h3>Monitor</h3>
            <p>Track app activity and live usage details.</p>
          </div>

          <div
            className="feature-action-card action-reports"
            onClick={() => navigate("/reports")}
          >
            <div className="feature-icon">📊</div>
            <h3>Reports</h3>
            <p>See reports reacting to your saved limits.</p>
          </div>

          <div
            className="feature-action-card action-limits"
            onClick={() => navigate("/settings")}
          >
            <div className="feature-icon">⏰</div>
            <h3>Set Limits</h3>
            <p>Manage usage rules for social and work apps.</p>
          </div>

          <div
            className="feature-action-card action-alerts"
            onClick={() => navigate("/alerts")}
          >
            <div className="feature-icon">🚨</div>
            <h3>Alerts</h3>
            <p>Review popup warnings and extension actions.</p>
          </div>

          <div
            className="feature-action-card action-tips"
            onClick={() => navigate("/suggestions")}
          >
            <div className="feature-icon">💡</div>
            <h3>Suggestions</h3>
            <p>Get recommendations based on your saved app limits.</p>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;