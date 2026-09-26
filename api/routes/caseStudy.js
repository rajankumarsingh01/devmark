const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// PUT /api/case-study/:domain?password=xxxx
router.put("/:domain", async (req, res) => {
  try {
    if (req.query.password !== process.env.DASHBOARD_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { problem, techUsed, timeline } = req.body;

    const project = await Project.findOneAndUpdate(
      { domain: req.params.domain },
      { caseStudy: { problem, techUsed, timeline } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/case-study/:domain (public - badge fetches this)
router.get("/:domain", async (req, res) => {
  try {
    const project = await Project.findOne({ domain: req.params.domain });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ caseStudy: project.caseStudy, portfolioLink: "https://rajankumarsingh.me" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;