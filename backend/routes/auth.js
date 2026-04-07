const express = require("express");
const router = express.Router();
const User = require("../models/user");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP REQUEST RECEIVED");

    const { name, email, password } = req.body;

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    });

    await user.save();

    console.log("SIGNUP SUCCESS");

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN REQUEST RECEIVED");
    console.log("REQ BODY:", req.body);

    const { email, password } = req.body;

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    console.log("CLEAN EMAIL:", cleanEmail);

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: cleanEmail });

    console.log("USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("DB PASSWORD:", user.password);
    console.log("ENTERED PASSWORD:", cleanPassword);

    if ((user.password || "").trim() !== cleanPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("LOGIN SUCCESS");

    res.json({
      message: "Login successful",
      token: "dummy-token",
      user,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    res.json({ message: "Feature not implemented yet" });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;