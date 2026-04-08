import React from "react";
import "./AnimatedBackground.css";

const AnimatedBackground = ({ children }) => {
  return <div className="animated-bg-wrapper">{children}</div>;
};

export default AnimatedBackground;