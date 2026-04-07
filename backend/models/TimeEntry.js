const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  }
}, { timestamps: true });

module.exports = mongoose.model("TimeEntry", timeEntrySchema);
