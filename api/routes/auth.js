const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/auth/login  { password }
// Password ab query string me nahi jaata — body me POST hota hai, aur reply me
// ek short-lived JWT milta hai jo dashboard localStorage me rakhega.
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const token = jwt.sign(
    { role: "owner" },
    process.env.JWT_SIGNING_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ success: true, token, expiresIn: "12h" });
});

module.exports = router;
