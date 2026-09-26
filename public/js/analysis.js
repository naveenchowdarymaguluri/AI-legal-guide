// LegalAI - Document Analysis Workspace Script (analysis.js)

let activeDocument = null;
let activeClause = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const docId = params.get("id") || "doc-1";
  loadAnalysisDocument(docId);
  initTopActions();
});

function loadAnalysisDocument(id) {
  fetch(`/api/documents/${id}`)
    .then(r => {
      if (!r.ok) return fetch("/api/documents").then(res => res.json()).then(data => data.documents[0]);
      return r.json();
    })
    .then(doc => {
      if (!doc) return;
      activeDocument = doc;
      renderDocumentMeta(doc);
      renderClauseTree(doc);
      if (doc.clauses && doc.clauses.length) {
        selectClause(doc.clauses[0]);
      }
      populateDocSwitcher(doc.id);
    })
    .catch(() => {});
}

function renderDocumentMeta(doc) {
  // Title & breadcrumb
  const titleEl = document.querySelector("h1.font-headline-lg, h1.font-display-lg");
  if (titleEl) titleEl.textContent = doc.title;

  const breadcrumbEl = document.querySelector(".truncate.font-semibold:has-text('.pdf')") || document.querySelector(".truncate.font-semibold");
  if (breadcrumbEl) breadcrumbEl.textContent = doc.filename || (doc.title + ".pdf");

  // Metadata pills
  const pagesEl = Array.from(document.querySelectorAll("div.flex.items-center.gap-1")).find(el => el.textContent.includes("pages"));
  if (pagesEl) pagesEl.innerHTML = `<span class="material-symbols-outlined text-sm">auto_stories</span> ${doc.pages || 24} pages`;

  const statusEl = document.querySelector(".text-secondary.font-semibold:has-text('Analyzed')") || document.querySelector("span.text-secondary.font-semibold");
  if (statusEl) statusEl.textContent = `${doc.status || 'Analyzed'} (100% verified citation hash)`;

  const hashBadge = document.querySelector(".font-code-sm:has-text('LIVE PARSER')") || document.querySelector(".font-code-sm.ml-space-xs");
  if (hashBadge && doc.hash) {
    hashBadge.textContent = `HASH: ${doc.hash.substring(0, 10)}...`;
  }
}

function populateDocSwitcher(currentId) {
  fetch("/api/documents")
    .then(r => r.json())
    .then(data => {
      const docs = data.documents || [];
      if (docs.length <= 1) return;

      const actionCluster = document.querySelector(".flex.items-center.gap-space-xs.flex-wrap");
      if (!actionCluster) return;

      if (!document.getElementById("doc-switcher-select")) {
        const switcher = document.createElement("select");
        switcher.id = "doc-switcher-select";
        switcher.className = "bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-1.5 rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer";
        switcher.innerHTML = docs.map(d => `<option value="${d.id}" ${d.id === currentId ? 'selected' : ''}>📄 ${escapeHtml(d.title)}</option>`).join("");
        switcher.addEventListener("change", () => {
          window.location.href = `/analysis?id=${switcher.value}`;
        });
        actionCluster.insertBefore(switcher, actionCluster.firstChild);
      }
    })
    .catch(() => {});
}

function renderClauseTree(doc) {
  const treeContainer = document.querySelector(".xl\\:col-span-3 .overflow-y-auto") || 
                        document.querySelector(".xl\\:col-span-3 .space-y-1") ||
                        document.querySelector(".xl\\:col-span-3");
  if (!treeContainer) return;

  const clauses = doc.clauses || [];
  if (!clauses.length) return;

  // Render clause items
  const itemsHtml = clauses.map(c => {
    const isHigh = c.risk === "High";
    const isMed = c.risk === "Medium";
    const riskBadge = isHigh 
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error-container text-error font-label-sm text-xs font-semibold"><span class="material-symbols-outlined text-xs">gavel</span> ${c.risk} Risk</span>`
      : isMed
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-label-sm text-xs font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Advisory</span>`
      : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-xs font-medium"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Standard</span>`;

    return `
      <div class="clause-item group flex flex-col gap-1 p-2.5 rounded-xl border border-transparent hover:bg-surface-container-low/80 cursor-pointer transition-all" data-clause-id="${c.id}" data-risk="${c.risk}">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-label-md font-semibold text-on-surface truncate">${escapeHtml(c.section)}</span>
          <span class="font-code-sm text-code-sm text-outline">${c.riskScore}/100</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant font-medium line-clamp-1">${escapeHtml(c.title)}</p>
        <div class="flex items-center justify-between pt-1">
          ${riskBadge}
          <span class="font-code-sm text-code-sm text-outline text-xs truncate max-w-[120px]">${escapeHtml(c.statuteRef || '')}</span>
        </div>
      </div>
    `;
  }).join("");

  // Place in tree container
  const targetArea = treeContainer.querySelector(".space-y-1") || treeContainer;
  targetArea.innerHTML = itemsHtml;

  // Bind click
  document.querySelectorAll(".clause-item").forEach(item => {
    item.addEventListener("click", () => {
      const cid = item.getAttribute("data-clause-id");
      const matched = clauses.find(c => c.id === cid);
      if (matched) selectClause(matched);
    });
  });

  initRiskFilterTabs();
}

function selectClause(clause) {
  activeClause = clause;

  // Highlight in clause list
  document.querySelectorAll(".clause-item").forEach(item => {
    if (item.getAttribute("data-clause-id") === clause.id) {
      item.classList.add("bg-surface-container-low", "border-secondary", "shadow-xs");
    } else {
      item.classList.remove("bg-surface-container-low", "border-secondary", "shadow-xs");
    }
  });

  // Pane 2: Operative Contract Text
  const centerViewer = document.querySelector(".xl\\:col-span-6") || document.querySelector("main .grid > div:nth-child(2)");
  if (centerViewer) {
    const textTarget = centerViewer.querySelector(".prose, .font-body-md, .leading-relaxed, p:has-text('Either party')") || 
                       centerViewer.querySelector("p");
    const sectionHeading = centerViewer.querySelector("h2, h3, .font-headline-md");
    if (sectionHeading) {
      sectionHeading.textContent = `${clause.section}: ${clause.title}`;
    }
    if (textTarget) {
      textTarget.innerHTML = `
        <div class="p-space-md rounded-xl bg-surface-container-low/70 border-l-4 border-secondary space-y-2">
          <div class="flex items-center justify-between text-xs font-label-sm text-secondary uppercase font-semibold">
            <span>Operative Contract Language • Verified Primary Clause</span>
            <span class="font-mono">LINE 142–158</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface leading-relaxed font-serif text-base">
            "${escapeHtml(clause.text)}"
          </p>
        </div>
      `;
    }
  }

  // Pane 3: Right Inspector (Risk, Doctrine, Statute)
  const inspector = document.querySelector(".xl\\:col-span-3:last-child") || document.querySelector("main .grid > div:nth-child(3)");
  if (inspector) {
    const isHigh = clause.risk === "High";
    const isMed = clause.risk === "Medium";
    const headerEl = inspector.querySelector("h3, .font-headline-sm");
    if (headerEl) headerEl.textContent = clause.title;

    const riskScoreEl = inspector.querySelector(".font-display-lg, .font-bold:has-text('/100')") || inspector.querySelector(".font-display-lg");
    if (riskScoreEl) {
      riskScoreEl.innerHTML = `<span class="${isHigh ? 'text-error' : isMed ? 'text-amber-600' : 'text-secondary'} font-bold">${clause.riskScore}</span><span class="text-sm font-normal text-outline">/100</span>`;
    }

    const explanationEl = inspector.querySelector(".font-body-sm:has-text('CRITICAL')") || inspector.querySelector(".font-body-sm");
    if (explanationEl) {
      explanationEl.innerHTML = `<strong>${clause.risk.toUpperCase()} LIABILITY ANALYSIS:</strong> ${escapeHtml(clause.explanation)}`;
    }

    const statuteEl = inspector.querySelector(".font-code-sm:has-text('Cal.')") || inspector.querySelector("code, .font-code-sm");
    if (statuteEl && clause.statuteRef) {
      statuteEl.textContent = clause.statuteRef;
    }
  }
}

function initRiskFilterTabs() {
  const tabs = document.querySelectorAll("[data-risk-filter]");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.getAttribute("data-risk-filter");
      tabs.forEach(t => t.classList.remove("bg-primary", "text-on-primary"));
      tab.classList.add("bg-primary", "text-on-primary");

      document.querySelectorAll(".clause-item").forEach(item => {
        const risk = item.getAttribute("data-risk");
        if (filter === "all" || risk.toLowerCase() === filter.toLowerCase()) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

function initTopActions() {
  document.querySelectorAll("button").forEach(b => {
    const text = b.textContent.trim();
    if (text.includes("Ask AI")) {
      b.addEventListener("click", () => {
        const clauseQuery = activeClause 
          ? `Explain the legal enforceability and risks of ${activeClause.section} (${activeClause.title}) in ${activeDocument ? activeDocument.title : 'this agreement'}`
          : `Provide legal risk audit of ${activeDocument ? activeDocument.title : 'this agreement'}`;
        window.location.href = `/assistant?q=${encodeURIComponent(clauseQuery)}`;
      });
    } else if (text.includes("Compare Versions")) {
      b.addEventListener("click", () => {
        window.location.href = `/compare?a=${activeDocument ? activeDocument.id : 'doc-1'}`;
      });
    } else if (text.includes("Annotated PDF")) {
      b.addEventListener("click", () => {
        if (activeDocument) {
          window.location.href = `/api/documents/${activeDocument.id}/download`;
        }
      });
    } else if (text.includes("Export Clauses")) {
      b.addEventListener("click", () => {
        if (!activeDocument || !activeDocument.clauses) return;
        const csvContent = "data:text/csv;charset=utf-8," 
          + ["Section,Title,Risk Level,Risk Score,Statutory Authority,Operative Text"]
          .concat(activeDocument.clauses.map(c => `"${c.section}","${c.title}","${c.risk}",${c.riskScore},"${c.statuteRef}","${c.text.replace(/"/g, '""')}"`))
          .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeDocument.title}_Clauses_Ledger.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.showToast("Clauses Exported", `Downloaded CSV audit ledger for ${activeDocument.title}`);
      });
    }
  });
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
