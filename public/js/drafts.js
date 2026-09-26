// LegalAI - Draft Assistant Script (drafts.js)

let currentTemplateId = "tpl-1";
let currentDraftText = "";

document.addEventListener("DOMContentLoaded", () => {
  initClassificationCards();
  initDraftActions();
  generateDraftText();
});

function initClassificationCards() {
  const cards = document.querySelectorAll(".grid.grid-cols-2.md\\:grid-cols-4.xl\\:grid-cols-7 > button, .grid.grid-cols-2.md\\:grid-cols-4.xl\\:grid-cols-7 > div");
  cards.forEach((card, idx) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      cards.forEach(c => {
        c.classList.remove("ring-2", "ring-secondary", "shadow-md");
        const badge = c.querySelector(".font-code-sm.bg-secondary");
        if (badge) badge.remove();
      });
      card.classList.add("ring-2", "ring-secondary", "shadow-md");

      // Set template based on selection
      if (idx === 0) currentTemplateId = "tpl-3"; // Complaint
      else if (idx === 1) currentTemplateId = "tpl-1"; // Notice
      else currentTemplateId = "tpl-2"; // Agreement

      const title = card.querySelector(".font-headline-sm")?.textContent.trim();
      window.showToast("Classification Selected", `Switched to: ${title}`);
      generateDraftText();
    });
  });
}

function generateDraftText() {
  const regenBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Regenerate Draft"));
  if (regenBtn) {
    regenBtn.disabled = true;
    regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span><span>Synthesizing...</span>`;
  }

  fetch("/api/drafts/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateId: currentTemplateId,
      variables: {
        recipientName: "Alexander Wright",
        recipientTitle: "Executive Vice President",
        companyName: "TechCorp Global Corp",
        section: "Section 8.2",
        effectiveDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      }
    })
  })
    .then(r => r.json())
    .then(data => {
      currentDraftText = data.draftText;
      renderEditor(data.draftText, data.title);
      if (regenBtn) {
        regenBtn.disabled = false;
        regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg">auto_awesome</span><span>Regenerate Draft</span>`;
      }
    })
    .catch(() => {
      if (regenBtn) {
        regenBtn.disabled = false;
        regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg">auto_awesome</span><span>Regenerate Draft</span>`;
      }
    });
}

function renderEditor(text, title) {
  // Find editor canvas in center pane
  const editorPane = document.querySelector(".bg-surface-container-lowest.rounded-xl.p-space-lg") ||
                     document.querySelector("main .space-y-space-lg > div:nth-child(4)") ||
                     document.querySelector("pre")?.parentElement;

  if (editorPane) {
    let editor = document.getElementById("legal-draft-editor");
    if (!editor) {
      editorPane.innerHTML = `
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-xl">edit_document</span>
            <span id="draftTitleDisplay" class="font-headline-sm text-headline-sm text-on-surface font-semibold">${escapeHtml(title || 'Draft')}</span>
            <span class="font-code-sm text-code-sm px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">Statutory Compliant</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="copyDraftBtn" class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1 shadow-xs">
              <span class="material-symbols-outlined text-base">content_copy</span>
              <span>Copy</span>
            </button>
            <button id="downloadDraftBtn" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors flex items-center gap-1 shadow-xs">
              <span class="material-symbols-outlined text-base">download</span>
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
        <textarea id="legal-draft-editor" class="w-full h-[520px] bg-surface-container-low/50 font-serif text-base text-on-surface p-4 rounded-xl border border-outline-variant/40 focus:border-secondary focus:bg-surface-container-lowest focus:outline-none leading-relaxed transition-all resize-y shadow-inner"></textarea>
      `;
      editor = document.getElementById("legal-draft-editor");

      document.getElementById("copyDraftBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(editor.value);
        window.showToast("Copied to Clipboard", "Complete draft text copied.");
      });

      document.getElementById("downloadDraftBtn").addEventListener("click", () => {
        const blob = new Blob([editor.value], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Legal_Draft_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.showToast("Draft Downloaded", "Legal document saved locally.");
      });
    }

    if (editor) {
      editor.value = text;
    }
    const titleEl = document.getElementById("draftTitleDisplay");
    if (titleEl && title) titleEl.textContent = title;
  }
}

function initDraftActions() {
  const regenBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Regenerate Draft"));
  if (regenBtn) {
    regenBtn.addEventListener("click", () => {
      generateDraftText();
    });
  }

  // Version History Button
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("Version History")) {
      b.addEventListener("click", () => {
        window.showToast("Version Timeline", "Displaying version branches: v1.0 (Base), v2.1 (Counsel review), v3.0 (Active Live Draft).");
      });
    }
  });
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
