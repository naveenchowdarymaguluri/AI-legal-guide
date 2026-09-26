// LegalAI - Document Comparison Script (compare.js)

document.addEventListener("DOMContentLoaded", () => {
  initCompareControls();
  initChangeFilesModal();
});

function initCompareControls() {
  const fullscreenBtn = document.getElementById("btn-fullscreen") ||
    Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Fullscreen"));

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fullscreenBtn.innerHTML = `<span class="material-symbols-outlined text-base">fullscreen_exit</span><span>Exit Fullscreen</span>`;
      } else {
        document.exitFullscreen().catch(() => {});
        fullscreenBtn.innerHTML = `<span class="material-symbols-outlined text-base">fullscreen</span><span>Switch to Fullscreen</span>`;
      }
    });
  }

  document.querySelectorAll("button").forEach(b => {
    const text = b.textContent.trim();
    if (text.includes("Share Diff")) {
      b.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        window.showToast("Link Copied", "Encrypted diff comparison URL copied to clipboard.");
      });
    } else if (text.includes("Export Comparison")) {
      b.addEventListener("click", () => {
        downloadDiffReport();
      });
    }
  });
}

function initChangeFilesModal() {
  const changeBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Change Files"));

  const modalHtml = `
    <div id="compareModal" class="hidden fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-2xl">difference</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Select Contracts to Compare</h3>
          </div>
          <button onclick="document.getElementById('compareModal').classList.add('hidden')" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form id="compareSelectForm" class="space-y-4">
          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Baseline Document (Version 1 / Original)</label>
            <select id="compareDocA" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface">
            </select>
          </div>

          <div class="flex justify-center my-1 text-secondary">
            <span class="material-symbols-outlined text-xl">sync_alt</span>
          </div>

          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Revised Document (Version 2 / Clean / Markup)</label>
            <select id="compareDocB" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface">
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="document.getElementById('compareModal').classList.add('hidden')" class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md transition-colors shadow-sm flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Execute Differential</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("compareModal");
  const selA = document.getElementById("compareDocA");
  const selB = document.getElementById("compareDocB");
  const form = document.getElementById("compareSelectForm");

  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      fetch("/api/documents")
        .then(r => r.json())
        .then(data => {
          const docs = data.documents || [];
          const optionsA = docs.map(d => `<option value="${d.id}">📄 ${escapeHtml(d.title)}</option>`).join("");
          const optionsB = docs.map((d, i) => `<option value="${d.id}" ${i === 1 ? 'selected' : ''}>📄 ${escapeHtml(d.title)}</option>`).join("");
          selA.innerHTML = optionsA;
          selB.innerHTML = optionsB;
          modal.classList.remove("hidden");
        });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const idA = selA.value;
    const idB = selB.value;
    modal.classList.add("hidden");
    window.location.href = `/compare?a=${idA}&b=${idB}`;
  });
}

function downloadDiffReport() {
  fetch("/api/compare")
    .then(r => r.json())
    .then(diff => {
      let report = `LEGALAI PLATFORM - CONTRACTUAL REDLINE & AUDIT REPORT\n`;
      report += `Generated: ${new Date().toISOString()}\n`;
      report += `Baseline: ${diff.versionA.title} (${diff.versionA.filename})\n`;
      report += `Revised:  ${diff.versionB.title} (${diff.versionB.filename})\n`;
      report += `Summary: ${diff.stats.additions} Additions, ${diff.stats.deletions} Deletions, Net Shift: ${diff.stats.netRiskShift}\n\n`;
      report += `=== SECTION REDLINE DETAILS ===\n\n`;

      diff.diffClauses.forEach(c => {
        report += `[${c.section}] ${c.title} (${c.type.toUpperCase()})\n`;
        report += `Risk Delta: ${c.riskDelta}\n`;
        report += `Original: ${c.original}\n`;
        report += `Revised:  ${c.revised}\n`;
        report += `Explanation: ${c.explanation}\n\n`;
      });

      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contract_Diff_Report_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.showToast("Export Ready", "Downloaded certified contract diff report.");
    });
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
