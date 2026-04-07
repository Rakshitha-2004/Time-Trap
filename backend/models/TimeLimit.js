const mongoose = require("mongoose");

const TimeLimitSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  appName: {
    type: String,
    required: true
  },

  maxTime: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model("TimeLimit", TimeLimitSchema);