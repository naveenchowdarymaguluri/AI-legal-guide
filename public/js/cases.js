// LegalAI - Case Management Script (cases.js)

document.addEventListener("DOMContentLoaded", () => {
  initCaseModal();
  initTaskCheckboxes();
  initCategoryFilters();
});

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
          <button onclick="closeCaseModal()" class="text-on-surface-variant hover:text-on-surface">
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
            <button type="button" onclick="closeCaseModal()" class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
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
        closeCaseModal();
        window.showToast("Case Dossier Created", `Docket #${created.docket} created successfully.`);
        setTimeout(() => window.location.reload(), 800);
      })
      .catch(() => {
        window.showToast("Error", "Could not create case.", "error");
      });
  });
}

window.closeCaseModal = function() {
  const modal = document.getElementById("newCaseModal");
  if (modal) modal.classList.add("hidden");
};

function initTaskCheckboxes() {
  document.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", () => {
      const label = cb.closest("div")?.querySelector("span, p");
      if (label) {
        if (cb.checked) {
          label.classList.add("line-through", "text-on-surface-variant/60");
        } else {
          label.classList.remove("line-through", "text-on-surface-variant/60");
        }
      }
      window.showToast("Task Updated", cb.checked ? "Milestone task marked as complete." : "Task marked pending.");
    });
  });
}

function initCategoryFilters() {
  document.querySelectorAll(".flex.items-center.bg-surface-container-low button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".flex.items-center.bg-surface-container-low button").forEach(b => {
        b.classList.remove("bg-surface-container-lowest", "shadow-sm", "text-on-surface");
        b.classList.add("text-on-surface-variant");
      });
      btn.classList.add("bg-surface-container-lowest", "shadow-sm", "text-on-surface");
      btn.classList.remove("text-on-surface-variant");

      const filterText = btn.textContent.split("(")[0].trim().toLowerCase();
      window.showToast("Filtered Matters", `Displaying: ${btn.textContent.trim()}`);
    });
  });
}
