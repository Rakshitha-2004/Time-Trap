const express = require("express");
const router = express.Router();
const Usage = require("../models/usage");

// Add usage
router.post("/add", async (req, res) => {
  try {
    const { appName, timeSpent, date } = req.body;

    if (!appName || timeSpent === undefined) {
      return res.status(400).json({ message: "appName and timeSpent are required" });
    }

    const usage = new Usage({
      appName,
      timeSpent,
      date: date || new Date(),
    });

    await usage.save();
    res.status(201).json(usage);
  } catch (error) {
    res.status(500).json({ message: "Failed to save usage", error });
  }
});

// Get all usage
router.get("/", async (req, res) => {
  try {
    const usage = await Usage.find().sort({ date: -1 });
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch usage", error });
  }
});

module.exports = router;