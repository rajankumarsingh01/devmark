const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { generateToken } = require("../crypto/signToken");

router.post("/", async (req, res) => {
  try {
    const {
      domain,
      name,
      tagline,
      avatarUrl,
      role,
      skills,
      available,
      resumeUrl,
    } = req.body;

    if (!domain) {
      return res.status(400).json({ error: "domain is required" });
    }

    let project = await Project.findOne({ domain });

    if (!project) {
      const token = generateToken(domain);
      project = await Project.create({
        domain,
        name,
        tagline,
        avatarUrl,
        role,
        skills,
        available,
        resumeUrl,
        verified: true,
        verifiedToken: token,
      });
      console.log("🆕 New project registered:", domain);
    }

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
