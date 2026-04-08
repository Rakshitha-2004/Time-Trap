import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Suggestions from "./pages/Suggestions";
import Settings from "./pages/Settings";

import "./App.css";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }

    return () => {
      document.body.classList.remove("light-mode");
    };
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Always show index/home first */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <Monitor theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suggestions"
          element={
            <ProtectedRoute>
              <Suggestions theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;