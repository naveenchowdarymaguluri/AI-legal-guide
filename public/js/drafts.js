// LegalAI - Draft Assistant Script (drafts.js)

document.addEventListener("DOMContentLoaded", () => {
  const regenBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Regenerate Draft"));
  const copyBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Copy") || b.querySelector(".material-symbols-outlined")?.textContent.includes("content_copy"));

  // Document category cards
  document.querySelectorAll(".grid.grid-cols-2 > button, .grid.grid-cols-2 > div").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".grid.grid-cols-2 > button, .grid.grid-cols-2 > div").forEach(c => {
        c.classList.remove("ring-2", "ring-secondary");
      });
      card.classList.add("ring-2", "ring-secondary");
      const title = card.querySelector(".font-headline-sm, .font-semibold")?.textContent.trim();
      window.showToast("Template Selected", `Loaded template classification: ${title}`);
    });
  });

  if (regenBtn) {
    regenBtn.addEventListener("click", () => {
      regenBtn.disabled = true;
      regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span><span>Synthesizing...</span>`;
      
      fetch("/api/drafts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: "tpl-1",
          variables: {
            recipientName: "Alexander Vance",
            companyName: "TechCorp Global Corp"
          }
        })
      })
        .then(r => r.json())
        .then(data => {
          regenBtn.disabled = false;
          regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg">auto_awesome</span><span>Regenerate Draft</span>`;
          window.showToast("Draft Regenerated", "Updated contractual draft clauses grounded in statutory doctrine.");
        })
        .catch(() => {
          regenBtn.disabled = false;
          regenBtn.innerHTML = `<span class="material-symbols-outlined text-lg">auto_awesome</span><span>Regenerate Draft</span>`;
        });
    });
  }

  // Version history button
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("Version History")) {
      b.addEventListener("click", () => {
        window.showToast("Version Timeline", "Displaying version commits: v1.0 (Draft), v2.1 (Counsel review), v3.0 (Active).");
      });
    }
  });
});
