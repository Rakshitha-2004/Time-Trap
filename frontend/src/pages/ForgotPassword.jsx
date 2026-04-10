import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await fetch("https://time-trap.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg(data.message || "Reset link sent successfully ✅");
      } else {
        setMsg(data.message || "Failed to send reset link");
      }
    } catch (error) {
      setMsg("Server error. Please try again.");
    }
  };

  return (
    <AnimatedBackground>
      <div className="forgot-page">
        <div className="forgot-container">
          <h2>Forgot Password</h2>
          <p className="forgot-subtitle">
            Enter your email and we’ll help you reset your password
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">Send Reset Link</button>
          </form>

          <p className={msg.includes("successfully") || msg.includes("✅") ? "success-msg" : "error-msg"}>
            {msg}
          </p>

          <p className="bottom-text">
            Remembered your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default ForgotPassword;