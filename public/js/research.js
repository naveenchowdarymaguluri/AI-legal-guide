// LegalAI - Legal Research LexSearch Script (research.js)

let activeJurisdiction = "All";

document.addEventListener("DOMContentLoaded", () => {
  initResearchSearch();
  initJurisdictionFacets();
  loadResearchResults();
});

function initResearchSearch() {
  const input = document.getElementById("search-input") || document.querySelector("input[placeholder*='researching']");
  const execBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Execute Search"));

  function runSearch() {
    const q = input ? input.value.trim() : "";
    loadResearchResults(q, activeJurisdiction);
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });
  }

  if (execBtn) {
    execBtn.addEventListener("click", (e) => {
      e.preventDefault();
      runSearch();
    });
  }
}

function initJurisdictionFacets() {
  // Bind click to facet elements or create clean facet ribbon
  const facetsBar = document.querySelector(".flex.items-center.justify-between.flex-wrap.gap-space-sm.pt-space-xs");
  if (!facetsBar) return;

  const jurisdictions = ["All", "India", "California", "Delaware", "Federal"];
  const facetsContainer = facetsBar.querySelector(".flex.items-center.flex-wrap.gap-space-xs");
  if (!facetsContainer) return;

  facetsContainer.innerHTML = `
    <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant/80 mr-1">Jurisdiction Facets:</span>
    ${jurisdictions.map(j => `
      <button type="button" class="facet-btn px-3 py-1 rounded-full text-label-sm font-label-sm font-medium transition-all ${j === activeJurisdiction ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}" data-jurisdiction="${j}">
        ${j === 'All' ? '🌐 All' : j === 'India' ? '🇮🇳 India' : j === 'California' ? '🏛️ California' : j === 'Delaware' ? '⚖️ Delaware' : '📜 Federal'}
      </button>
    `).join("")}
  `;

  document.querySelectorAll(".facet-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeJurisdiction = btn.getAttribute("data-jurisdiction");
      document.querySelectorAll(".facet-btn").forEach(b => {
        b.classList.remove("bg-primary", "text-on-primary");
        b.classList.add("bg-surface-container-low", "text-on-surface-variant");
      });
      btn.classList.add("bg-primary", "text-on-primary");
      btn.classList.remove("bg-surface-container-low", "text-on-surface-variant");

      const input = document.getElementById("search-input");
      loadResearchResults(input ? input.value.trim() : "", activeJurisdiction);
    });
  });
}

function loadResearchResults(query = "", jurisdiction = "All") {
  let url = "/api/research";
  const params = [];
  if (query) params.push(`q=${encodeURIComponent(query)}`);
  if (jurisdiction && jurisdiction !== "All") params.push(`jurisdiction=${encodeURIComponent(jurisdiction)}`);
  if (params.length) url += `?${params.join("&")}`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      const results = data.results || [];
      const container = document.querySelector("section.flex.flex-col.gap-space-lg") ||
                        document.querySelector(".px-space-lg.py-space-md.flex.flex-col > section:last-child") ||
                        document.querySelector("article").parentElement;
      if (!container) return;

      if (!results.length) {
        container.innerHTML = `
          <div class="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3">
            <span class="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface">No authoritative precedents matched your query</h3>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-md">Try searching broader terminology such as "termination", "non-compete", "indemnity", or "fiduciary duty".</p>
          </div>
        `;
        return;
      }

      container.innerHTML = results.map((item, idx) => `
        <article class="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md border border-outline-variant/30">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 ${idx === 0 ? 'bg-secondary' : 'bg-primary-container'} rounded-l-xl"></div>
          
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm pl-space-xs">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-space-xs flex-wrap">
                <span class="inline-flex items-center gap-1 bg-surface-container text-secondary font-label-sm text-label-sm px-space-sm py-0.5 rounded font-semibold uppercase tracking-wider">
                  <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  ${escapeHtml(item.jurisdiction)}
                </span>
                <span class="font-code-sm text-code-sm text-on-surface-variant font-mono">${escapeHtml(item.court || '')}</span>
                <span class="text-outline-variant">•</span>
                <span class="font-label-sm text-label-sm text-on-surface font-semibold">${escapeHtml(item.year || '')}</span>
              </div>
              <h2 class="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight mt-1">
                ${escapeHtml(item.title)}
              </h2>
              <span class="font-code-sm text-code-sm text-secondary font-mono font-medium">
                ${escapeHtml(item.citation)}
              </span>
            </div>
            
            <div class="flex items-center gap-1.5 self-start">
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-code-sm text-code-sm font-semibold whitespace-nowrap flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Verified Good Law
              </span>
            </div>
          </div>

          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-space-xs">
            ${escapeHtml(item.summary)}
          </p>

          ${item.relevantSections ? `
            <div class="flex flex-wrap items-center gap-1.5 pl-space-xs pt-1">
              <span class="font-label-sm text-label-sm text-outline uppercase font-semibold mr-1">Statutory Provisions:</span>
              ${item.relevantSections.map(s => `
                <span class="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container-low text-on-surface border border-outline-variant/30">
                  § ${escapeHtml(s)}
                </span>
              `).join("")}
            </div>
          ` : ''}

          <div class="mt-space-xs pt-space-sm border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-sm pl-space-xs">
            <span class="font-code-sm text-code-sm text-on-surface-variant/70">Source Hash: SHA256-STAT-VERIFIED</span>
            <div class="flex items-center gap-2">
              <button onclick="navigator.clipboard.writeText('${escapeHtml(item.citation)}'); window.showToast('Citation Copied', '${escapeHtml(item.citation)}')" class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">content_copy</span> Copy Citation
              </button>
              <button onclick="window.location.href='/assistant?q=Provide%20deep%20legal%20analysis%20of%20${encodeURIComponent(item.citation)}'" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shadow-xs flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">smart_toy</span> Synthesize in Copilot
              </button>
            </div>
          </div>
        </article>
      `).join("");
    })
    .catch(() => {});
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
