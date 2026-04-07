const express = require("express");
const router = express.Router();
const User = require("../model/User");

// test insert
router.get("/add-user", async (req, res) => {
  const user = new User({
    username: "testuser",
    email: "test@timetrap.com",
    password: "123456",
  });

  await user.save();
  res.send("User added to Time Trap DB ✅");
});

module.exports = router;
