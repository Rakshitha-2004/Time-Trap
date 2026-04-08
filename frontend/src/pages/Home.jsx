import React from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import "./Home.css";

const Home = () => {
  return (
    <AnimatedBackground>

      {/* TOP ANCHOR (for Home scroll) */}
      <div id="top"></div>

      <div className="home-page">

        {/* NAVBAR */}
        <header className="home-navbar">
          <div className="home-logo">⏳ Time Trap</div>

          <nav className="home-nav">
            <a href="#top">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/login">Login</Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-left">
            <h1>
              <span>Take</span> Control of Your <br />
              Time!
            </h1>

            <p>
              Time Trap helps you identify distractions, analyze your habits,
              and improve productivity with smart tracking and analytics.
            </p>

            <Link to="/login" className="get-started-btn">
              Get Started
            </Link>
          </div>

          <div className="hero-right">
            <div className="neon-clock">
              <div className="clock-center"></div>
              <div className="hand hour"></div>
              <div className="hand minute"></div>
              <div className="hand second"></div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="features-section">
          <div className="feature-card">
            <h3>📊 Smart Tracking</h3>
            <p>Monitor how much time you spend on each activity.</p>
          </div>

          <div className="feature-card">
            <h3>🚫 Distraction Control</h3>
            <p>Identify and reduce time-wasting habits.</p>
          </div>

          <div className="feature-card">
            <h3>📈 Productivity Reports</h3>
            <p>Visual reports to improve daily performance.</p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure & Simple</h3>
            <p>Login-based system with user-friendly experience.</p>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about-section">
          <h2>About Time Trap</h2>
          <p>
            Time Trap helps users track their daily habits, reduce distractions,
            and improve productivity using smart analytics.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="home-footer">
          © 2026 Time Trap Project | Designed for Smart Productivity
        </footer>

      </div>
    </AnimatedBackground>
  );
};

export default Home;