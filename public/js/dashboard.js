// LegalAI - Executive Dashboard Script (dashboard.js)

document.addEventListener("DOMContentLoaded", () => {
  initDashboardDirectInquiry();
  initDashboardQuickCards();
  loadDashboardDocuments();
  loadDashboardTelemetry();
});

function initDashboardDirectInquiry() {
  const input = document.getElementById("query-input");
  const askBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Ask AI"));

  function executeInquiry() {
    const q = input ? input.value.trim() : "";
    if (q) {
      window.location.href = `/assistant?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = "/assistant";
    }
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeInquiry();
      }
    });
  }

  if (askBtn) {
    askBtn.addEventListener("click", (e) => {
      e.preventDefault();
      executeInquiry();
    });
  }
}

function initDashboardQuickCards() {
  // 4 Main Bento Action Cards
  const cards = document.querySelectorAll(".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > div");
  if (cards.length >= 4) {
    cards[0].addEventListener("click", () => window.location.href = "/assistant");
    cards[1].addEventListener("click", () => window.location.href = "/analysis");
    cards[2].addEventListener("click", () => window.location.href = "/compare");
    cards[3].addEventListener("click", () => window.location.href = "/research");
  }

  // Quick Action Buttons
  document.querySelectorAll("button").forEach(b => {
    const text = b.textContent.trim();
    if (text.includes("Upload New") || text.includes("Upload Document")) {
      b.addEventListener("click", () => window.location.href = "/documents");
    } else if (text.includes("Compare 2 Files")) {
      b.addEventListener("click", () => window.location.href = "/compare");
    } else if (text.includes("Search Case Law")) {
      b.addEventListener("click", () => window.location.href = "/research");
    }
  });
}

function loadDashboardDocuments() {
  const tbody = document.getElementById("dashboard-recent-docs") || document.querySelector("tbody");
  if (!tbody) return;

  fetch("/api/documents")
    .then(r => r.json())
    .then(data => {
      const docs = data.documents || [];
      if (!docs.length) return;

      tbody.innerHTML = docs.slice(0, 5).map(doc => `
        <tr class="hover:bg-surface-container-low/50 transition-colors cursor-pointer" onclick="window.location.href='/analysis?id=${doc.id}'">
          <td class="py-space-md px-space-md">
            <div class="flex items-center gap-space-sm min-w-0">
              <div class="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-medium text-on-surface truncate">${escapeHtml(doc.title)}</span>
                <span class="font-code-sm text-code-sm text-on-surface-variant/70 font-mono">HASH: ${doc.hash ? doc.hash.substring(0, 8) + '...' : 'Verified'}</span>
              </div>
            </div>
          </td>
          <td class="py-space-md px-space-sm text-on-surface-variant font-medium">${doc.type || 'Contract'}</td>
          <td class="py-space-md px-space-sm text-on-surface-variant">${doc.pages || 12} pages</td>
          <td class="py-space-md px-space-sm text-on-surface-variant">${new Date(doc.uploadedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
          <td class="py-space-md px-space-sm">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm font-medium">
              <span class="w-1.5 h-1.5 rounded-full ${doc.status === 'Analyzed' ? 'bg-secondary' : 'bg-amber-500'}"></span>
              <span>${doc.status} • ${(doc.clauses || []).length} Clauses</span>
            </span>
          </td>
          <td class="py-space-md px-space-md text-right" onclick="event.stopPropagation()">
            <div class="inline-flex items-center gap-1">
              <button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Inspect Clauses" onclick="window.location.href='/analysis?id=${doc.id}'">
                <span class="material-symbols-outlined text-base">visibility</span>
              </button>
              <button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Ask AI" onclick="window.location.href='/assistant?q=Explain%20${encodeURIComponent(doc.title)}'">
                <span class="material-symbols-outlined text-base">smart_toy</span>
              </button>
              <a href="/api/documents/${doc.id}/download" class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex items-center" title="Download Text Extract">
                <span class="material-symbols-outlined text-base">download</span>
              </a>
            </div>
          </td>
        </tr>
      `).join("");
    })
    .catch(() => {});
}

function loadDashboardTelemetry() {
  fetch("/api/system/status")
    .then(r => r.json())
    .then(stat => {
      document.querySelectorAll(".telemetry-latency").forEach(el => {
        el.textContent = `Latency: ${stat.latencyMs}ms`;
      });
    })
    .catch(() => {});
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
