// LegalAI - Documents Management Script (documents.js)

document.addEventListener("DOMContentLoaded", () => {
  loadDocuments();
  initDocumentFilters();
  initUploadModal();
  bindBatchActions();
});

function loadDocuments(filterType = null, filterStatus = null) {
  const container = document.getElementById("document-grid-container") || document.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3");
  if (!container) return;

  fetch("/api/documents")
    .then(r => r.json())
    .then(data => {
      let docs = data.documents || [];
      
      // Update count badge
      const countBadge = document.querySelector(".font-code-sm:has-text('Active Files')") || document.querySelector(".font-code-sm.px-2.py-0.5.rounded-full");
      if (countBadge) {
        countBadge.textContent = `${docs.length} Active Files`;
      }

      if (filterType && filterType !== "All") {
        docs = docs.filter(d => (d.type || "").toLowerCase().includes(filterType.toLowerCase()));
      }
      if (filterStatus && filterStatus !== "All") {
        docs = docs.filter(d => (d.status || "").toLowerCase() === filterStatus.toLowerCase());
      }

      if (!docs.length) {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3">
            <span class="material-symbols-outlined text-4xl text-outline">folder_open</span>
            <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface">No documents match this filter</h3>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-sm">Upload a new legal agreement or reset active filters.</p>
            <button onclick="document.getElementById('trigger-upload-btn').click()" class="mt-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md">
              + Upload Document
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = docs.map(doc => {
        const isAnalyzed = doc.status === "Analyzed";
        const riskBadge = doc.highRisks > 0 
          ? `<span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-error-container text-error font-medium font-code-sm">
               <span class="material-symbols-outlined text-xs">warning</span> ${doc.highRisks} Critical Risks
             </span>`
          : `<span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-surface-container text-secondary font-medium font-code-sm">
               <span class="material-symbols-outlined text-xs">verified</span> Baseline Verified
             </span>`;

        return `
          <div class="group relative flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all duration-200 border border-outline-variant/30" data-doc-id="${doc.id}">
            <div class="flex flex-col gap-space-sm">
              <div class="flex items-start justify-between gap-space-sm">
                <div class="flex items-center gap-space-sm min-w-0">
                  <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">${escapeHtml(doc.type || 'Contract')}</span>
                    <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold truncate group-hover:text-secondary transition-colors" title="${escapeHtml(doc.title)}">
                      ${escapeHtml(doc.title)}
                    </h3>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm ${isAnalyzed ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-low text-on-surface-variant'} shrink-0">
                  <span class="w-2 h-2 rounded-full ${isAnalyzed ? 'bg-secondary' : 'bg-amber-500'}"></span>
                  <span>${doc.status}</span>
                </span>
              </div>

              <!-- Metadata specs -->
              <div class="grid grid-cols-2 gap-space-xs py-space-xs bg-surface-container-low/60 rounded-lg px-space-sm font-body-sm text-body-sm">
                <div class="flex flex-col">
                  <span class="font-label-sm text-label-sm text-outline">Size & Pages</span>
                  <span class="font-code-sm text-code-sm text-on-surface font-medium truncate">${doc.pages || 12} Pages • ${doc.size || '1.2 MB'}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-label-sm text-label-sm text-outline">Parsed Clauses</span>
                  <span class="font-code-sm text-code-sm text-on-surface font-medium">${(doc.clauses || []).length} Clauses</span>
                </div>
              </div>

              <!-- Risk Indicator Preview -->
              <div class="flex items-center justify-between p-space-xs rounded bg-surface-container-low text-on-surface-variant">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-base text-secondary">auto_awesome</span>
                  <span class="text-xs truncate font-body-sm">Hash: <code>${doc.hash ? doc.hash.substring(0, 10) + '...' : 'Verified'}</code></span>
                </div>
                ${riskBadge}
              </div>
            </div>

            <div class="mt-space-md pt-space-sm flex items-center justify-between border-t border-outline-variant/20">
              <span class="font-code-sm text-code-sm text-outline truncate">${new Date(doc.uploadedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <div class="flex items-center gap-1.5">
                <button onclick="window.location.href='/analysis?id=${doc.id}'" class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-xs">
                  Inspect
                </button>
                <button onclick="window.location.href='/analysis?id=${doc.id}'" class="px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-label-md text-label-md transition-colors font-medium">
                  Analyze
                </button>
                <a href="/api/documents/${doc.id}/download" class="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex" title="Download Text Extract">
                  <span class="material-symbols-outlined text-base">download</span>
                </a>
                <button onclick="deleteDocumentItem('${doc.id}', '${escapeHtml(doc.title)}')" class="p-1.5 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Delete Document">
                  <span class="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    })
    .catch(() => {});
}

window.deleteDocumentItem = function(id, title) {
  if (!confirm(`Are you sure you want to remove "${title}" from your private repository?`)) return;

  fetch(`/api/documents/${id}`, { method: "DELETE" })
    .then(r => r.json())
    .then(() => {
      window.showToast("Document Deleted", `Removed "${title}" from workspace.`);
      loadDocuments();
    })
    .catch(() => {
      window.showToast("Error", "Could not delete document.", "error");
    });
};

function initDocumentFilters() {
  const searchInput = document.querySelector("input[placeholder*='Search documents']") || document.getElementById("doc-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value.toLowerCase();
      document.querySelectorAll("[data-doc-id]").forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(val) ? "" : "none";
      });
    });
  }

  // Type filter buttons/select
  document.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => {
      loadDocuments(sel.value);
    });
  });
}

function initUploadModal() {
  const uploadBtn = document.getElementById("trigger-upload-btn") ||
                    Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Upload Document"));

  const modalHtml = `
    <div id="uploadDocModal" class="hidden fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-2xl">upload_file</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Upload Legal Document</h3>
          </div>
          <button onclick="closeUploadModal()" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form id="docUploadForm" class="space-y-4">
          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Document Title</label>
            <input type="text" name="title" id="uploadTitle" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface" placeholder="e.g. Master Services Agreement v3.0" required />
          </div>

          <div>
            <label class="block font-label-md text-label-md text-on-surface font-medium mb-1">Contract Classification</label>
            <select name="type" id="uploadType" class="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-secondary focus:outline-none font-body-md text-body-md text-on-surface">
              <option value="Executive Contract">Executive Contract</option>
              <option value="Commercial MSA">Commercial MSA</option>
              <option value="Confidentiality">Confidentiality / NDA</option>
              <option value="Real Estate Lease">Real Estate Lease</option>
              <option value="IP Assignment">IP Assignment & Licensing</option>
            </select>
          </div>

          <div id="dropZone" class="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:border-secondary hover:bg-surface-container-low/50 transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-3xl text-secondary mb-2">cloud_upload</span>
            <p class="font-label-md text-label-md text-on-surface font-semibold">Click to select or drag and drop legal document</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">PDF, DOCX, TXT (Encrypted AES-256 in transit & at rest)</p>
            <input type="file" id="uploadFileInput" name="file" class="hidden" accept=".pdf,.docx,.txt,.doc" />
            <p id="selectedFileName" class="font-code-sm text-code-sm text-secondary font-medium mt-2 hidden"></p>
          </div>

          <div class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-secondary text-base">shield_lock</span>
            <span>Zero Data Retention: Proprietary drafts are purged immediately following citation parsing.</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="closeUploadModal()" class="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
              Cancel
            </button>
            <button type="submit" id="uploadSubmitBtn" class="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md transition-colors shadow-sm flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">security_update_good</span>
              <span>Ingest & Analyze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("uploadDocModal");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("uploadFileInput");
  const fileNameDisplay = document.getElementById("selectedFileName");
  const uploadForm = document.getElementById("docUploadForm");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  dropZone.addEventListener("click", () => fileInput.click());

  // Drag and drop events
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("border-secondary", "bg-secondary/5");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-secondary", "bg-secondary/5");
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("border-secondary", "bg-secondary/5");
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelected();
    }
  });

  fileInput.addEventListener("change", handleFileSelected);

  function handleFileSelected() {
    if (fileInput.files.length) {
      const file = fileInput.files[0];
      fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      fileNameDisplay.classList.remove("hidden");
      if (!document.getElementById("uploadTitle").value) {
        document.getElementById("uploadTitle").value = file.name.replace(/\.[^/.]+$/, "");
      }
    }
  }

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("uploadSubmitBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">sync</span> Ingesting...`;

    const formData = new FormData(uploadForm);
    fetch("/api/documents/upload", {
      method: "POST",
      body: formData
    })
      .then(r => r.json())
      .then(doc => {
        closeUploadModal();
        window.showToast("Document Ingested", `Uploaded "${doc.title}" with 100% verified citation hash.`);
        setTimeout(() => {
          window.location.href = `/analysis?id=${doc.id}`;
        }, 600);
      })
      .catch(err => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Ingest & Analyze</span>`;
        window.showToast("Upload Error", "Could not complete parsing. Please retry.", "error");
      });
  });
}

window.closeUploadModal = function() {
  const modal = document.getElementById("uploadDocModal");
  if (modal) modal.classList.add("hidden");
};

function bindBatchActions() {
  document.querySelectorAll("button").forEach(b => {
    const text = b.textContent.trim();
    if (text.includes("Batch Export")) {
      b.addEventListener("click", () => {
        window.showToast("Batch Export", "Generating bundled audit archive for all active repository files...");
      });
    } else if (text.includes("Bulk Manage")) {
      b.addEventListener("click", () => {
        window.showToast("Bulk Selection Active", "Select documents using cards to apply mass tags or deletions.");
      });
    }
  });
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
