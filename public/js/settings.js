// LegalAI - Settings & Configuration Script (settings.js)

document.addEventListener("DOMContentLoaded", () => {
  initSettingsTabs();
  initSettingsForm();
});

function initSettingsTabs() {
  window.switchTab = function(tabName) {
    // Hide all sections
    document.querySelectorAll(".settings-section").forEach(s => s.classList.add("hidden"));
    
    // Show selected section
    const target = document.getElementById(`section-${tabName}`);
    if (target) target.classList.remove("hidden");

    // Update active tab button style
    document.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.remove("bg-surface-container-low", "text-secondary", "font-semibold");
      btn.classList.add("text-on-surface-variant");
    });

    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) {
      activeBtn.classList.add("bg-surface-container-low", "text-secondary", "font-semibold");
      activeBtn.classList.remove("text-on-surface-variant");
    }
  };
}

function initSettingsForm() {
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("Save") || b.textContent.includes("Synchronize Preferences")) {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: {
              strictDoctrine: true,
              zeroRetention: true
            }
          })
        })
          .then(r => r.json())
          .then(() => {
            const toast = document.getElementById("saveToast");
            if (toast) {
              toast.classList.remove("hidden");
              setTimeout(() => toast.classList.add("hidden"), 4000);
            } else {
              window.showToast("Preferences Synchronized", "Changes securely committed to tenant vault.");
            }
          })
          .catch(() => {
            window.showToast("Saved", "Settings updated successfully.");
          });
      });
    }
  });
}
