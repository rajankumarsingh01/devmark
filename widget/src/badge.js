const DEFAULT_CONFIG = {
  name: "Rajan Kumar Singh",
  tagline: "Built this project",
  role: "Full-Stack Developer",
  avatarUrl: "", // e.g. "https://rajankumarsingh.me/avatar.jpg"
  portfolioUrl: "https://rajankumarsingh.me",
  githubUrl: "https://github.com/rajankumarsingh01",
  linkedinUrl: "https://linkedin.com/in/rajankumarsingh01",
  githubUsername: "rajankumarsingh01",
  resumeUrl: "",
  hireMeUrl: "",
  available: false,
  skills: [], // e.g. ["React", "Node.js", "MongoDB"]
  position: "bottom-right", // bottom-right | bottom-left | top-right | top-left
  apiBaseUrl: "https://devmark-api-beta.vercel.app/api",
};

const STAR_ICON = `<svg class="devmark-icon-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/>
</svg>`;

function initDevMark(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  // Agar avatarUrl khud nahi diya, to GitHub username se seedha uska profile photo utha lo
  if (!config.avatarUrl && config.githubUsername) {
    config.avatarUrl = `https://github.com/${config.githubUsername}.png`;
  }

  const domain = window.location.host + window.location.pathname;

  fetch(`${config.apiBaseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain,
      name: config.name,
      tagline: config.tagline,
      avatarUrl: config.avatarUrl,
      role: config.role,
      skills: config.skills,
      available: config.available,
      resumeUrl: config.resumeUrl,
    }),
  }).catch((err) => console.warn("DevMark register failed:", err));

  const badge = document.createElement("div");
  badge.id = "devmark-badge";
  badge.setAttribute("data-position", config.position);
  badge.setAttribute("role", "button");
  badge.setAttribute("tabindex", "0");
  badge.setAttribute("aria-label", `Built by ${config.name}. Click for details.`);
  badge.innerHTML = `
    ${
      config.avatarUrl
        ? `<img id="devmark-badge-avatar" src="${config.avatarUrl}" alt="${config.name}" />`
        : STAR_ICON
    }
    <span>Built by ${config.name.split(" ")[0]}</span>
    ${config.available ? `<span id="devmark-badge-dot" title="Available for work"></span>` : ""}
  `;

  document.body.appendChild(badge);
  const overlay = createOverlay(config, badge);

  let statsLoaded = false;

  function openOverlay() {
    overlay.classList.remove("hidden");
    requestAnimationFrame(() => overlay.classList.add("devmark-visible"));

    if (!statsLoaded) {
      loadGithubStats(config);
      loadVerificationStatus(config, domain);
      loadCaseStudy(config, domain);
      statsLoaded = true;
    }

    fetch(`${config.apiBaseUrl}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, eventType: "click" }),
    }).catch((err) => console.warn("DevMark track failed:", err));
  }

  badge.addEventListener("click", openOverlay);
  badge.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openOverlay();
    }
  });

  // ---- Scroll pe collapse-to-avatar, idle hone pe wapas expand ----
  let collapseTimer = null;
  window.addEventListener(
    "scroll",
    () => {
      badge.classList.add("devmark-collapsed");
      clearTimeout(collapseTimer);
      collapseTimer = setTimeout(() => {
        badge.classList.remove("devmark-collapsed");
      }, 1200);
    },
    { passive: true }
  );
}

window.DevMark = { init: initDevMark };