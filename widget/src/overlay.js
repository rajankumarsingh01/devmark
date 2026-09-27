// ---- Real brand/utility SVG icons (emoji ki jagah, har OS pe consistent dikhte hai) ----
const ICONS = {
  portfolio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.23-3.37-1.23-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05a9.28 9.28 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9z"/></svg>`,
  resume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6M9 9h1"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 13h20"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`,
  repo: `<svg class="devmark-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 8V4H8a2 2 0 0 0-2 2v16"/><path d="M4 8v13a2 2 0 0 0 2 2h13"/><rect x="6" y="8" width="14" height="13" rx="1"/></svg>`,
  followers: `<svg class="devmark-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

function createOverlay(config, triggerEl) {
  const overlay = document.createElement("div");
  overlay.id = "devmark-overlay";
  overlay.className = "hidden";

  const skillsHtml = (config.skills || []).length
    ? `<div class="devmark-skills">${config.skills
        .map((s) => `<span class="devmark-skill-chip">${s}</span>`)
        .join("")}</div>`
    : "";

  overlay.innerHTML = `
    <div id="devmark-modal" role="dialog" aria-modal="true" aria-label="${config.name} — DevMark profile">
      <button id="devmark-close" aria-label="Close">&times;</button>
      <div id="devmark-header">
        ${
          config.avatarUrl
            ? `<img id="devmark-avatar" src="${config.avatarUrl}" alt="${config.name}" />`
            : ""
        }
        <div>
          <h3>
            ${config.available ? `<span class="devmark-available-dot" title="Available for work"></span>` : ""}
            ${config.name}
            <span id="devmark-verified-slot"></span>
          </h3>
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
        ${config.hireMeUrl ? `<a class="devmark-cta-primary" href="${config.hireMeUrl}" target="_blank" rel="noopener">${ICONS.briefcase} Hire Me</a>` : ""}
        <a href="${config.portfolioUrl}" target="_blank" rel="noopener">${ICONS.portfolio} Portfolio</a>
        <a href="${config.githubUrl}" target="_blank" rel="noopener">${ICONS.github} GitHub</a>
        <a href="${config.linkedinUrl}" target="_blank" rel="noopener">${ICONS.linkedin} LinkedIn</a>
        ${config.resumeUrl ? `<a href="${config.resumeUrl}" target="_blank" rel="noopener">${ICONS.resume} Resume</a>` : ""}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const modal = overlay.querySelector("#devmark-modal");
  const closeBtn = overlay.querySelector("#devmark-close");

  function closeOverlay() {
    overlay.classList.remove("devmark-visible");
    setTimeout(() => overlay.classList.add("hidden"), 200);
    if (triggerEl) triggerEl.focus(); // focus wapas badge pe le jao (accessibility)
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target === closeBtn) {
      closeOverlay();
    }
  });

  // ---- Accessibility: Escape se close, Tab se modal ke andar hi focus trap ----
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeOverlay();
      return;
    }
    if (e.key === "Tab") {
      const focusable = modal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Overlay khulte hi close button pe focus le jao
  const observer = new MutationObserver(() => {
    if (overlay.classList.contains("devmark-visible")) {
      closeBtn.focus();
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ["class"] });

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
        ${ICONS.repo} <span class="devmark-stat-num" id="devmark-repo-count">0</span> public repos
        &nbsp;·&nbsp;
        ${ICONS.followers} <span class="devmark-stat-num" id="devmark-follower-count">0</span> followers
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
        ? `<span class="devmark-verified-inline" title="Verified Build">${ICONS.check}</span>`
        : "";
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