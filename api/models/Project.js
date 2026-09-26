const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: String, default: "rajan" }, // future: multiple developers ke liye unique ID
    domain: { type: String, required: true, unique: true },
    name: { type: String, default: "Untitled Project" },
    tagline: { type: String, default: "" },
    installedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedToken: { type: String, default: null },
    caseStudy: {
      problem: { type: String, default: "" },
      techUsed: { type: String, default: "" },
      timeline: { type: String, default: "" },
    },
  },
  { timestamps: true }
);