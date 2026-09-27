# DevMark — Upgrade Notes

Ye upgrade wahi project hai, bas UI + security + kuch features upar ki level pe.
Neeche **exact PowerShell commands** hai jo local setup ke liye chahiye honge (jab tum
setup karoge).

## Kya-kya badla

**Security fix (sabse zaroori):**
- Dashboard password ab URL me (`?password=...`) nahi jaata. Ab `/api/auth/login` pe
  POST karke ek short-lived JWT milta hai (12h), jo Authorization header me jaata hai.
  Isliye `jsonwebtoken` package add kiya hai.
- `express` aur `mongoose` ke version numbers original zip me galat the (v5.2.1 / v9.10.2
  jaise versions abhi exist hi nahi karte) — realistic stable versions pe fix kar diya
  (`express@4.19.2`, `mongoose@8.5.0`).

**Naye Project fields:** `avatarUrl`, `role`, `skills[]`, `available`, `resumeUrl`
**Naye API routes:** `POST /api/auth/login`, `PUT/GET /api/profile/:domain`,
`GET /api/dashboard/timeseries/:domain` (7-din ka daily click data, chart ke liye)

**Widget (badge + overlay):**
- Avatar, "available for work" pulsing dot, skills chips, animated entrance,
  glass/blur badge, smooth open/close overlay animation, GitHub stats ab count-up
  animation ke sath, skeleton loaders (plain "Loading..." text ki jagah), Hire Me /
  Resume CTA buttons (agar config me diye ho).

**Dashboard:**
- Proper login screen + JWT (sessionStorage me store, tab band karne pe expire)
- Overview stat cards (total projects / total clicks / verified count)
- Table ki jagah project **cards grid**, har card me 7-din ka mini line chart (Chart.js)
- Edit ab ek modal me — profile fields + case study ek jagah
- `alert()` hata ke toast notifications

## Deferred (agla phase — infra decisions chahiye isliye abhi nahi kiya)
- Public profile page (`devmark.rajankumarsingh.me/rajan`) — custom domain/hosting decide karna hoga
- Widget ko npm package banake publish karna (`npm i devmark-widget`) — npm account chahiye
- Referrer / geo (country-wise) click tracking — ek geo-IP service integrate karna hoga

---

## Setup (PowerShell)

### 1) API

```powershell
cd api
npm install
copy .env.example .env
```

`.env` file khol ke apne values daalo (MONGODB_URI, GITHUB_TOKEN, JWT_SIGNING_SECRET,
DASHBOARD_PASSWORD).

```powershell
npm run dev
```

### 2) Widget test page

Bas `widget/src/test.html` ko browser me kholo (double-click), koi build step nahi
chahiye. Local API test karna ho to `apiBaseUrl` ko `test.html` me temporarily
`http://localhost:5000/api` kar dena.

### 3) Dashboard

`dashboard/index.html` ko bhi seedha browser me khol sakte ho. Deployed API use kar
raha hai by default (`devmark-api-beta.vercel.app`) — agar local API test karni ho to
`index.html` ke top pe `API_BASE` variable change kar do.

### 4) Deploy (jab ready ho)

```powershell
cd api
vercel --prod
```

Vercel dashboard me environment variables (MONGODB_URI, GITHUB_TOKEN,
JWT_SIGNING_SECRET, DASHBOARD_PASSWORD) add karna mat bhoolna.
