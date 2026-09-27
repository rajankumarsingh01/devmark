const jwt = require("jsonwebtoken");

// Dashboard ke saare protected routes ye middleware use karenge.
// Header me aana chahiye: Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SIGNING_SECRET);
    req.dashboardUser = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
