import React, { useEffect, useMemo, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import "./Alerts.css";

const Alerts = ({ theme, setTheme }) => {
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    const loadAlerts = () => {
      const storedAlerts =
        JSON.parse(localStorage.getItem("alertHistory")) || [];
      setAlertHistory(storedAlerts);
    };

    loadAlerts();

    window.addEventListener("alertHistoryUpdated", loadAlerts);
    window.addEventListener("appLimitsUpdated", loadAlerts);

    return () => {
      window.removeEventListener("alertHistoryUpdated", loadAlerts);
      window.removeEventListener("appLimitsUpdated", loadAlerts);
    };
  }, []);

  const criticalAlerts = useMemo(
    () => alertHistory.filter((item) => item.status === "Limit Reached").length,
    [alertHistory]
  );

  const warningAlerts = useMemo(
    () => alertHistory.filter((item) => item.status === "Near Limit").length,
    [alertHistory]
  );

  const extendPrompts = useMemo(
    () => alertHistory.filter((item) => item.status === "Extended").length,
    [alertHistory]
  );

  const dismissedAlerts = useMemo(
    () => alertHistory.filter((item) => item.status === "Dismissed").length,
    [alertHistory]
  );

  const latestAlert = useMemo(() => {
    if (alertHistory.length === 0) return null;
    return alertHistory[0];
  }, [alertHistory]);

  const getAlertCardClass = (status) => {
    if (status === "Limit Reached") return "critical";
    if (status === "Near Limit") return "warning";
    if (status === "Extended") return "extend";
    if (status === "Dismissed") return "dismissed";
    if (status === "Blocked") return "critical";
    if (status === "Unblocked") return "extend";
    return "warning";
  };

  const clearAlertHistory = () => {
    localStorage.setItem("alertHistory", JSON.stringify([]));
    setAlertHistory([]);
    window.dispatchEvent(new Event("alertHistoryUpdated"));
  };

  return (
    <AnimatedBackground>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="alerts-page">
        <div className="alerts-topbar">
          <div>
            <h1 className="alerts-title">Alerts</h1>
            <p className="alerts-subtitle">
              View warnings, popup reminders, extension actions, and dismissed alerts.
            </p>
          </div>

          <button className="clear-alerts-btn" onClick={clearAlertHistory}>
            Clear History
          </button>
        </div>

        <div className="alerts-highlight-grid">
          <div className="alerts-highlight-card card-red">
            <h3>Critical Alerts</h3>
            <p>{criticalAlerts}</p>
            <span>Apps that crossed hard limits</span>
          </div>

          <div className="alerts-highlight-card card-yellow">
            <h3>Warnings</h3>
            <p>{warningAlerts}</p>
            <span>Apps close to time limit</span>
          </div>

          <div className="alerts-highlight-card card-green">
            <h3>Extend Actions</h3>
            <p>{extendPrompts}</p>
            <span>Extra time granted</span>
          </div>

          <div className="alerts-highlight-card card-blue">
            <h3>Dismissed</h3>
            <p>{dismissedAlerts}</p>
            <span>Closed without extension</span>
          </div>
        </div>

        <div className="alerts-main-grid">
          <div className="alerts-card">
            <h2>Latest Alert</h2>
            <p className="card-desc">
              Most recent popup activity from Monitor.
            </p>

            {latestAlert ? (
              <div className={`alert-item ${getAlertCardClass(latestAlert.status)}`}>
                <div>
                  <h4>{latestAlert.appName || "Unknown App"}</h4>
                  <p>{latestAlert.message || "No message available."}</p>
                </div>
                <span>{latestAlert.status || "Info"}</span>
              </div>
            ) : (
              <div className="alert-item warning">
                <div>
                  <h4>No alerts yet</h4>
                  <p>Start Monitor and wait for near-limit or limit-reached popups.</p>
                </div>
                <span>Info</span>
              </div>
            )}
          </div>

          <div className="alerts-card">
            <h2>Alert Rules</h2>
            <p className="card-desc">
              Current alert flow used in Monitor.
            </p>

            <div className="rules-list">
              <div className="rule-row">
                <span>Near limit warning</span>
                <strong>Last 5 mins</strong>
              </div>
              <div className="rule-row">
                <span>Reached limit</span>
                <strong>Popup shown</strong>
              </div>
              <div className="rule-row">
                <span>Extend option</span>
                <strong>+10 mins</strong>
              </div>
              <div className="rule-row">
                <span>Dismiss option</span>
                <strong>Enabled</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="alerts-bottom-grid">
          <div className="alerts-card">
            <h2>Recent Alert History</h2>
            <p className="card-desc">
              Stored alert events from Monitor, latest first.
            </p>

            <div className="history-list">
              {alertHistory.length === 0 ? (
                <div className="history-item">
                  <span>No alert history yet</span>
                  <strong>--</strong>
                </div>
              ) : (
                alertHistory.map((item, index) => (
                  <div className="history-item" key={`${item.appName}-${item.status}-${index}`}>
                    <span>
                      <strong>{item.appName || "Unknown App"}</strong> —{" "}
                      {item.message || "No message available"}
                    </span>
                    <strong>{item.timestamp || "--"}</strong>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="alerts-card">
            <h2>Suggested Actions</h2>
            <p className="card-desc">
              Smart guidance based on alert behavior.
            </p>

            <div className="suggestion-list">
              <div className="suggestion-item">
                💡 Reduce limits for apps that repeatedly reach the maximum.
              </div>
              <div className="suggestion-item">
                💡 Use extension only for productive or necessary apps.
              </div>
              <div className="suggestion-item">
                💡 If the same app keeps warning often, reduce distractions in Settings.
              </div>
              <div className="suggestion-item">
                💡 Dismiss only when you really want to continue without extending.
              </div>
            </div>
          </div>

          <div className="alerts-card">
            <h2>Alert Summary</h2>
            <p className="card-desc">Overall alert system status.</p>

            <div className="rules-list">
              <div className="rule-row">
                <span>Popup Alerts</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>History Storage</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>Extension Support</span>
                <strong>Enabled</strong>
              </div>
              <div className="rule-row">
                <span>Dismiss Tracking</span>
                <strong>Enabled</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Alerts;