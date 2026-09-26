const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ClickEvent = require("../models/ClickEvent");

// GET /api/stats/:domain
router.get("/:domain", async (req, res) => {
  try {
    const project = await Project.findOne({ domain: req.params.domain });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const clickCount = await ClickEvent.countDocuments({ projectId: project._id, eventType: "click" });
    const viewCount = await ClickEvent.countDocuments({ projectId: project._id, eventType: "view" });

    res.json({ project, clickCount, viewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;