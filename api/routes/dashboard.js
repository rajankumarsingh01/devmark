const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ClickEvent = require("../models/ClickEvent");

// GET /api/dashboard?password=xxxx
router.get("/", async (req, res) => {
  try {
    if (req.query.password !== process.env.DASHBOARD_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projects = await Project.find().sort({ createdAt: -1 });

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const clickCount = await ClickEvent.countDocuments({
          projectId: project._id,
          eventType: "click",
        });
        return {
          domain: project.domain,
          name: project.name,
          tagline: project.tagline,
          verified: project.verified,
          installedAt: project.installedAt,
          clickCount,
        };
      })
    );

    res.json({ projects: projectsWithStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;