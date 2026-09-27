const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: String, default: "rajan" }, // future: multiple developers ke liye unique ID
    domain: { type: String, required: true, unique: true },
    name: { type: String, default: "Untitled Project" },
    tagline: { type: String, default: "" },
    installedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedToken: { type: String, default: null },

    // --- Naye profile fields (overlay/dashboard ke liye) ---
    avatarUrl: { type: String, default: "" },
    role: { type: String, default: "" }, // e.g. "Full-Stack Developer"
    skills: { type: [String], default: [] }, // e.g. ["React", "Node.js", "MongoDB"]
    available: { type: Boolean, default: false }, // "Available for freelance/full-time"
    resumeUrl: { type: String, default: "" },

    caseStudy: {
      problem: { type: String, default: "" },
      techUsed: { type: String, default: "" },
      timeline: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
