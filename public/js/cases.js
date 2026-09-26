// LegalAI - Case Management Script (cases.js)

let activeCaseId = "case-1";
let allCasesList = [];

document.addEventListener("DOMContentLoaded", () => {
  initCaseModal();
  initCategoryFilters();
  loadCases();
});

function loadCases(categoryFilter = "All") {
  fetch("/api/cases")
    .then(r => r.json())
    .then(cases => {
      allCasesList = cases;
      
      // Update top count metrics
      const activeCountEl = document.querySelector(".font-display-lg:has-text('03')") || document.querySelector(".font-display-lg");
      if (activeCountEl) {
        activeCountEl.textContent = cases.length < 10 ? `0${cases.length}` : cases.length;
      }

      let filtered = cases;
      if (categoryFilter && categoryFilter !== "All" && categoryFilter !== "All Cases") {
        filtered = cases.filter(c => c.category.toLowerCase().includes(categoryFilter.toLowerCase()));
      }

      renderCasesList(filtered);
      const selected = cases.find(c => c.id === activeCaseId) || cases[0];
      if (selected) {
        activeCaseId = selected.id;
        renderCaseDossier(selected);
      }
    })
    .catch(() => {});
}

function renderCasesList(cases) {
  const listContainer = document.querySelector(".xl\\:col-span-4 .space-y-space-md") ||
                        document.querySelector(".xl\\:col-span-4");
  if (!listContainer) return;

  const header = `
    <div class="flex items-center justify-between px-1 mb-2">
      <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Tracked Matters (${cases.length})</span>
      <span class="font-code-sm text-code-sm text-on-surface-variant/70">Live Docket Sync</span>
    </div>
  `;

  const cardsHtml = cases.map(c => {
    const isSelected = c.id === activeCaseId;
    return `
      <div class="relative bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md cursor-pointer transition-all border ${isSelected ? 'border-secondary shadow-sm' : 'border-outline-variant/30 hover:bg-surface-container-low/50'}" onclick="selectCase('${c.id}')">
        ${isSelected ? '<div class="absolute left-0 top-3 bottom-3 w-1.5 bg-secondary rounded-r-full"></div>' : ''}
        <div class="flex items-start justify-between gap-2 mb-2 pl-2">
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="font-code-sm text-code-sm text-secondary font-medium font-mono">${escapeHtml(c.docket)}</span>
              <span class="text-outline-variant">•</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant truncate">${escapeHtml(c.client)}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug truncate">${escapeHtml(c.title)}</h3>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shrink-0 text-xs">
            ${escapeHtml(c.category)}
          </span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 pl-2 mb-space-sm">
          ${escapeHtml(c.summary || '')}
        </p>
        <div class="flex items-center justify-between pt-2 bg-surface-container-low/60 rounded-lg px-3 py-2 pl-3 text-xs font-label-sm">
          <div class="flex items-center gap-3 text-on-surface-variant">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">alarm</span>
              ${c.nextDeadline ? 'Due ' + c.nextDeadline : 'Open'}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">checklist</span>
              ${(c.tasks || []).filter(t => t.done).length}/${(c.tasks || []).length} Tasks
            </span>
          </div>
          <span class="font-code-sm text-code-sm text-secondary font-medium flex items-center">
            ${isSelected ? 'Active' : 'Inspect'}
            <span class="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
          </span>
        </div>
      </div>
    `;
  }).join("");

  listContainer.innerHTML = header + `<div class="space-y-3">${cardsHtml}</div>`;
}

window.selectCase = function(id) {
  activeCaseId = id;
  const matched = allCasesList.find(c => c.id === id);
  if (matched) {
    renderCaseDossier(matched);
    renderCasesList(allCasesList);
  }
};

function renderCaseDossier(c) {
  const dossierContainer = document.querySelector(".xl\\:col-span-8");
  if (!dossierContainer) return;

  const tasksHtml = (c.tasks || []).map(t => `
    <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low/60 border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
      <label class="flex items-center gap-3 cursor-pointer select-none min-w-0 flex-1">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask('${c.id}', '${t.id}', this.checked)" class="w-4 h-4 accent-secondary rounded cursor-pointer" />
        <span class="font-body-md text-body-md ${t.done ? 'line-through text-on-surface-variant/60' : 'text-on-surface font-medium'} truncate">
          ${escapeHtml(t.text)}
        </span>
      </label>
      <span class="font-code-sm text-code-sm text-outline ml-2 shrink-0">Milestone</span>
    </div>
  `).join("");

  dossierContainer.innerHTML = `
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-space-lg flex flex-col gap-space-lg animate-in fade-in duration-200">
      <!-- Dossier Header -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-space-md pb-space-md border-b border-outline-variant/20">
        <div class="flex flex-col gap-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-code-sm text-code-sm px-2 py-0.5 rounded bg-secondary/10 text-secondary font-mono font-medium">${escapeHtml(c.docket)}</span>
            <span class="text-outline-variant">•</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">${escapeHtml(c.jurisdiction)}</span>
          </div>
          <h2 class="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
            ${escapeHtml(c.title)}
          </h2>
          <span class="font-body-sm text-body-sm text-on-surface-variant">
            Client Entity: <strong class="text-on-surface">${escapeHtml(c.client)}</strong> • Lead Counsel: <strong class="text-on-surface">${escapeHtml(c.leadCounsel)}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.location.href='/drafts'" class="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-xs">
            <span class="material-symbols-outlined text-base">edit_note</span>
            <span>Draft Pleading</span>
          </button>
          <button onclick="window.location.href='/assistant?q=Provide%20case%20strategy%20for%20${encodeURIComponent(c.title)}'" class="px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-xs">
            <span class="material-symbols-outlined text-base">smart_toy</span>
            <span>Case Strategy AI</span>
          </button>
        </div>
      </div>

      <!-- Scope & Overview -->
      <div class="bg-surface-container-low/50 p-space-md rounded-xl border-l-4 border-secondary space-y-1">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Matter Scope & Evidentiary Objectives</span>
        <p class="font-body-md text-body-md text-on-surface leading-relaxed">
          ${escapeHtml(c.summary || 'Comprehensive legal review and docket deadline management.')}
        </p>
      </div>

      <!-- Next Statutory Deadline Banner -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div class="p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">alarm</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Next Statutory Deadline</span>
            <span class="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">${escapeHtml(c.deadlineLabel || 'Court Filing')}</span>
            <span class="font-code-sm text-code-sm text-error font-medium">${escapeHtml(c.nextDeadline || 'Pending')}</span>
          </div>
        </div>

        <div class="p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">gavel</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Forum & Court Branch</span>
            <span class="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">${escapeHtml(c.jurisdiction)}</span>
            <span class="font-code-sm text-code-sm text-secondary font-medium">Verified Active Jurisdiction</span>
          </div>
        </div>
      </div>

      <!-- Milestone Tasks Checklist -->
      <div class="space-y-space-sm">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Milestone Tasks & Filings</h3>
          <span class="font-code-sm text-code-sm text-on-surface-variant font-mono">Real-Time Persistent Sync</span>
        </div>
        <div class="space-y-2">
          ${tasksHtml}
        </div>
      </div>
    </div>
  `;
}

window.toggleTask = function(caseId, taskId, isDone) {
  fetch(`/api/cases/${caseId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, done: isDone })
  })
    .then(r => r.json())
    .then(updated => {
      const idx = allCasesList.findIndex(c => c.id === caseId);
      if (idx !== -1) allCasesList[idx] = updated;
      window.showToast("Task Synchronized", isDone ? "Marked milestone as completed." : "Task reset to pending.");
      renderCasesList(allCasesList);
    });
};

function initCategoryFilters() {
  document.querySelectorAll(".flex.items-center.bg-surface-container-low button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".flex.items-center.bg-surface-container-low button").forEach(b => {
        b.classList.remove("bg-surface-container-lowest", "shadow-sm", "text-on-surface");
        b.classList.add("text-on-surface-variant");
      });
      btn.classList.add("bg-surface-container-lowest", "shadow-sm", "text-on-surface");
      btn.classList.remove("text-on-surface-variant");

      const catText = btn.textContent.split("(")[0].trim();
      loadCases(catText);
    });
  });
}

function initCaseModal() {
  const newCaseBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("New Case"));

  const modalHtml = `
    <div id="newCaseModal" class="hidden fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-2xl">folder_shared</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Create Legal Case Dossier</h3>
          </div>
          <button onclick="document.getElementById('newCaseModal').classList.add('hidden')" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form id="caseCreateForm" class="space-y-4">
          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Matter / Case Title</label>
            <input type="text" name="title" id="caseTitle" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface" placeholder="e.g. Apex Dynamics Intellectual Property Audit" required />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Client Entity</label>
              <input type="text" name="client" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface" placeholder="e.g. Apex Dynamics, Inc." required />
            </div>
            <div>
              <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Docket Number</label>
              <input type="text" name="docket" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface" placeholder="e.g. D-2026-CV-88219" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Jurisdiction / Forum</label>
              <select name="jurisdiction" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface">
                <option value="Delaware Chancery Court">Delaware Chancery Court</option>
                <option value="California Northern District">California Northern District</option>
                <option value="San Francisco Superior Court">San Francisco Superior Court</option>
                <option value="AAA Commercial Arbitration">AAA Commercial Arbitration</option>
                <option value="Supreme Court of India">Supreme Court of India</option>
              </select>
            </div>
            <div>
              <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Workflow Phase</label>
              <select name="category" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface">
                <option value="Information Gathering">Information Gathering</option>
                <option value="Researching">Researching</option>
                <option value="In Draft">In Draft</option>
                <option value="Active Litigation">Active Litigation</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Matter Scope & Objectives</label>
            <textarea name="summary" rows="2" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface" placeholder="Brief outline of legal issues, risks, and procedural goals..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="document.getElementById('newCaseModal').classList.add('hidden')" class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md transition-colors shadow-sm flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              <span>Open Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modal = document.getElementById("newCaseModal");
  const form = document.getElementById("caseCreateForm");

  if (newCaseBtn) {
    newCaseBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(created => {
        modal.classList.add("hidden");
        form.reset();
        activeCaseId = created.id;
        window.showToast("Case Dossier Created", `Docket #${created.docket} created successfully.`);
        loadCases();
      })
      .catch(() => {
        window.showToast("Error", "Could not create case.", "error");
      });
  });
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
