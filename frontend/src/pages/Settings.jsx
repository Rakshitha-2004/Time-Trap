import React, { useEffect, useMemo, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import "./Settings.css";

function Settings({ theme, setTheme }) {
  const appOptions = [
    "Instagram",
    "YouTube",
    "Facebook",
    "WhatsApp",
    "Twitter",
    "Snapchat",
    "Telegram",
    "Netflix",
    "VS Code",
    "Google Docs",
    "Chrome",
  ];

  const [selectedApp, setSelectedApp] = useState("Instagram");
  const [timeLimit, setTimeLimit] = useState("");
  const [savedLimits, setSavedLimits] = useState([]);

  useEffect(() => {
    const storedLimits = localStorage.getItem("appLimits");
    if (storedLimits) {
      setSavedLimits(JSON.parse(storedLimits));
    } else {
      const defaultLimits = [
        { appName: "Instagram", limit: 20 },
        { appName: "YouTube", limit: 45 },
      ];
      setSavedLimits(defaultLimits);
      localStorage.setItem("appLimits", JSON.stringify(defaultLimits));
    }
  }, []);

  const updateLocalStorage = (updatedLimits) => {
    setSavedLimits(updatedLimits);
    localStorage.setItem("appLimits", JSON.stringify(updatedLimits));
    window.dispatchEvent(new Event("appLimitsUpdated"));
  };

  const handleSaveLimit = () => {
    if (!selectedApp || !timeLimit) {
      alert("Please select an app and enter time limit");
      return;
    }

    const limitValue = Number(timeLimit);

    if (!limitValue || limitValue <= 0) {
      alert("Please enter a valid time limit");
      return;
    }

    const existingApp = savedLimits.find(
      (item) => item.appName === selectedApp
    );

    let updatedLimits;

    if (existingApp) {
      updatedLimits = savedLimits.map((item) =>
        item.appName === selectedApp ? { ...item, limit: limitValue } : item
      );
    } else {
      updatedLimits = [
        ...savedLimits,
        {
          appName: selectedApp,
          limit: limitValue,
        },
      ];
    }

    updateLocalStorage(updatedLimits);
    setTimeLimit("");
    alert(`Time limit saved for ${selectedApp}`);
  };

  const handleEdit = (appName, limit) => {
    setSelectedApp(appName);
    setTimeLimit(limit.toString());
  };

  const handleDelete = (appName) => {
    const updatedLimits = savedLimits.filter(
      (item) => item.appName !== appName
    );
    updateLocalStorage(updatedLimits);
  };

  const suggestions = useMemo(() => {
    const getLimit = (name) =>
      savedLimits.find((item) => item.appName === name)?.limit;

    const instagramLimit = getLimit("Instagram");
    const youtubeLimit = getLimit("YouTube");

    return [
      {
        title: "Smart balance tip",
        text:
          instagramLimit && instagramLimit > 60
            ? "Instagram limit looks high. Try keeping it around 30 to 45 minutes for better focus."
            : "Your app controls look good. Keep entertainment apps lower than study or work apps.",
      },
      {
        title: "Warning suggestion",
        text:
          "Later we can show a popup 5 minutes before the selected app reaches its limit.",
      },
      {
        title: "Blocking recommendation",
        text:
          youtubeLimit && youtubeLimit > 90
            ? "YouTube has a large limit. You may want to enable blocking after the warning stage."
            : "For distracting apps, first warn the user, then block only if they continue using it.",
      },
      {
        title: "Productivity idea",
        text:
          "Set shorter limits for social apps and longer limits for useful apps like WhatsApp or Telegram when needed.",
      },
    ];
  }, [savedLimits]);

  return (
    <AnimatedBackground>
      <div className="settings-page-wrapper">
        <Navbar theme={theme} setTheme={setTheme} />

        <div className="settings-main-container">
          <div className="settings-hero">
            <div className="settings-hero-left">
              <p className="settings-tag">TimeTrap Control Center</p>
              <h1>Set App Limits</h1>
              <p className="settings-subtext">
                Choose a specific app, assign a time limit, and manage how your
                screen time should be controlled.
              </p>
            </div>

            <div className="settings-hero-right">
              <div className="mini-stat-card">
                <h3>{savedLimits.length}</h3>
                <p>Apps Controlled</p>
              </div>

              <div className="mini-stat-card">
                <h3>
                  {savedLimits.length > 0
                    ? Math.min(...savedLimits.map((item) => Number(item.limit) || 0))
                    : 0}
                  m
                </h3>
                <p>Lowest Limit</p>
              </div>
            </div>
          </div>

          <div className="settings-grid-layout">
            <div className="limit-control-panel">
              <h2>Set Time for Selected App</h2>

              <div className="form-group">
                <label>Select App</label>
                <select
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                >
                  {appOptions.map((app, index) => (
                    <option key={index} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time Limit (in minutes)</label>
                <input
                  type="number"
                  placeholder="Enter minutes"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                />
              </div>

              <button className="save-limit-btn" onClick={handleSaveLimit}>
                Save Limit
              </button>

              <div className="selected-preview-box">
                <h3>Current Selection</h3>
                <p>
                  <span>App:</span> {selectedApp}
                </p>
                <p>
                  <span>Limit:</span>{" "}
                  {timeLimit ? `${timeLimit} minutes` : "Not entered yet"}
                </p>
              </div>
            </div>

            <div className="saved-limits-panel">
              <h2>Saved App Limits</h2>

              {savedLimits.length === 0 ? (
                <div className="no-limits-box">
                  <p>No time limits saved yet.</p>
                </div>
              ) : (
                savedLimits.map((item, index) => (
                  <div className="saved-limit-row" key={`${item.appName}-${index}`}>
                    <div className="saved-limit-info">
                      <h3>{item.appName}</h3>
                      <p>{item.limit} minutes allowed</p>
                    </div>

                    <div className="saved-limit-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item.appName, item.limit)}
                      >
                        Edit
                      </button>

                      <button
                        className="remove-btn"
                        onClick={() => handleDelete(item.appName)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="suggestions-wrapper">
            <div className="suggestions-header">
              <div>
                <p className="suggestion-small-tag">Smart Suggestions</p>
                <h2>Helpful Recommendations</h2>
              </div>

              <p className="suggestions-side-text">
                These cards are only for smart guidance, so this section looks
                completely different from Monitor and Alerts.
              </p>
            </div>

            <div className="suggestion-card-layout">
              {suggestions.map((item, index) => (
                <div className="suggestion-card" key={index}>
                  <div className="suggestion-icon-circle">
                    <span>{index + 1}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default Settings;