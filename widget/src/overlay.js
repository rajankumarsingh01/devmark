function createOverlay(config) {
  const overlay = document.createElement("div");
  overlay.id = "devmark-overlay";
  overlay.className = "hidden";

  const skillsHtml = (config.skills || []).length
    ? `<div class="devmark-skills">${config.skills
        .map((s) => `<span class="devmark-skill-chip">${s}</span>`)
        .join("")}</div>`
    : "";

  overlay.innerHTML = `
    <div id="devmark-modal">
      <span id="devmark-close">&times;</span>
      <div id="devmark-header">
        ${
          config.avatarUrl
            ? `<img id="devmark-avatar" src="${config.avatarUrl}" alt="${config.name}" />`
            : ""
        }
        <div>
          <h3>${config.available ? `<span class="devmark-available-dot" title="Available for work"></span>` : ""}${config.name}</h3>
          ${config.role ? `<p id="devmark-role">${config.role}</p>` : ""}
        </div>
      </div>
      <p class="devmark-tagline">${config.tagline}</p>
      ${skillsHtml}
      <div id="devmark-github-stats">
        <div class="devmark-skeleton-line"></div>
        <div class="devmark-skeleton-line"></div>
      </div>
      <div id="devmark-case-study-slot"></div>
      <div class="devmark-links">
        ${config.hireMeUrl ? `<a class="devmark-cta-primary" href="${config.hireMeUrl}" target="_blank" rel="noopener">💼 Hire Me</a>` : ""}
        <a href="${config.portfolioUrl}" target="_blank" rel="noopener">🌐 Portfolio</a>
        <a href="${config.githubUrl}" target="_blank" rel="noopener">💻 GitHub</a>
        <a href="${config.linkedinUrl}" target="_blank" rel="noopener">🔗 LinkedIn</a>
        ${config.resumeUrl ? `<a href="${config.resumeUrl}" target="_blank" rel="noopener">📄 Resume</a>` : ""}
      </div>
      <div id="devmark-verified-slot" style="margin-top:10px;"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  function closeOverlay() {
    overlay.classList.remove("devmark-visible");
    // CSS transition (0.22s) khatam hone do, phir display:none lagao
    setTimeout(() => overlay.classList.add("hidden"), 200);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.id === "devmark-close") {
      closeOverlay();
    }
  });

  return overlay;
}

// 0 se target number tak smoothly count-up animation
function animateCount(el, target, duration = 700) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (target - start) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function loadGithubStats(config) {
  const statsEl = document.getElementById("devmark-github-stats");
  if (!statsEl) return;

  fetch(`${config.apiBaseUrl}/github/${config.githubUsername}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        statsEl.innerHTML = "";
        return;
      }

      const repoLine = data.latestRepo
        ? `Last updated: <strong>${data.latestRepo.name}</strong> (${data.latestRepo.language || "N/A"})`
        : "";

      statsEl.innerHTML = `
        📦 <span class="devmark-stat-num" id="devmark-repo-count">0</span> public repos
        &nbsp;·&nbsp;
        👥 <span class="devmark-stat-num" id="devmark-follower-count">0</span> followers
        ${repoLine ? `<br/>${repoLine}` : ""}
      `;

      const repoEl = document.getElementById("devmark-repo-count");
      const followerEl = document.getElementById("devmark-follower-count");
      if (repoEl) animateCount(repoEl, data.publicRepos || 0);
      if (followerEl) animateCount(followerEl, data.followers || 0);
    })
    .catch(() => {
      statsEl.innerHTML = "";
    });
}

function loadVerificationStatus(config, domain) {
  fetch(`${config.apiBaseUrl}/verify/${encodeURIComponent(domain)}`)
    .then((res) => res.json())
    .then((data) => {
      const slot = document.getElementById("devmark-verified-slot");
      if (!slot) return;

      slot.innerHTML = data.verified
        ? `<span class="devmark-verified-chip is-verified">✓ Verified Build</span>`
        : `<span class="devmark-verified-chip is-unverified">Unverified</span>`;
    })
    .catch(() => {});
}

function loadCaseStudy(config, domain) {
  fetch(`${config.apiBaseUrl}/case-study/${encodeURIComponent(domain)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error || !data.caseStudy) return;
      const { problem, techUsed, timeline } = data.caseStudy;
      if (!problem && !techUsed && !timeline) return;

      const slot = document.getElementById("devmark-case-study-slot");
      if (!slot) return;

      slot.innerHTML = `
        <div class="devmark-case-study">
          ${problem ? `<div><strong>Problem:</strong> ${problem}</div>` : ""}
          ${techUsed ? `<div><strong>Tech:</strong> ${techUsed}</div>` : ""}
          ${timeline ? `<div><strong>Timeline:</strong> ${timeline}</div>` : ""}
        </div>
      `;
    })
    .catch(() => {});
}
