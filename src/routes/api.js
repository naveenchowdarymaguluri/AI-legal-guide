const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = require("../services/storage");
const aiEngine = require("../services/aiEngine");
const diffEngine = require("../services/diffEngine");

const router = express.Router();

// Multer upload config
const uploadDir = path.join(__dirname, "../../data/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// System Telemetry & Status
router.get("/system/status", (req, res) => {
  res.json({
    online: true,
    status: "operational",
    engine: "Legal Citation Engine v2.4 (Strict Doctrine)",
    latencyMs: Math.floor(Math.random() * 40) + 110,
    model: "MODEL v4.3-REASON",
    jurisdictionsActive: 5,
    compliance: {
      soc2: "Type II Certified",
      zeroRetention: "Active",
      dataEncryption: "AES-256-GCM / TLS 1.3"
    },
    uptime: process.uptime()
  });
});

// Authentication & Session
router.get("/auth/session", (req, res) => {
  res.json({
    user: storage.getUser(),
    authenticated: true
  });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = storage.getUser();
  res.json({
    success: true,
    user: { ...user, email: email || user.email },
    token: "jwt_token_sample_lex_verified_" + Date.now()
  });
});

// AI Assistant & Chat
router.get("/assistant/conversations", (req, res) => {
  res.json(storage.getConversations());
});

router.get("/assistant/conversations/:id", (req, res) => {
  const conv = storage.getConversationById(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });
  res.json(conv);
});

const handleAssistantChat = (req, res) => {
  const query = req.body.message || req.body.query || req.body.text || "";
  const conversationId = req.body.conversationId;
  const documentId = req.body.documentId;
  if (!query) return res.status(400).json({ error: "Message or query is required" });

  let docContext = null;
  if (documentId) {
    docContext = storage.getDocumentById(documentId);
  }

  const aiReply = aiEngine.generateResponse(query, docContext);

  let convId = conversationId;
  let conv = convId ? storage.getConversationById(convId) : null;

  const userMsg = {
    id: "m-" + Date.now() + "-u",
    role: "user",
    content: query,
    text: query,
    timestamp: new Date().toISOString()
  };

  const assistantMsg = {
    id: "m-" + Date.now() + "-a",
    role: "assistant",
    content: aiReply.text,
    text: aiReply.text,
    sources: aiReply.sources,
    confidence: aiReply.confidence,
    timestamp: new Date().toISOString()
  };

  if (!conv) {
    conv = {
      id: "conv-" + Date.now(),
      title: query.length > 35 ? query.substring(0, 35) + "..." : query,
      time: "Just now",
      docRef: docContext ? docContext.title : "Direct Inquiry",
      messages: [userMsg, assistantMsg]
    };
    storage.addConversation(conv);
  } else {
    storage.appendMessageToConversation(conv.id, userMsg);
    storage.appendMessageToConversation(conv.id, assistantMsg);
  }

  res.json({
    conversationId: conv.id,
    userMessage: userMsg,
    reply: assistantMsg,
    message: assistantMsg
  });
};

router.post("/assistant/chat", handleAssistantChat);
router.post("/assistant/message", handleAssistantChat);

// Document Management
router.get("/documents", (req, res) => {
  const { search, status, type } = req.query;
  let docs = storage.getDocuments();

  if (search) {
    const s = search.toLowerCase();
    docs = docs.filter(d => d.title.toLowerCase().includes(s) || d.type.toLowerCase().includes(s));
  }
  if (status) {
    docs = docs.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }
  if (type) {
    docs = docs.filter(d => d.type.toLowerCase() === type.toLowerCase());
  }

  res.json({
    total: docs.length,
    documents: docs
  });
});

router.get("/documents/:id", (req, res) => {
  const doc = storage.getDocumentById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  res.json(doc);
});

router.post("/documents/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const { title, type } = req.body;
  const filename = file ? file.originalname : (title ? title + ".pdf" : "Legal_Document.pdf");
  const buffer = file ? fs.readFileSync(file.path) : Buffer.from(filename);

  const parsed = aiEngine.parseDocumentText(filename, buffer);

  const newDoc = {
    id: "doc-" + Date.now(),
    title: title || filename.replace(/\.[^/.]+$/, ""),
    filename,
    type: type || "Executive Contract",
    pages: parsed.pages,
    size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB",
    uploadedAt: new Date().toISOString(),
    status: "Analyzed",
    hash: parsed.hash,
    riskScore: parsed.riskScore,
    clausesCount: parsed.clausesCount,
    highRisks: parsed.highRisks,
    clauses: parsed.clauses
  };

  storage.addDocument(newDoc);
  res.status(201).json(newDoc);
});

router.delete("/documents/:id", (req, res) => {
  const success = storage.deleteDocument(req.params.id);
  res.json({ success });
});

// Document Analysis Workspace
router.get("/analysis/:id", (req, res) => {
  const doc = storage.getDocumentById(req.params.id) || storage.getDocuments()[0];
  if (!doc) return res.status(404).json({ error: "No document found for analysis" });
  res.json(doc);
});

// Document Comparison
const handleCompare = (req, res) => {
  const a = req.query.a || req.query.docA || req.body?.a || req.body?.docA || "doc-1";
  const b = req.query.b || req.query.docB || req.body?.b || req.body?.docB || "doc-2";
  const comparison = diffEngine.compareDocuments(a, b);
  res.json({
    ...comparison,
    diff: comparison.diffClauses
  });
};

router.get("/compare", handleCompare);
router.post("/compare", handleCompare);

// Legal Research LexSearch
router.get("/research", (req, res) => {
  const { q, jurisdiction } = req.query;
  const items = storage.getResearchItems(q, jurisdiction);
  res.json({
    query: q || "",
    jurisdiction: jurisdiction || "All",
    total: items.length,
    results: items
  });
});

// Draft Assistant
router.get("/drafts/templates", (req, res) => {
  res.json(storage.getDraftTemplates());
});

router.post("/drafts/generate", (req, res) => {
  const { templateId } = req.body;
  const vars = req.body.variables || req.body.params || {};
  const templates = storage.getDraftTemplates();
  const tpl = templates.find(t => t.id === templateId) || templates[0];

  let body = tpl.body;

  // Standard substitutions
  body = body.replace(/\[CURRENT_DATE\]/g, vars.date || vars.effectiveDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  body = body.replace(/\[RECIPIENT_NAME\]/g, vars.recipientName || vars.clientName || "Alexander Wright");
  body = body.replace(/\[RECIPIENT_TITLE\]/g, vars.recipientTitle || "Chief Technology Officer");
  body = body.replace(/\[COMPANY_NAME\]/g, vars.companyName || vars.counterparty || "TechCorp Enterprises Inc.");
  body = body.replace(/\[COMPANY_ADDRESS\]/g, vars.companyAddress || "100 Montgomery St, Suite 1800, San Francisco, CA 94104");
  body = body.replace(/\[SECTION_NUMBER, e\.g\. 8\.2\]/g, vars.section || "8.2");
  body = body.replace(/\[SECTION_NUMBER\]/g, vars.section || "8.2");
  body = body.replace(/\[AGREEMENT_DATE\]/g, vars.agreementDate || "January 15, 2024");
  body = body.replace(/\[EFFECTIVE_DATE\]/g, vars.effectiveDate || "October 22, 2026");
  body = body.replace(/\[SENDER_NAME\]/g, vars.senderName || vars.clientName || storage.getUser().name);
  body = body.replace(/\[SENDER_TITLE\]/g, vars.senderTitle || storage.getUser().role);

  // Custom key substitutions if present
  Object.keys(vars).forEach(k => {
    const rx = new RegExp(`\\[${k}\\]`, "gi");
    body = body.replace(rx, vars[k]);
  });

  res.json({
    templateId: tpl.id,
    title: tpl.title,
    category: tpl.category,
    draftText: body,
    draft: {
      content: body,
      text: body,
      title: tpl.title
    },
    generatedAt: new Date().toISOString(),
    citationAuthority: "Grounded in Cal. Labor Code § 2922 & Model Rules of Professional Conduct"
  });
});

// Case Management
router.get("/cases", (req, res) => {
  res.json(storage.getCases());
});

router.get("/cases/:id", (req, res) => {
  const c = storage.getCaseById(req.params.id);
  if (!c) return res.status(404).json({ error: "Case not found" });
  res.json(c);
});

router.post("/cases", (req, res) => {
  const { title, docket, client, jurisdiction, category, leadCounsel, summary, nextDeadline } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const newCase = {
    id: "case-" + Date.now(),
    title,
    docket: docket || `MATTER-${Math.floor(1000 + Math.random() * 9000)}`,
    client: client || "Client Confidential",
    category: category || "Information Gathering",
    status: "Active",
    jurisdiction: jurisdiction || "California Superior Court",
    leadCounsel: leadCounsel || storage.getUser().name,
    opposingCounsel: "Opposing Advisory LLP",
    nextDeadline: nextDeadline || "2026-11-01",
    deadlineLabel: "Initial Case Management Statement",
    summary: summary || "Matter opened for legal review and compliance auditing.",
    trackedDocsCount: 1,
    tasks: [
      { id: "t-" + Date.now(), text: "Review operative agreement clauses", done: false }
    ]
  };

  storage.addCase(newCase);
  res.status(201).json(newCase);
});

router.post("/cases/:id/tasks", (req, res) => {
  const { text, done, completed, taskId, milestoneIndex, taskIndex } = req.body;
  const isDone = done !== undefined ? done : completed;
  const c = storage.getCaseById(req.params.id);
  if (!c) return res.status(404).json({ error: "Case not found" });

  if (taskId) {
    const task = c.tasks.find(t => t.id === taskId);
    if (task) {
      if (isDone !== undefined) task.done = isDone;
      if (text) task.text = text;
      storage.updateCase(c.id, { tasks: c.tasks });
    }
  } else if (taskIndex !== undefined && Array.isArray(c.tasks) && c.tasks[taskIndex]) {
    if (isDone !== undefined) c.tasks[taskIndex].done = isDone;
    storage.updateCase(c.id, { tasks: c.tasks });
  } else if (text) {
    c.tasks.push({
      id: "t-" + Date.now(),
      text,
      done: false
    });
    storage.updateCase(c.id, { tasks: c.tasks });
  }

  res.json(c);
});

router.delete("/cases/:id", (req, res) => {
  const success = storage.deleteCase(req.params.id);
  res.json({ success });
});

router.get("/documents/:id/download", (req, res) => {
  const doc = storage.getDocumentById(req.params.id);
  if (!doc) return res.status(404).send("Document not found");
  
  // Return clean text extract
  const clausesText = (doc.clauses || []).map(c => `${c.section}: ${c.title}\n${c.text}\n[Risk: ${c.risk} - ${c.statuteRef}]`).join("\n\n");
  const content = `LEGALAI PLATFORM - CERTIFIED DOCUMENT EXTRACT\nTitle: ${doc.title}\nHash: ${doc.hash}\nUploaded: ${doc.uploadedAt}\n\n=== CLAUSES ===\n\n${clausesText}`;
  
  res.setHeader("Content-Disposition", `attachment; filename="${doc.filename || doc.title + '.txt'}"`);
  res.setHeader("Content-Type", "text/plain");
  res.send(content);
});

// Settings & Preferences
router.get("/settings", (req, res) => {
  res.json({
    user: storage.getUser(),
    settings: storage.getSettings()
  });
});

router.post("/settings", (req, res) => {
  const { user, settings } = req.body;
  let updatedUser = null;
  let updatedSettings = null;

  if (user) {
    updatedUser = storage.updateUser(user);
  }
  if (settings) {
    updatedSettings = storage.updateSettings(settings);
  }

  res.json({
    success: true,
    user: updatedUser || storage.getUser(),
    settings: updatedSettings || storage.getSettings()
  });
});

router.post("/settings/keys", (req, res) => {
  const { name } = req.body;
  const newKey = storage.addApiKey(name);
  res.status(201).json({
    ...newKey,
    id: newKey.key,
    secret: newKey.key
  });
});

const handleDeleteKey = (req, res) => {
  const key = req.params.id || req.params.key || req.body?.key || req.body?.id;
  const success = storage.revokeApiKey(key);
  res.json({ success });
};
router.delete("/settings/keys/:id", handleDeleteKey);
router.delete("/settings/keys", handleDeleteKey);

router.post("/settings/team", (req, res) => {
  const { name, email, role } = req.body;
  const newMember = storage.addTeamMember({ name, email, role });
  res.status(201).json({
    ...newMember,
    id: newMember.email
  });
});

const handleDeleteTeam = (req, res) => {
  const email = req.params.email || req.params.id || req.body?.email || req.body?.id;
  const success = storage.removeTeamMember(email);
  res.json({ success });
};
router.delete("/settings/team/:id", handleDeleteTeam);
router.delete("/settings/team", handleDeleteTeam);

module.exports = router;
