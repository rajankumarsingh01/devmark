require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./db");

const registerRoute = require("./routes/register");
const trackRoute = require("./routes/track");
const statsRoute = require("./routes/stats");
const githubRoute = require("./routes/github");
const verifyRoute = require("./routes/verify");
const dashboardRoute = require("./routes/dashboard");
const caseStudyRoute = require("./routes/caseStudy");
const profileRoute = require("./routes/profile");
const authRoute = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Har request se pehle DB connection ensure karo (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ---- Rate limiting (free-tier DB ko spam se bachane ke liye) ----
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // register kam hi baar hona chahiye (naya project add hone pe)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many registration attempts, please try again later." },
});

const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30, // per IP, ek badge click flow ke liye kaafi hai
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." },
});

app.use("/api", generalLimiter);

app.get("/", (req, res) => res.send("DevMark API is running ✅"));

app.use("/api/auth", authRoute);
app.use("/api/register", registerLimiter, registerRoute);
app.use("/api/track", trackLimiter, trackRoute);
app.use("/api/stats", statsRoute);
app.use("/api/github", githubRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/case-study", caseStudyRoute);
app.use("/api/profile", profileRoute);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;