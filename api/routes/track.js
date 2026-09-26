const express = require("express");
const router = express.Router();
const ClickEvent = require("../models/ClickEvent");
const Project = require("../models/Project");

// POST /api/track
router.post("/", async (req, res) => {
  try {
    const { domain, eventType } = req.body;

    const project = await Project.findOne({ domain });
    if (!project) {
      return res.status(404).json({ error: "Project not registered" });
    }

    await ClickEvent.create({ projectId: project._id, eventType: eventType || "click" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;