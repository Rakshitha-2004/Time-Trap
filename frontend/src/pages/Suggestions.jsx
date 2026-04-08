import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import "./Suggestions.css";

function Suggestions({ theme, setTheme }) {
  const [savedLimits, setSavedLimits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLimits = () => {
      const storedLimits = localStorage.getItem("appLimits");
      const parsedLimits = storedLimits ? JSON.parse(storedLimits) : [];
      setSavedLimits(parsedLimits);
    };

    loadLimits();
    window.addEventListener("appLimitsUpdated", loadLimits);

    return () => {
      window.removeEventListener("appLimitsUpdated", loadLimits);
    };
  }, []);

  const suggestionsData = useMemo(() => {
    if (savedLimits.length === 0) {
      return [
        {
          title: "Start by setting limits",
          desc: "Add app limits in Settings so TimeTrap can give smarter suggestions.",
        },
        {
          title: "Balance your screen time",
          desc: "Try setting shorter limits for distracting apps and longer limits for productive apps.",
        },
        {
          title: "Enable focus habits",
          desc: "Use lower limits for social apps during study or work hours.",
        },
      ];
    }

    const distractingApps = [
      "Instagram",
      "YouTube",
      "Facebook",
      "Twitter",
      "Snapchat",
      "Netflix",
    ];

    const productiveApps = [
      "VS Code",
      "Google Docs",
      "Chrome",
      "Telegram",
      "WhatsApp",
    ];

    const lowLimitApps = savedLimits.filter((app) => Number(app.limit) <= 15);
    const highLimitApps = savedLimits.filter((app) => Number(app.limit) >= 60);
    const distractingTracked = savedLimits.filter((app) =>
      distractingApps.includes(app.appName)
    );
    const productiveTracked = savedLimits.filter((app) =>
      productiveApps.includes(app.appName)
    );

    const dynamicTips = [];

    if (lowLimitApps.length > 0) {
      dynamicTips.push({
        title: "Strict control active",
        desc: `You set very low limits for ${lowLimitApps
          .map((app) => app.appName)
          .join(", ")}. That is great for reducing distractions quickly.`,
      });
    }

    if (highLimitApps.length > 0) {
      dynamicTips.push({
        title: "High limit warning",
        desc: `${highLimitApps
          .map((app) => app.appName)
          .join(", ")} has a high time limit. You may want to reduce it for better focus.`,
      });
    }

    if (distractingTracked.length > productiveTracked.length) {
      dynamicTips.push({
        title: "Too many distracting apps",
        desc: "You are tracking more distracting apps than productive apps. Try balancing them better.",
      });
    } else {
      dynamicTips.push({
        title: "Good balance",
        desc: "Your saved limits show a decent balance between productive and distracting apps.",
      });
    }

    dynamicTips.push({
      title: "Next smart step",
      desc: "Once popup alerts are connected, these saved limits will trigger warnings automatically.",
    });

    return dynamicTips;
  }, [savedLimits]);

  const focusScore = useMemo(() => {
    if (savedLimits.length === 0) return 50;

    const total = savedLimits.reduce((sum, app) => sum + (Number(app.limit) || 0), 0);
    const avg = total / savedLimits.length;

    if (avg <= 20) return 88;
    if (avg <= 35) return 78;
    if (avg <= 50) return 70;
    return 60;
  }, [savedLimits]);

  const handleReviewSavedLimits = () => {
    navigate("/settings");
  };

  const handleReduceSocialMedia = () => {
    const socialApps = [
      "Instagram",
      "YouTube",
      "Facebook",
      "Twitter",
      "Snapchat",
      "Netflix",
    ];

    const socialTracked = savedLimits.filter((app) =>
      socialApps.includes(app.appName)
    );

    if (socialTracked.length === 0) {
      alert("No social media app limits found yet.");
      return;
    }

    const names = socialTracked.map((app) => app.appName).join(", ");
    alert(
      `Social media limits detected for: ${names}. You can reduce them from Settings.`
    );
    navigate("/settings");
  };

  const handlePrepareAlertRules = () => {
    alert(
      "Alert system is ready for the next step. You can continue from Monitor and Alerts."
    );
    navigate("/alerts");
  };

  return (
    <AnimatedBackground>
      <div className="suggestions-page">
        <Navbar theme={theme} setTheme={setTheme} />

        <div className="suggestions-container">
          <div className="suggestions-left">
            <div className="suggestions-title-box">
              <p className="suggestions-badge">AI Wellness Panel</p>
              <h1>Smart Suggestions</h1>
              <p className="suggestions-subtitle">
                Suggestions now react to the app limits you set in Settings.
              </p>
            </div>

            <div className="tips-list">
              {suggestionsData.map((tip, index) => (
                <div className="tip-row" key={index}>
                  <div className="tip-number">{index + 1}</div>
                  <div className="tip-content">
                    <h3>{tip.title}</h3>
                    <p>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="suggestions-right">
            <div className="focus-box">
              <h2>Focus Score</h2>
              <div className="focus-circle">
                <span>{focusScore}%</span>
              </div>
              <p>
                {focusScore >= 80
                  ? "Excellent control"
                  : focusScore >= 70
                  ? "Good, but can improve"
                  : "Needs better balance"}
              </p>
            </div>

            <div className="action-box">
              <h3>Quick Actions</h3>
              <button onClick={handleReviewSavedLimits}>Review Saved Limits</button>
              <button onClick={handleReduceSocialMedia}>Reduce Social Media</button>
              <button onClick={handlePrepareAlertRules}>Prepare Alert Rules</button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default Suggestions;