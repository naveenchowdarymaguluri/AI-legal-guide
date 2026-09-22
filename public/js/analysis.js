// LegalAI - Document Analysis Workspace Script (analysis.js)

document.addEventListener("DOMContentLoaded", () => {
  initClauseInteractivity();
  initExportActions();
});

function initClauseInteractivity() {
  const clauseItems = document.querySelectorAll(".clause-item, [data-clause-id], aside .space-y-1 > div");
  const inspectorTitle = document.getElementById("inspector-clause-title");
  const inspectorText = document.getElementById("inspector-clause-text");
  const inspectorStatute = document.getElementById("inspector-statute-ref");

  clauseItems.forEach(item => {
    item.addEventListener("click", () => {
      clauseItems.forEach(c => c.classList.remove("border-secondary", "bg-surface-container"));
      item.classList.add("border-secondary", "bg-surface-container");

      const title = item.querySelector("span.font-medium, .font-semibold, h4")?.textContent;
      if (title && inspectorTitle) {
        inspectorTitle.textContent = title;
      }
    });
  });

  // Risk filter pills
  const riskPills = document.querySelectorAll("[data-risk-filter]");
  riskPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const risk = pill.getAttribute("data-risk-filter");
      riskPills.forEach(p => p.classList.remove("bg-primary", "text-on-primary"));
      pill.classList.add("bg-primary", "text-on-primary");

      document.querySelectorAll(".clause-item").forEach(c => {
        if (risk === "all" || c.getAttribute("data-risk") === risk) {
          c.style.display = "";
        } else {
          c.style.display = "none";
        }
      });
    });
  });
}

function initExportActions() {
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("Annotated PDF")) {
      b.addEventListener("click", () => {
        window.showToast("Compiling PDF", "Exporting complete evidentiary annotated brief with citation hashes...");
      });
    } else if (b.textContent.includes("Export Clauses")) {
      b.addEventListener("click", () => {
        window.showToast("Clauses Exported", "Generated CSV and JSON audit ledger of all 16 extracted clauses.");
      });
    } else if (b.textContent.includes("Ask AI")) {
      b.addEventListener("click", () => {
        window.location.href = "/assistant";
      });
    } else if (b.textContent.includes("Compare Versions")) {
      b.addEventListener("click", () => {
        window.location.href = "/compare";
      });
    }
  });
}
