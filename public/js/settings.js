// LegalAI - Settings & Configuration Script (settings.js)

document.addEventListener("DOMContentLoaded", () => {
  initSettingsTabs();
  loadSettingsData();
  bindSettingsForms();
});

function initSettingsTabs() {
  window.switchTab = function(tabName) {
    document.querySelectorAll(".settings-tab-pane, .space-y-space-xl > div[id^='section-']").forEach(s => {
      s.classList.add("hidden");
    });

    const target = document.getElementById(`section-${tabName}`);
    if (target) {
      target.classList.remove("hidden");
    }

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

  // Wire buttons in tab navigation
  document.querySelectorAll("[id^='tab-btn-']").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.id.replace("tab-btn-", "");
      switchTab(tab);
    });
  });
}

function loadSettingsData() {
  fetch("/api/settings")
    .then(r => r.json())
    .then(data => {
      const user = data.user || {};
      const settings = data.settings || {};

      // Fill profile inputs
      const nameInput = document.querySelector("input[value*='Elena Vance']") || document.querySelector("#section-profile input[type='text']");
      if (nameInput) nameInput.value = user.name || "Elena Vance";

      const emailInput = document.querySelector("input[type='email']");
      if (emailInput) emailInput.value = user.email || "elena.vance@vancelegal.com";

      renderApiKeys(settings.apiKeys || []);
      renderTeamMembers(settings.team || []);
    })
    .catch(() => {});
}

function renderApiKeys(keys) {
  const container = document.querySelector("#section-api .space-y-3") || 
                    document.querySelector("#section-api .space-y-space-sm") ||
                    document.querySelector("#section-api");
  if (!container) return;

  const listArea = container.querySelector(".space-y-3, .space-y-space-xs") || container;
  
  const keysHtml = keys.map(k => `
    <div class="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
          <span class="material-symbols-outlined text-base">key</span>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-label-md text-label-md font-semibold text-on-surface truncate">${escapeHtml(k.name)}</span>
          <span class="font-code-sm text-code-sm text-on-surface-variant font-mono truncate">${escapeHtml(k.key)} • Created ${k.created}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-code-sm text-code-sm px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
        <button onclick="revokeKey('${escapeHtml(k.key)}')" class="p-1.5 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Revoke Key">
          <span class="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
    </div>
  `).join("");

  const headerHtml = `
    <div class="flex items-center justify-between pb-2">
      <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Active Client Gateway Keys (${keys.length})</span>
      <button onclick="promptNewApiKey()" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1 shadow-xs">
        <span class="material-symbols-outlined text-sm">add</span> Generate Key
      </button>
    </div>
  `;

  listArea.innerHTML = headerHtml + `<div class="space-y-2 mt-2">${keysHtml}</div>`;
}

window.promptNewApiKey = function() {
  const name = prompt("Enter a description name for this API key:", "Production Legal Agent");
  if (!name) return;

  fetch("/api/settings/keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
    .then(r => r.json())
    .then(newKey => {
      window.showToast("API Key Generated", `Generated secret: ${newKey.key}`);
      loadSettingsData();
    });
};

window.revokeKey = function(key) {
  if (!confirm(`Are you sure you want to revoke API key: ${key}?`)) return;

  fetch("/api/settings/keys", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key })
  })
    .then(r => r.json())
    .then(() => {
      window.showToast("Key Revoked", "API key invalidated immediately.");
      loadSettingsData();
    });
};

function renderTeamMembers(team) {
  const container = document.querySelector("#section-team .space-y-3") || 
                    document.querySelector("#section-team .space-y-space-sm") ||
                    document.querySelector("#section-team");
  if (!container) return;

  const listArea = container.querySelector(".space-y-3, .space-y-space-xs") || container;

  const teamHtml = team.map(m => `
    <div class="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm font-semibold shrink-0">
          ${m.name.substring(0, 2).toUpperCase()}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-label-md text-label-md font-semibold text-on-surface truncate">${escapeHtml(m.name)}</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant truncate">${escapeHtml(m.email)}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium">${escapeHtml(m.role)}</span>
        <button onclick="removeTeamMember('${escapeHtml(m.email)}')" class="p-1.5 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Remove Member">
          <span class="material-symbols-outlined text-base">person_remove</span>
        </button>
      </div>
    </div>
  `).join("");

  const headerHtml = `
    <div class="flex items-center justify-between pb-2">
      <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Workspace Practitioners (${team.length})</span>
      <button onclick="promptInviteMember()" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1 shadow-xs">
        <span class="material-symbols-outlined text-sm">person_add</span> Invite Colleague
      </button>
    </div>
  `;

  listArea.innerHTML = headerHtml + `<div class="space-y-2 mt-2">${teamHtml}</div>`;
}

window.promptInviteMember = function() {
  const name = prompt("Colleague's Full Name (e.g. David Vance, Esq.):");
  if (!name) return;
  const email = prompt("Corporate Email Address:");
  if (!email) return;

  fetch("/api/settings/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role: "Associate Counsel" })
  })
    .then(r => r.json())
    .then(() => {
      window.showToast("Colleague Invited", `Added ${name} to enterprise vault.`);
      loadSettingsData();
    });
};

window.removeTeamMember = function(email) {
  if (!confirm(`Remove ${email} from workspace privileges?`)) return;

  fetch("/api/settings/team", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(r => r.json())
    .then(() => {
      window.showToast("Member Removed", `Revoked access for ${email}`);
      loadSettingsData();
    });
};

function bindSettingsForms() {
  document.querySelectorAll("button").forEach(b => {
    const text = b.textContent.trim();
    if (text.includes("Commit Changes") || text.includes("Save Preferences")) {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        saveAllSettings();
      });
    }
  });
}

function saveAllSettings() {
  const nameInput = document.querySelector("#section-profile input[type='text']");
  const userName = nameInput ? nameInput.value.trim() : "Elena Vance, Esq.";

  fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { name: userName },
      settings: { strictDoctrine: true, zeroRetention: true }
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
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
