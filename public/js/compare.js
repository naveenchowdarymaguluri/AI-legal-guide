// LegalAI - Document Comparison Script (compare.js)

document.addEventListener("DOMContentLoaded", () => {
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
    if (b.textContent.includes("Share Diff")) {
      b.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        window.showToast("Link Copied", "Secure diff session URL copied to clipboard.");
      });
    } else if (b.textContent.includes("Export Comparison")) {
      b.addEventListener("click", () => {
        window.showToast("Exporting Redline", "Generating certified redline comparison audit document...");
      });
    }
  });
});
