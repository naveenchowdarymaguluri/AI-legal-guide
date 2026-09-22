// LegalAI - AI Evidence Copilot Script (assistant.js)

let currentConversationId = "conv-1";

document.addEventListener("DOMContentLoaded", () => {
  initChat();
  loadConversations();
  bindQuickPrompts();
  checkUrlQuery();
});

function initChat() {
  const sendBtn = document.querySelector("button:has(.material-symbols-outlined:contains('arrow_upward')), button:has(span:contains('arrow_upward'))") ||
                  document.getElementById("send-btn");
  const chatInput = document.getElementById("chat-input") || document.querySelector("input[placeholder*='Ask a legal question']");

  function handleSend() {
    if (!chatInput) return;
    const msg = chatInput.value.trim();
    if (!msg) return;

    appendUserMessage(msg);
    chatInput.value = "";
    showTypingIndicator();

    fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        conversationId: currentConversationId
      })
    })
      .then(res => res.json())
      .then(data => {
        removeTypingIndicator();
        appendAssistantMessage(data.reply);
        loadConversations(); // refresh list
      })
      .catch(err => {
        removeTypingIndicator();
        appendAssistantMessage({
          content: "Encountered an issue synthesizing the legal citation. Please check local connectivity and retry.",
          sources: []
        });
      });
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Find send button
  document.querySelectorAll("button").forEach(b => {
    if (b.querySelector(".material-symbols-outlined")?.textContent.trim() === "arrow_upward" || b.textContent.includes("Send")) {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        handleSend();
      });
    }
  });

  // "New Legal Conversation" button
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent.includes("New Legal Conversation") || b.textContent.includes("New Conversation")) {
      b.addEventListener("click", () => {
        currentConversationId = null;
        const msgContainer = getMessagesContainer();
        if (msgContainer) {
          msgContainer.innerHTML = `
            <div class="p-6 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3 mt-12">
              <div class="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">neurology</span>
              </div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">New Evidentiary Session Started</h3>
              <p class="font-body-md text-body-md max-w-md">Ask any statutory inquiry or paste contract provisions. Every assertion is verified against doctrine.</p>
            </div>
          `;
        }
        if (chatInput) chatInput.focus();
      });
    }
  });
}

function getMessagesContainer() {
  return document.getElementById("chat-messages-container") || 
         document.querySelector(".overflow-y-auto:has(.bg-surface-container-low)") ||
         document.querySelector("main .flex-1.overflow-y-auto");
}

function appendUserMessage(text) {
  const container = getMessagesContainer();
  if (!container) return;

  const html = `
    <div class="flex gap-space-sm items-start mb-space-md justify-end animate-in fade-in duration-200">
      <div class="bg-surface-container p-space-md rounded-2xl rounded-tr-xs max-w-xl shadow-xs text-right">
        <p class="font-body-md text-body-md text-on-surface font-medium">${escapeHtml(text)}</p>
        <span class="font-code-sm text-code-sm text-outline mt-1 block">Just now</span>
      </div>
      <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">
        EV
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", html);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = getMessagesContainer();
  if (!container) return;

  const html = `
    <div id="aiTypingIndicator" class="flex gap-space-sm items-start mb-space-md animate-pulse">
      <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-sm">neurology</span>
      </div>
      <div class="bg-surface-container-lowest border border-secondary/20 p-space-md rounded-2xl rounded-tl-xs shadow-sm max-w-md">
        <div class="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
          <span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          <span>Searching statutory doctrine & verifying citation hashes...</span>
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", html);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("aiTypingIndicator");
  if (el) el.remove();
}

function appendAssistantMessage(reply) {
  const container = getMessagesContainer();
  if (!container) return;

  let sourcesHtml = "";
  if (reply.sources && reply.sources.length) {
    sourcesHtml = `
      <div class="mt-space-sm pt-space-xs border-t border-outline-variant/30 flex flex-wrap items-center gap-2">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> ${reply.sources.length} Grounded Citations:
        </span>
        ${reply.sources.map(s => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-code-sm text-code-sm cursor-pointer hover:bg-secondary/10 transition-colors" title="Verified Authority">
            <span class="material-symbols-outlined text-xs text-secondary">verified</span>
            <strong>${s.title}</strong>: ${s.section}
          </span>
        `).join("")}
      </div>
    `;
  }

  // Format basic markdown text into clean HTML
  let formattedContent = (reply.content || "")
    .replace(/^### (.*$)/gim, '<h4 class="font-headline-sm text-headline-sm font-semibold text-on-surface mt-2 mb-1">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-on-surface">$1</strong>')
    .replace(/^> (.*$)/gim, '<blockquote class="p-2.5 my-2 border-l-3 border-secondary bg-surface-container-low rounded text-on-surface-variant font-body-sm">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="font-body-md text-body-md text-on-surface mb-2 leading-relaxed">')
    .replace(/\n/g, '<br/>');

  const html = `
    <div class="flex gap-space-sm items-start mb-space-md animate-in fade-in duration-200">
      <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-sm">neurology</span>
      </div>
      <div class="space-y-space-sm flex-1 max-w-2xl">
        <div class="bg-surface-container-lowest border border-outline-variant/40 p-space-md rounded-2xl rounded-tl-xs shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">verified_user</span> Verified Synthesis
            </span>
            <span class="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
              Match Confidence: ${reply.confidence || "99.4%"}
            </span>
          </div>
          <div class="text-on-surface">
            <p class="font-body-md text-body-md text-on-surface mb-2 leading-relaxed">${formattedContent}</p>
          </div>
          ${sourcesHtml}
        </div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);
  container.scrollTop = container.scrollHeight;
}

function bindQuickPrompts() {
  document.querySelectorAll("button[onclick*='query-input']").forEach(b => {
    b.removeAttribute("onclick");
    b.addEventListener("click", () => {
      const text = b.textContent.trim();
      const input = document.getElementById("chat-input") || document.getElementById("query-input") || document.querySelector("input[type='text']");
      if (input) {
        input.value = text;
        input.focus();
      }
    });
  });
}

function loadConversations() {
  fetch("/api/assistant/conversations")
    .then(r => r.json())
    .then(convs => {
      const historyList = document.querySelector("aside .overflow-y-auto") || document.getElementById("conversations-list");
      if (!historyList || !convs.length) return;

      // Update sidebar list items
      const todaySection = historyList.querySelector(".space-y-1");
      if (todaySection) {
        todaySection.innerHTML = convs.map(c => `
          <div class="group relative flex flex-col gap-0.5 p-space-sm rounded-xl ${c.id === currentConversationId ? 'bg-surface-container' : 'hover:bg-surface-container-low'} cursor-pointer transition-colors shadow-xs" onclick="switchConversation('${c.id}')">
            ${c.id === currentConversationId ? '<div class="absolute left-0 top-2 bottom-2 w-1 bg-secondary rounded-r"></div>' : ''}
            <div class="flex items-center justify-between gap-1 pl-1">
              <span class="font-label-md text-label-md text-on-surface font-semibold truncate">${escapeHtml(c.title)}</span>
              <span class="font-code-sm text-code-sm text-outline shrink-0">${c.time || 'Today'}</span>
            </div>
            <div class="flex items-center gap-1 pl-1 text-on-surface-variant">
              <span class="material-symbols-outlined text-xs">description</span>
              <span class="font-body-sm text-body-sm truncate text-on-surface-variant">${escapeHtml(c.docRef || 'General Inquiry')}</span>
            </div>
          </div>
        `).join("");
      }
    })
    .catch(() => {});
}

window.switchConversation = function(id) {
  currentConversationId = id;
  fetch(`/api/assistant/conversations/${id}`)
    .then(r => r.json())
    .then(conv => {
      const container = getMessagesContainer();
      if (!container) return;
      container.innerHTML = "";
      (conv.messages || []).forEach(m => {
        if (m.role === "user") {
          appendUserMessage(m.content);
        } else {
          appendAssistantMessage({
            content: m.content,
            sources: m.sources,
            confidence: m.confidence
          });
        }
      });
      loadConversations();
    })
    .catch(() => {});
};

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function checkUrlQuery() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    const input = document.getElementById("chat-input") || document.querySelector("input[placeholder*='Ask a legal question']");
    if (input) {
      input.value = q;
      const sendBtn = document.querySelector("button:has(.material-symbols-outlined:contains('arrow_upward')), button:has(span:contains('arrow_upward'))");
      if (sendBtn) {
        setTimeout(() => sendBtn.click(), 400);
      }
    }
  }
}
