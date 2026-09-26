const DEFAULT_CONFIG = {
  name: "Rajan Kumar Singh",
  tagline: "Built this project",
  portfolioUrl: "https://rajankumarsingh.me",
  githubUrl: "https://github.com/rajankumarsingh01",
  linkedinUrl: "https://linkedin.com/in/rajankumarsingh01",
  githubUsername: "rajankumarsingh01",
 apiBaseUrl: "https://devmark-api-beta.vercel.app/api",
};

function initDevMark(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const domain = window.location.host + window.location.pathname;

  fetch(`${config.apiBaseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain,
      name: config.name,
      tagline: config.tagline,
    }),
  }).catch((err) => console.warn("DevMark register failed:", err));

  const badge = document.createElement("div");
  badge.id = "devmark-badge";
  badge.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/>
    </svg>
    <span>Built by ${config.name.split(" ")[0]}</span>
  `;

  document.body.appendChild(badge);
  const overlay = createOverlay(config);

  let statsLoaded = false;

badge.addEventListener("click", () => {
  overlay.classList.remove("hidden");

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
});
}

window.DevMark = { init: initDevMark };