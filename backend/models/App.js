const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    dailyLimit: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("App", appSchema);
