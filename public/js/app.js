// LegalAI Platform - Global Application Script (app.js)

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCommandPalette();
  initGlobalHeader();
});

// Highlight current navigation link based on window.location.pathname
function initNavigation() {
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  
  // Sidebar navigation links
  const navLinks = document.querySelectorAll("aside nav a, header nav a");
  navLinks.forEach(link => {
    const dataPath = link.getAttribute("data-path");
    const href = link.getAttribute("href");
    
    // Normalize path matches
    const isCurrent = 
      (currentPath === "/" && (dataPath === "landing" || href === "/")) ||
      (currentPath === "/dashboard" && (dataPath === "dashboard" || href === "/dashboard")) ||
      (currentPath === "/assistant" && (dataPath === "ai-assistant" || dataPath === "assistant" || href === "/assistant")) ||
      (currentPath === "/documents" && (dataPath === "documents" || href === "/documents")) ||
      (currentPath === "/analysis" && (dataPath === "document-analysis" || href === "/analysis")) ||
      (currentPath === "/compare" && (dataPath === "compare" || href === "/compare")) ||
      (currentPath === "/research" && (dataPath === "legal-research" || dataPath === "research" || href === "/research")) ||
      (currentPath === "/cases" && (dataPath === "cases" || href === "/cases")) ||
      (currentPath === "/drafts" && (dataPath === "drafts" || href === "/drafts")) ||
      (currentPath === "/settings" && (dataPath === "settings" || href === "/settings")) ||
      (currentPath === "/pricing" && (dataPath === "pricing" || href === "/pricing")) ||
      (currentPath === "/how-it-works" && (dataPath === "how-it-works" || href === "/how-it-works")) ||
      (currentPath === "/security" && (dataPath === "security" || href === "/security")) ||
      (currentPath === "/states" && (dataPath === "states-workspace" || href === "/states"));

    if (isCurrent && !link.classList.contains("no-active-style")) {
      link.classList.add("bg-surface-container-highest/20", "text-on-primary", "font-medium");
      link.setAttribute("aria-current", "page");
    }
  });

  // Map internal href="#" placeholders to actual URLs
  const pathMap = {
    "dashboard": "/dashboard",
    "ai-assistant": "/assistant",
    "assistant": "/assistant",
    "documents": "/documents",
    "document-analysis": "/analysis",
    "analysis": "/analysis",
    "legal-research": "/research",
    "research": "/research",
    "compare": "/compare",
    "cases": "/cases",
    "drafts": "/drafts",
    "settings": "/settings",
    "states-workspace": "/states",
    "documentation": "/how-it-works",
    "how-it-works": "/how-it-works",
    "pricing": "/pricing",
    "features": "/#features",
    "legal-research-overview": "/research",
    "sign-in": "/auth",
    "get-started": "/auth"
  };

  document.querySelectorAll("[data-path]").forEach(el => {
    const p = el.getAttribute("data-path");
    if (pathMap[p] && (!el.getAttribute("href") || el.getAttribute("href") === "#")) {
      el.setAttribute("href", pathMap[p]);
    }
  });
}

// Global Command Palette (⌘K / Ctrl+K)
function initCommandPalette() {
  const paletteHtml = `
    <div id="cmdPaletteModal" class="hidden fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4 transition-opacity">
      <div class="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div class="p-3 border-b border-outline-variant/30 flex items-center gap-3">
          <span class="material-symbols-outlined text-secondary text-2xl">search_spark</span>
          <input id="cmdPaletteInput" class="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none" placeholder="Type a command, document, statute or query... (e.g. 'Compare', 'Employment', 'CA Labor Code')" />
          <span class="font-code-sm text-code-sm px-2 py-1 rounded bg-surface-container-low text-on-surface-variant">ESC</span>
        </div>
        <div id="cmdPaletteResults" class="max-h-96 overflow-y-auto p-2 space-y-1">
          <div class="px-3 py-1.5 text-xs font-label-sm uppercase tracking-wider text-outline">Quick Navigation</div>
          <a href="/dashboard" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">dashboard</span>
              <span class="font-label-md text-label-md">Executive Dashboard</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/dashboard</span>
          </a>
          <a href="/assistant" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">smart_toy</span>
              <span class="font-label-md text-label-md">AI Evidence Copilot</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/assistant</span>
          </a>
          <a href="/documents" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">description</span>
              <span class="font-label-md text-label-md">Documents Repository</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/documents</span>
          </a>
          <a href="/analysis" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">rule</span>
              <span class="font-label-md text-label-md">Document Analysis & Clauses</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/analysis</span>
          </a>
          <a href="/compare" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">difference</span>
              <span class="font-label-md text-label-md">Compare 2 Contracts</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/compare</span>
          </a>
          <a href="/research" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">menu_book</span>
              <span class="font-label-md text-label-md">Legal Research & Case Law</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/research</span>
          </a>
          <a href="/cases" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">gavel</span>
              <span class="font-label-md text-label-md">Cases & Dockets</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/cases</span>
          </a>
          <a href="/drafts" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">edit_note</span>
              <span class="font-label-md text-label-md">Draft Assistant</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/drafts</span>
          </a>
          <a href="/settings" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">settings</span>
              <span class="font-label-md text-label-md">Workspace Settings</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/settings</span>
          </a>
          <a href="/states" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-sm text-secondary">view_quilt</span>
              <span class="font-label-md text-label-md">UX States & Resilience</span>
            </div>
            <span class="font-code-sm text-code-sm text-outline">/states</span>
          </a>
        </div>
        <div class="p-2.5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-label-sm">
          <span>Navigate with <kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-code-sm">↑</kbd> <kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-code-sm">↓</kbd></span>
          <span>Press <kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-code-sm">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", paletteHtml);

  const modal = document.getElementById("cmdPaletteModal");
  const input = document.getElementById("cmdPaletteInput");

  function openPalette() {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
  }

  function closePalette() {
    modal.classList.add("hidden");
  }

  // Keyboard shortcut listener (⌘K or Ctrl+K)
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("hidden")) {
        openPalette();
      } else {
        closePalette();
      }
    } else if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closePalette();
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closePalette();
  });

  // Clicking search boxes in the top bar triggers palette
  document.querySelectorAll("header .font-body-sm").forEach(box => {
    if (box.textContent.includes("Search documents") || box.closest("div").querySelector(".font-code-sm")?.textContent.includes("⌘K")) {
      box.closest("div").style.cursor = "pointer";
      box.closest("div").addEventListener("click", (e) => {
        e.preventDefault();
        openPalette();
      });
    }
  });
}

// Global Toast System
window.showToast = function(title, message = "", type = "success") {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    const toastHtml = `
      <div id="globalToast" class="hidden fixed bottom-8 right-8 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-2">
        <div id="toastIconContainer" class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
          <span class="material-symbols-outlined text-sm">done</span>
        </div>
        <div class="flex flex-col min-w-[220px]">
          <span id="toastTitle" class="font-label-md text-label-md font-semibold text-on-primary"></span>
          <span id="toastMessage" class="font-body-sm text-body-sm text-on-primary-container"></span>
        </div>
        <button onclick="hideToast()" class="text-on-primary-container hover:text-on-primary ml-2">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", toastHtml);
    toast = document.getElementById("globalToast");
  }

  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;
  toast.classList.remove("hidden");
  toast.classList.remove("translate-y-2");

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    hideToast();
  }, 4500);
};

window.hideToast = function() {
  const toast = document.getElementById("globalToast");
  if (toast) toast.classList.add("hidden");
};

function initGlobalHeader() {
  // Sync live latency & verified badge
  fetch("/api/system/status")
    .then(r => r.json())
    .then(data => {
      document.querySelectorAll("[data-live-latency]").forEach(el => {
        el.textContent = `Latency: ${data.latencyMs}ms`;
      });
    })
    .catch(() => {});
}
