# DevMark

**DevMark** is a lightweight "Built by" badge widget you can drop into any of your
deployed projects. It shows a small floating badge in the corner — visitors can click
it to see a live profile card with your name, role, skills, GitHub stats, verification
status, and links to your portfolio, GitHub, LinkedIn, and resume.

Think of it as a signature stamp for every project you ship.

## Features

- 🪪 **Badge widget** — small, animated, non-intrusive floating badge (bottom-right by
  default), collapses to just your avatar on scroll
- 🪟 **Profile overlay** — avatar, role, availability status, skills chips, live GitHub
  stats (repos/followers with count-up animation), verified-build checkmark, case study,
  and CTA links (Portfolio / GitHub / LinkedIn / Resume / Hire Me)
- ♿ **Accessible** — keyboard-operable badge, Escape to close, focus trap inside the
  overlay
- 📊 **Dashboard** — password-protected (JWT-based) dashboard to see every project the
  badge is installed on, total clicks, verified count, and a 7-day click chart per
  project
- 🔒 **Rate-limited API** — protects the free-tier database from abuse
- 🆓 **Free-tier friendly** — built to run entirely on Vercel + MongoDB Atlas free tiers

## Tech stack

| Part      | Stack                                              |
|-----------|-----------------------------------------------------|
| Widget    | Vanilla JS + CSS (no build step, no framework)       |
| API       | Node.js, Express, Mongoose, JWT (`jsonwebtoken`)     |
| Database  | MongoDB (Atlas)                                      |
| Dashboard | Plain HTML/CSS/JS + Chart.js (via CDN)               |
| Hosting   | Vercel (API + serverless functions)                  |

## Folder structure
devmark/
├── api/ # Express API (deployed on Vercel)
│ ├── crypto/
│ │ └── signToken.js # per-domain verification token (HMAC)
│ ├── middleware/
│ │ └── auth.js # JWT auth guard for dashboard routes
│ ├── models/
│ │ ├── Project.js
│ │ └── ClickEvent.js
│ ├── routes/
│ │ ├── auth.js # POST /api/auth/login
│ │ ├── register.js # POST /api/register
│ │ ├── track.js # POST /api/track
│ │ ├── stats.js # GET /api/stats/:domain
│ │ ├── github.js # GET /api/github/:username
│ │ ├── verify.js # GET /api/verify/:domain
│ │ ├── caseStudy.js # GET/PUT /api/case-study/:domain
│ │ ├── profile.js # GET/PUT /api/profile/:domain
│ │ └── dashboard.js # GET /api/dashboard, /api/dashboard/timeseries/:domain
│ ├── db.js
│ ├── index.js
│ └── .env.example
├── widget/
│ └── src/
│ ├── badge.js # DevMark.init({...}) — embed this in any project
│ ├── overlay.js
│ ├── badge.css
│ └── test.html # local demo page for the widget
└── dashboard/
└── index.html # standalone dashboard (open directly in browser)

## API reference

| Method | Route                              | Auth | Description |
|--------|-------------------------------------|------|-------------|
| POST   | `/api/auth/login`                   | —    | Exchange dashboard password for a 12h JWT |
| POST   | `/api/register`                     | —    | Register/upsert a project by domain |
| POST   | `/api/track`                        | —    | Log a click/view event |
| GET    | `/api/stats/:domain`                | —    | Click/view counts for a project |
| GET    | `/api/github/:username`             | —    | Cached GitHub public stats (10 min TTL) |
| GET    | `/api/verify/:domain`               | —    | Whether a project's install is verified |
| GET/PUT| `/api/case-study/:domain`           | PUT only | Problem/tech/timeline for the overlay |
| GET/PUT| `/api/profile/:domain`              | PUT only | Avatar, role, skills, availability, resume link |
| GET    | `/api/dashboard`                    | ✅ Bearer JWT | All projects + overview stats |
| GET    | `/api/dashboard/timeseries/:domain` | ✅ Bearer JWT | Daily click counts (last N days) |

## Setup

### 1. API

```powershell
cd api
npm install
copy .env.example .env
```

Fill in `.env`:
MONGODB_URI=your_mongodb_connection_string
PORT=5000
GITHUB_TOKEN=your_github_personal_access_token
JWT_SIGNING_SECRET=your_random_secret_string
DASHBOARD_PASSWORD=your_dashboard_password

```powershell
npm run dev
```

### 2. Embed the widget in a project

Add before `</body>` on the site you want tagged:

```html
<link rel="stylesheet" href="https://your-widget-host/badge.css">
<script src="https://your-widget-host/overlay.js"></script>
<script src="https://your-widget-host/badge.js"></script>
<script>
  DevMark.init({
    tagline: "Built this project",
    role: "Full-Stack Developer",
    githubUsername: "your-github-username",
    available: true,
    skills: ["React", "Node.js", "MongoDB", "Express"],
    position: "bottom-right", // bottom-right | bottom-left | top-right | top-left
    // resumeUrl / hireMeUrl: add once you have real links
  });
</script>
```

Locally, just open `widget/src/test.html` directly in a browser — no build step needed.

### 3. Dashboard

Open `dashboard/index.html` directly in a browser. Log in with your
`DASHBOARD_PASSWORD`. It talks to the deployed API by default — change the
`API_BASE` constant at the top of the `<script>` to point at a local API if needed.

### 4. Deploy

```powershell
cd api
vercel --prod
```

Add the same environment variables in the Vercel project's Settings →
Environment Variables, then redeploy.

## Roadmap / not yet built

- Public profile page (e.g. `devmark.<domain>/rajan`) listing every project
- Widget distributed as an npm package (`npm i devmark-widget`)
- Referrer / geo (country-level) click analytics

## License

Personal project — not currently licensed for reuse.