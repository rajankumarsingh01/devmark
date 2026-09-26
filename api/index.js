require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const registerRoute = require("./routes/register");
const trackRoute = require("./routes/track");
const statsRoute = require("./routes/stats");
const githubRoute = require("./routes/github");
const verifyRoute = require("./routes/verify");
const dashboardRoute = require("./routes/dashboard");
const caseStudyRoute = require("./routes/caseStudy");

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

app.get("/", (req, res) => res.send("DevMark API is running ✅"));

app.use("/api/register", registerRoute);
app.use("/api/track", trackRoute);
app.use("/api/stats", statsRoute);
app.use("/api/github", githubRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/case-study", caseStudyRoute);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;