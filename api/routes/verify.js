const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { verifyToken } = require("../crypto/signToken");

// GET /api/verify/:domain
router.get("/:domain", async (req, res) => {
  try {
    const project = await Project.findOne({ domain: req.params.domain });

    if (!project || !project.verifiedToken) {
      return res.json({ verified: false });
    }

    const isValid = verifyToken(project.domain, project.verifiedToken);
    res.json({ verified: isValid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;