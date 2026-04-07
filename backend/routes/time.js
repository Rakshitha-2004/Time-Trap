const express = require("express");
const router = express.Router();

// your routes here
router.get("/", (req, res) => {
  res.json({ message: "Time route working" });
});

module.exports = router;