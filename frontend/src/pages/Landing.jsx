// src/pages/Landing.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const typingTexts = ["Track Time", "Manage Apps", "Set Limits"];
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Typing animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < typingTexts[textIndex].length) {
        setTypedText((prev) => prev + typingTexts[textIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setTypedText("");
          setCharIndex(0);
          setTextIndex((prev) => (prev + 1) % typingTexts.length);
        }, 1500);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [charIndex, textIndex]);

  const cards = [
    { title: "Chrome", color: "#4285F4" },
    { title: "VS Code", color: "#007ACC" },
    { title: "Instagram", color: "#C13584" },
    { title: "YouTube", color: "#FF0000" },
  ];

  return (
    <div className="landing-container" style={styles.container}>
      <h1 style={styles.heading}>Welcome to TimeTrap</h1>
      <h2 style={styles.typing}>{typedText}|</h2>

      <div style={styles.clock}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>

      <div style={styles.cardsWrapper}>
        {cards.map((card, idx) => (
          <Tilt key={idx} glareEnable={true} glareMaxOpacity={0.3} style={{ margin: "15px" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ ...styles.card, backgroundColor: card.color }}
            >
              {card.title}
            </motion.div>
          </Tilt>
        ))}
      </div>

      <button style={styles.button} onClick={() => navigate("/signup")}>
        Get Started
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#f5f7ff,#eef2ff)",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: { fontSize: "3rem", color: "#1d2671" },
  typing: { fontSize: "1.5rem", color: "#1d2671", margin: "15px 0", minHeight: "2rem" },
  clock: { fontSize: "2rem", color: "#1d2671", margin: "20px 0" },
  cardsWrapper: { display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "30px" },
  card: {
    color: "white",
    width: "140px",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "1.1rem",
    borderRadius: "20px",
    cursor: "pointer",
  },
  button: {
    marginTop: "40px",
    padding: "12px 30px",
    fontSize: "1rem",
    background: "#1d2671",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
  },
};