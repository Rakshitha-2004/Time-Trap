const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ADD THIS
const authRoutes = require("./routes/auth");

// already existing
const usageRoutes = require("./routes/usage");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ✅ ADD THIS
app.use("/api/auth", authRoutes);

// already existing
app.use("/api/usage", usageRoutes);

app.get("/", (req, res) => {
  res.send("TimeTrap backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});