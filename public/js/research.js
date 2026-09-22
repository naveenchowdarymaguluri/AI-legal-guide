// LegalAI - Legal Research LexSearch Script (research.js)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input") || document.querySelector("input[placeholder*='researching']");
  const execBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Execute Search"));

  function runSearch() {
    const q = searchInput ? searchInput.value.trim() : "";
    window.showToast("Searching Doctrine", `Querying verified federal, state and statutory codes for: "${q}"...`);
    
    // Smooth filter cards
    document.querySelectorAll("article, .research-card, .border-b.pb-space-lg").forEach(card => {
      card.classList.add("opacity-60");
      setTimeout(() => card.classList.remove("opacity-60"), 350);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });
  }

  if (execBtn) {
    execBtn.addEventListener("click", (e) => {
      e.preventDefault();
      runSearch();
    });
  }

  // Jurisdiction pills filter
  document.querySelectorAll(".flex.items-center.flex-wrap.gap-space-xs > div").forEach(pill => {
    pill.style.cursor = "pointer";
    pill.addEventListener("click", () => {
      const text = pill.textContent.trim();
      window.showToast("Facet Filter Applied", `Jurisdiction set to: ${text}`);
    });
  });
});
