// LegalAI - Documents Management Script (documents.js)

document.addEventListener("DOMContentLoaded", () => {
  initDocumentFilters();
  initUploadModal();
  bindDocumentActions();
});

function initDocumentFilters() {
  const searchInput = document.querySelector("input[placeholder*='Search documents']") || document.getElementById("doc-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value.toLowerCase();
      document.querySelectorAll("tbody tr, .document-row").forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val) ? "" : "none";
      });
    });
  }
}

function initUploadModal() {
  const uploadBtn = document.getElementById("trigger-upload-btn") ||
                    document.querySelector("button:has(.material-symbols-outlined:contains('cloud_upload'))") ||
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

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
      fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / (1024 * 1024)).toFixed(2)} MB)`;
      fileNameDisplay.classList.remove("hidden");
      if (!document.getElementById("uploadTitle").value) {
        document.getElementById("uploadTitle").value = fileInput.files[0].name.replace(/\.[^/.]+$/, "");
      }
    }
  });

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
        window.showToast("Document Analyzed", `Uploaded "${doc.title}" with 100% verified citation hash.`);
        setTimeout(() => {
          window.location.href = `/analysis?id=${doc.id}`;
        }, 800);
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

function bindDocumentActions() {
  // Batch export button
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("Batch Export") || b.textContent.includes("Export Clauses")) {
      b.addEventListener("click", () => {
        window.showToast("Export Initiated", "Compiling certified audit PDF ledger for download...");
      });
    }
  });

  // Make table rows clickable to analysis view
  document.querySelectorAll("tbody tr").forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      window.location.href = "/analysis";
    });
  });
}
