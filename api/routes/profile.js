const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const requireAuth = require("../middleware/auth");

// PUT /api/profile/:domain  (Authorization: Bearer <token> chahiye)
// Overlay card ke naye fields yaha se update hote hai.
router.put("/:domain", requireAuth, async (req, res) => {
  try {
    const { avatarUrl, role, skills, available, resumeUrl } = req.body;

    const project = await Project.findOneAndUpdate(
      { domain: req.params.domain },
      {
        avatarUrl,
        role,
        skills: Array.isArray(skills)
          ? skills
          : String(skills || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        available: !!available,
        resumeUrl,
      },
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

// GET /api/profile/:domain (public - badge/overlay fetches this)
router.get("/:domain", async (req, res) => {
  try {
    const project = await Project.findOne({ domain: req.params.domain });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({
      avatarUrl: project.avatarUrl,
      role: project.role,
      skills: project.skills,
      available: project.available,
      resumeUrl: project.resumeUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
