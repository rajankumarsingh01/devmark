function createOverlay(config) {
  const overlay = document.createElement("div");
  overlay.id = "devmark-overlay";
  overlay.className = "hidden";

  overlay.innerHTML = `
    <div id="devmark-modal">
      <span id="devmark-close">&times;</span>
      <h3>${config.name}</h3>
      <p>${config.tagline}</p>
      <div id="devmark-github-stats">
        <p style="color:#999; font-size:12px;">Loading tech stats...</p>
      </div>
      <a href="${config.portfolioUrl}" target="_blank" rel="noopener">🌐 Portfolio</a>
      <a href="${config.githubUrl}" target="_blank" rel="noopener">💻 GitHub</a>
      <a href="${config.linkedinUrl}" target="_blank" rel="noopener">🔗 LinkedIn</a>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.id === "devmark-close") {
      overlay.classList.add("hidden");
    }
  });

  return overlay;
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
        <div style="background:#f5f5f5; border-radius:8px; padding:8px 10px; margin-bottom:12px; font-size:12px; color:#333;">
          📦 ${data.publicRepos} public repos &nbsp; · &nbsp; 👥 ${data.followers} followers
          ${repoLine ? `<br/>${repoLine}` : ""}
        </div>
      `;
    })
    .catch(() => {
      statsEl.innerHTML = "";
    });
}


function loadVerificationStatus(config, domain) {
  fetch(`${config.apiBaseUrl}/verify/${encodeURIComponent(domain)}`)
    .then((res) => res.json())
    .then((data) => {
      const modal = document.getElementById("devmark-modal");
      if (!modal) return;

      const badge = document.createElement("div");
      badge.style.cssText = "font-size:11px; margin-top:10px; font-weight:600;";
      badge.innerHTML = data.verified
        ? `<span style="color:#16a34a;">✓ Verified Build</span>`
        : `<span style="color:#999;">Unverified</span>`;
      modal.appendChild(badge);
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

      const modal = document.getElementById("devmark-modal");
      if (!modal) return;

      const box = document.createElement("div");
      box.style.cssText =
        "background:#f0f9ff; border-radius:8px; padding:10px 12px; margin:10px 0; font-size:12px; color:#333; line-height:1.6;";
      box.innerHTML = `
        ${problem ? `<div><strong>Problem:</strong> ${problem}</div>` : ""}
        ${techUsed ? `<div><strong>Tech:</strong> ${techUsed}</div>` : ""}
        ${timeline ? `<div><strong>Timeline:</strong> ${timeline}</div>` : ""}
      `;

      const linksStart = modal.querySelector("a");
      modal.insertBefore(box, linksStart);
    })
    .catch(() => {});
}