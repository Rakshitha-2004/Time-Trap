const mongoose = require("mongoose");

const UsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  appName: {
    type: String,
    required: true
  },
  timeSpent: {
    type: Number, // minutes
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Usage", UsageSchema);