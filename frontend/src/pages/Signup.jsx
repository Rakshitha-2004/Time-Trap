import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("Signup successful ✅ Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMsg(data.message || "Signup failed");
      }
    } catch (error) {
      setMsg("Server error. Please try again.");
    }
  };

  return (
    <AnimatedBackground>
      <div className="signup-page">
        <div className="signup-container">
          <h2>Create Account</h2>
          <p className="signup-subtitle">
            Start your productivity journey with Time Trap
          </p>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Sign Up</button>
          </form>

          <p className={msg.includes("successful") ? "success-msg" : "error-msg"}>
            {msg}
          </p>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Signup;