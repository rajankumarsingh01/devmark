const express = require("express");
const router = express.Router();

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// GET /api/github/:username
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const cached = cache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  try {
    const headers = {
      "User-Agent": "DevMark-App",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };

    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: "GitHub user not found" });
    }
    const userData = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=1`,
      { headers }
    );
    const reposData = await reposRes.json();
    const latestRepo = reposData[0];

    const result = {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      latestRepo: latestRepo
        ? {
            name: latestRepo.name,
            updatedAt: latestRepo.updated_at,
            language: latestRepo.language,
          }
        : null,
    };

    cache.set(username, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

module.exports = router;