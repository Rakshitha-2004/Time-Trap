import React, { useEffect, useMemo, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import "./Monitor.css";

const openedApps = [
  { name: "Instagram", category: "Social Media", time: 25, type: "distracting" },
  { name: "YouTube", category: "Entertainment / Learning", time: 40, type: "neutral" },
  { name: "Facebook", category: "Social Media", time: 18, type: "distracting" },
  { name: "WhatsApp", category: "Messaging / Communication", time: 22, type: "neutral" },
  { name: "Twitter", category: "Social Media", time: 14, type: "distracting" },
  { name: "Snapchat", category: "Social Media", time: 8, type: "distracting" },
  { name: "Telegram", category: "Messaging / Communication", time: 16, type: "neutral" },
  { name: "Netflix", category: "Entertainment / Streaming", time: 30, type: "distracting" },
  { name: "VS Code", category: "Work / Development", time: 60, type: "productive" },
  { name: "Google Docs", category: "Documentation / Study", time: 35, type: "productive" },
  { name: "Chrome", category: "Browser / Informative", time: 20, type: "neutral" },
];

const Monitor = ({ theme, setTheme }) => {
  const [trackedApps, setTrackedApps] = useState([]);
  const [popup, setPopup] = useState(null);
  const [shownPopups, setShownPopups] = useState({});

  const saveAlert = (appName, status, customMessage = null) => {
    const existing = JSON.parse(localStorage.getItem("alertHistory")) || [];

    const message =
      customMessage ||
      (status === "Near Limit"
        ? `${appName} is close to limit`
        : status === "Limit Reached"
        ? `${appName} exceeded limit`
        : status === "Blocked"
        ? `${appName} has been blocked after reaching limit`
        : `${appName} status changed`);

    const newAlert = {
      appName,
      status,
      message,
      timestamp: new Date().toLocaleString(),
    };

    localStorage.setItem("alertHistory", JSON.stringify([newAlert, ...existing]));
    window.dispatchEvent(new Event("alertHistoryUpdated"));
  };

  const getBlockedApps = () => {
    return JSON.parse(localStorage.getItem("blockedApps")) || [];
  };

  const setBlockedApps = (apps) => {
    localStorage.setItem("blockedApps", JSON.stringify(apps));
  };

  const buildTrackedApps = () => {
    const storedLimits = JSON.parse(localStorage.getItem("appLimits")) || [];
    const blockedApps = getBlockedApps();

    return openedApps
      .filter((app) =>
        storedLimits.some((limitItem) => limitItem.appName === app.name)
      )
      .map((app) => {
        const matchedLimit = storedLimits.find(
          (limitItem) => limitItem.appName === app.name
        );

        const currentLimit = matchedLimit ? Number(matchedLimit.limit) : null;
        let currentStatus = "Active";

        if (blockedApps.includes(app.name)) {
          currentStatus = "Blocked";
        } else if (currentLimit !== null) {
          if (app.time >= currentLimit) {
            currentStatus = "Limit Reached";
          } else if (app.time >= currentLimit - 5) {
            currentStatus = "Near Limit";
          }
        }

        return {
          ...app,
          limit: currentLimit,
          status: currentStatus,
        };
      });
  };

  const loadTrackedApps = () => {
    setTrackedApps(buildTrackedApps());
  };

  useEffect(() => {
    loadTrackedApps();

    const handleLimitsUpdate = () => {
      loadTrackedApps();
      setShownPopups({});
    };

    window.addEventListener("appLimitsUpdated", handleLimitsUpdate);
    return () => {
      window.removeEventListener("appLimitsUpdated", handleLimitsUpdate);
    };
  }, []);

  useEffect(() => {
    if (trackedApps.length === 0) return;

    const timer = setInterval(() => {
      setTrackedApps((prevApps) =>
        prevApps.map((app) => {
          if (app.status === "Blocked") return app;

          const updatedTime = app.time + 1;
          let updatedStatus = "Active";

          if (app.limit !== null) {
            if (updatedTime >= app.limit) {
              updatedStatus = "Limit Reached";
            } else if (updatedTime >= app.limit - 5) {
              updatedStatus = "Near Limit";
            }
          }

          return {
            ...app,
            time: updatedTime,
            status: updatedStatus,
          };
        })
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [trackedApps.length]);

  useEffect(() => {
    trackedApps.forEach((app) => {
      if (!app.limit || app.status === "Blocked") return;

      const popupKey = `${app.name}-${app.status}`;

      if (app.status === "Near Limit" && !shownPopups[popupKey]) {
        setPopup({
          type: "warning",
          appName: app.name,
          message: `${app.name} is near its limit!`,
        });

        saveAlert(app.name, "Near Limit");

        setShownPopups((prev) => ({
          ...prev,
          [popupKey]: true,
        }));
      }

      if (app.status === "Limit Reached" && !shownPopups[popupKey]) {
        setPopup({
          type: "limit",
          appName: app.name,
          message: `${app.name} limit reached!`,
        });

        saveAlert(app.name, "Limit Reached");

        setShownPopups((prev) => ({
          ...prev,
          [popupKey]: true,
        }));
      }
    });
  }, [trackedApps, shownPopups]);

  const productiveCount = useMemo(
    () => trackedApps.filter((app) => app.type === "productive").length,
    [trackedApps]
  );

  const distractingCount = useMemo(
    () => trackedApps.filter((app) => app.type === "distracting").length,
    [trackedApps]
  );

  const limitReachedCount = useMemo(
    () =>
      trackedApps.filter(
        (app) => app.status === "Limit Reached" || app.status === "Blocked"
      ).length,
    [trackedApps]
  );

  const blockedCount = useMemo(
    () => trackedApps.filter((app) => app.status === "Blocked").length,
    [trackedApps]
  );

  const totalTrackedTime = useMemo(
    () => trackedApps.reduce((total, app) => total + app.time, 0),
    [trackedApps]
  );

  const highestUsageApp = useMemo(() => {
    if (trackedApps.length === 0) return "None";
    return trackedApps.reduce((max, app) => (app.time > max.time ? app : max)).name;
  }, [trackedApps]);

  const formatMinutes = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getStatusClass = (status, type) => {
    if (status === "Blocked") return "blocked-status";
    if (status === "Limit Reached") return "limit-reached";
    if (status === "Near Limit") return "near-limit";
    return type;
  };

  const handleExtendTime = () => {
    if (!popup) return;

    const limits = JSON.parse(localStorage.getItem("appLimits")) || [];

    const updatedLimits = limits.map((item) =>
      item.appName === popup.appName
        ? { ...item, limit: Number(item.limit) + 10 }
        : item
    );

    localStorage.setItem("appLimits", JSON.stringify(updatedLimits));
    window.dispatchEvent(new Event("appLimitsUpdated"));

    setTrackedApps((prevApps) =>
      prevApps.map((app) =>
        app.name === popup.appName
          ? {
              ...app,
              limit: (app.limit || 0) + 10,
              status: "Active",
            }
          : app
      )
    );

    const blockedApps = getBlockedApps().filter((name) => name !== popup.appName);
    setBlockedApps(blockedApps);

    saveAlert(
      popup.appName,
      "Extended",
      `${popup.appName} was extended by 10 minutes`
    );

    setShownPopups((prev) => {
      const updatedState = { ...prev };
      delete updatedState[`${popup.appName}-Near Limit`];
      delete updatedState[`${popup.appName}-Limit Reached`];
      return updatedState;
    });

    setPopup(null);
  };

  const handleClosePopup = () => {
    if (!popup) return;

    if (popup.type === "limit") {
      const blockedApps = getBlockedApps();
      if (!blockedApps.includes(popup.appName)) {
        setBlockedApps([...blockedApps, popup.appName]);
      }

      setTrackedApps((prevApps) =>
        prevApps.map((app) =>
          app.name === popup.appName
            ? {
                ...app,
                status: "Blocked",
              }
            : app
        )
      );

      saveAlert(
        popup.appName,
        "Blocked",
        `${popup.appName} has been blocked after reaching limit`
      );
    } else {
      saveAlert(
        popup.appName,
        "Dismissed",
        `${popup.appName} warning popup was closed`
      );
    }

    setPopup(null);
  };

  const unblockApp = (appName) => {
    const blockedApps = getBlockedApps().filter((name) => name !== appName);
    setBlockedApps(blockedApps);

    setTrackedApps((prevApps) =>
      prevApps.map((app) =>
        app.name === appName
          ? {
              ...app,
              status: app.limit !== null && app.time >= app.limit ? "Limit Reached" : "Active",
            }
          : app
      )
    );

    saveAlert(appName, "Unblocked", `${appName} was manually unblocked`);
  };

  return (
    <AnimatedBackground>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="monitor-page">
        <div className="monitor-topbar">
          <div>
            <h1 className="monitor-title">Monitor</h1>
            <p className="monitor-subtitle">
              Showing tracked apps based on the limits you set in Settings.
            </p>
          </div>
        </div>

        <div className="monitor-summary-grid">
          <div className="monitor-summary-card card-blue">
            <h3>Tracking Status</h3>
            <p className="summary-number">Active</p>
            <span>Live timer is running</span>
          </div>

          <div className="monitor-summary-card card-pink">
            <h3>Tracked Apps</h3>
            <p className="summary-number">{trackedApps.length}</p>
            <span>Apps selected in Settings</span>
          </div>

          <div className="monitor-summary-card card-green">
            <h3>Productive Apps</h3>
            <p className="summary-number">{productiveCount}</p>
            <span>Tracked work/study apps</span>
          </div>

          <div className="monitor-summary-card card-yellow">
            <h3>Blocked / Reached</h3>
            <p className="summary-number">{limitReachedCount}</p>
            <span>Apps that hit the limit</span>
          </div>
        </div>

        <div className="monitor-main-grid">
          <div className="monitor-card large-card">
            <h2>Tracked Open Apps</h2>
            <p className="card-desc">
              These apps were selected in Settings and are currently being monitored.
            </p>

            <div className="opened-apps-list">
              {trackedApps.length === 0 ? (
                <div className="empty-monitor-box">
                  <p>No tracked apps found. Go to Settings and add limits first.</p>
                </div>
              ) : (
                trackedApps.map((app, index) => (
                  <div className="opened-app-item" key={app.name || index}>
                    <div className="opened-left">
                      <h4>{app.name}</h4>
                      <p>{app.category}</p>
                    </div>

                    <div className="opened-middle">
                      <span className="opened-time">
                        Used: {formatMinutes(app.time)}
                      </span>
                      <span className="opened-limit">
                        Limit: {app.limit ?? 0}m
                      </span>
                    </div>

                    <div className="opened-right">
                      <span className={`status-badge ${getStatusClass(app.status, app.type)}`}>
                        {app.status}
                      </span>

                      {app.status === "Blocked" && (
                        <button
                          className="unblock-btn"
                          onClick={() => unblockApp(app.name)}
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="monitor-card side-card">
            <h2>Current Focus</h2>
            <p className="card-desc">Quick view of the live tracked session.</p>

            <div className="focus-list">
              <div className="focus-row">
                <span>Tracking Mode</span>
                <strong>Live Timer</strong>
              </div>

              <div className="focus-row">
                <span>Limit Source</span>
                <strong>Settings</strong>
              </div>

              <div className="focus-row">
                <span>Near Limit Rule</span>
                <strong>Last 5 mins</strong>
              </div>

              <div className="focus-row">
                <span>Total Tracked Time</span>
                <strong>{formatMinutes(totalTrackedTime)}</strong>
              </div>

              <div className="focus-row">
                <span>Highest Usage App</span>
                <strong>{highestUsageApp}</strong>
              </div>

              <div className="focus-row">
                <span>Blocked Apps</span>
                <strong>{blockedCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="monitor-lower-grid">
          <div className="monitor-card">
            <h2>Live Insights</h2>
            <p className="card-desc">
              Smart observations based on current tracked app usage.
            </p>

            <div className="insight-list">
              <div className="insight-item">
                📌 Only apps with saved limits from Settings are shown here.
              </div>
              <div className="insight-item">
                📌 App time now increases automatically every few seconds.
              </div>
              <div className="insight-item">
                📌 If limit popup is closed without extending, the app becomes blocked.
              </div>
            </div>
          </div>

          <div className="monitor-card">
            <h2>Monitor Rules</h2>
            <p className="card-desc">
              Current frontend rules for tracked apps.
            </p>

            <div className="rules-list">
              <div className="rule-row">
                <span>Show only selected apps</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>Increase timer automatically</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>Popup alerts</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>Block after limit</span>
                <strong>Enabled</strong>
              </div>
            </div>
          </div>

          <div className="monitor-card">
            <h2>Session Summary</h2>
            <p className="card-desc">
              Quick overall view of this monitoring session.
            </p>

            <div className="rules-list">
              <div className="rule-row">
                <span>Tracked Productive Apps</span>
                <strong>{productiveCount}</strong>
              </div>
              <div className="rule-row">
                <span>Tracked Distracting Apps</span>
                <strong>{distractingCount}</strong>
              </div>
              <div className="rule-row">
                <span>Reached Limit</span>
                <strong>{limitReachedCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {popup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h2>
                {popup.type === "limit" ? "🚨 Limit Reached" : "⚠️ Warning"}
              </h2>

              <p>{popup.message}</p>

              <div className="popup-actions">
                {popup.type === "limit" && (
                  <button className="extend-btn" onClick={handleExtendTime}>
                    ➕ Extend 10 mins
                  </button>
                )}

                <button className="close-btn" onClick={handleClosePopup}>
                  {popup.type === "limit" ? "Block App" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Monitor;