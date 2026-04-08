import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>⏱ TimeTrap</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/monitor">Monitor</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/set-time-limits">Set Limits</Link>
    </div>
  );
}