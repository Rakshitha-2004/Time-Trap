const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Usage = require("../models/usage");

// Add usage
router.post("/add", async (req, res) => {
  try {
    const { userId, appName, timeSpent } = req.body;

    if (!userId || !appName || timeSpent === undefined) {
      return res.status(400).json({ message: "userId, appName and timeSpent are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = new Usage({
      userId,
      appName,
      timeSpent,
      date: new Date()
    });

    await usage.save();

    res.status(201).json({
      message: "Usage added successfully",
      usage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all dashboard usage data for a user
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = await Usage.find({ userId }).sort({ date: -1 });

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard summary cards
router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = await Usage.find({ userId });

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    let todayMinutes = 0;
    let weeklyMinutes = 0;

    const appSet = new Set();

    usage.forEach((item) => {
      appSet.add(item.appName);

      const itemDate = new Date(item.date);

      if (itemDate >= todayStart) {
        todayMinutes += item.timeSpent;
      }

      if (itemDate >= weekStart) {
        weeklyMinutes += item.timeSpent;
      }
    });

    res.json({
      totalApps: appSet.size,
      todayMinutes,
      weeklyMinutes,
      totalEntries: usage.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Daily usage graph data
router.get("/daily/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = await Usage.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalTime: { $sum: "$timeSpent" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// App-wise usage graph data
router.get("/apps/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = await Usage.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$appName",
          totalTime: { $sum: "$timeSpent" }
        }
      },
      {
        $sort: { totalTime: -1 }
      }
    ]);

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Productivity data
router.get("/productivity/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const usage = await Usage.find({ userId });

    let productive = 0;
    let unproductive = 0;

    const productiveApps = ["VS Code", "Google Docs", "Notion", "Coursera"];

    usage.forEach((app) => {
      if (productiveApps.includes(app.appName)) {
        productive += app.timeSpent;
      } else {
        unproductive += app.timeSpent;
      }
    });

    const total = productive + unproductive;
    const score = total === 0 ? 0 : Math.round((productive / total) * 100);

    res.json({
      productiveTime: productive,
      unproductiveTime: unproductive,
      productivityScore: score
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;