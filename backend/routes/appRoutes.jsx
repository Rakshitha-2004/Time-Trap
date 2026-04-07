const express = require("express");
const router = express.Router();
const App = require("../models/App");

// Get all apps
router.get("/", async (req, res) => {
  try {
    const apps = await App.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch apps", error });
  }
});

// Add app
router.post("/add", async (req, res) => {
  try {
    const { name, status, dailyLimit } = req.body;

    const newApp = new App({
      name,
      status: status || "inactive",
      dailyLimit: dailyLimit || 60,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: "Failed to add app", error });
  }
});

module.exports = router;