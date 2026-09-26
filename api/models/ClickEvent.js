const mongoose = require("mongoose");

const clickEventSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    eventType: { type: String, enum: ["view", "click"], default: "click" },
    createdAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("ClickEvent", clickEventSchema);