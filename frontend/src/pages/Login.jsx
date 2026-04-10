import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("Logging in...");

    try {
      const res = await fetch("https://time-trap.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        const userData = data.user || data;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("userId", userData._id || "");

        setMsg("Login successful");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 400);
      } else {
        setMsg(data.message || "Login failed");
      }
    } catch (error) {
      console.log("LOGIN FRONTEND ERROR:", error);
      setMsg("Server error. Try again.");
    }
  };

  return (
    <AnimatedBackground>
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue using Time Trap</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowPassword((prev) => !prev);
                  }
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className="msg">{msg}</p>

          <p className="bottom-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <p className="bottom-text">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Login;