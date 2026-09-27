const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ClickEvent = require("../models/ClickEvent");
const requireAuth = require("../middleware/auth");

// GET /api/dashboard  (Authorization: Bearer <token> chahiye)
router.get("/", requireAuth, async (req, res) => {
  try {
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
          avatarUrl: project.avatarUrl,
          role: project.role,
          skills: project.skills,
          available: project.available,
          resumeUrl: project.resumeUrl,
          caseStudy: project.caseStudy,
        };
      })
    );

    const totalClicks = projectsWithStats.reduce((sum, p) => sum + p.clickCount, 0);
    const verifiedCount = projectsWithStats.filter((p) => p.verified).length;

    res.json({
      projects: projectsWithStats,
      overview: {
        totalProjects: projectsWithStats.length,
        totalClicks,
        verifiedCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/dashboard/timeseries/:domain?days=7
// Ek project ke last N din ke daily clicks — dashboard card ke mini-chart ke liye.
router.get("/timeseries/:domain", requireAuth, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 30);
    const project = await Project.findOne({ domain: req.params.domain });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const events = await ClickEvent.find({
      projectId: project._id,
      eventType: "click",
      createdAt: { $gte: since },
    });

    // Har din ka bucket bana ke count karo
    const buckets = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }
    events.forEach((e) => {
      const key = e.createdAt.toISOString().slice(0, 10);
      if (key in buckets) buckets[key]++;
    });

    res.json({
      labels: Object.keys(buckets),
      values: Object.values(buckets),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
