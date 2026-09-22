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

router.post("/assistant/chat", (req, res) => {
  const { message, conversationId, documentId } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  let docContext = null;
  if (documentId) {
    docContext = storage.getDocumentById(documentId);
  }

  const aiReply = aiEngine.generateResponse(message, docContext);

  let convId = conversationId;
  let conv = convId ? storage.getConversationById(convId) : null;

  const userMsg = {
    id: "m-" + Date.now() + "-u",
    role: "user",
    content: message,
    timestamp: new Date().toISOString()
  };

  const assistantMsg = {
    id: "m-" + Date.now() + "-a",
    role: "assistant",
    content: aiReply.text,
    sources: aiReply.sources,
    confidence: aiReply.confidence,
    timestamp: new Date().toISOString()
  };

  if (!conv) {
    conv = {
      id: "conv-" + Date.now(),
      title: message.length > 35 ? message.substring(0, 35) + "..." : message,
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
    reply: assistantMsg
  });
});

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
router.get("/compare", (req, res) => {
  const { a, b } = req.query;
  const comparison = diffEngine.compareDocuments(a, b);
  res.json(comparison);
});

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
  const { templateId, variables } = req.body;
  const templates = storage.getDraftTemplates();
  const tpl = templates.find(t => t.id === templateId) || templates[0];

  let body = tpl.body;
  const vars = variables || {};

  // Standard substitutions
  body = body.replace(/\[CURRENT_DATE\]/g, vars.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  body = body.replace(/\[RECIPIENT_NAME\]/g, vars.recipientName || "Alexander Wright");
  body = body.replace(/\[RECIPIENT_TITLE\]/g, vars.recipientTitle || "Chief Technology Officer");
  body = body.replace(/\[COMPANY_NAME\]/g, vars.companyName || "TechCorp Enterprises Inc.");
  body = body.replace(/\[COMPANY_ADDRESS\]/g, vars.companyAddress || "100 Montgomery St, Suite 1800, San Francisco, CA 94104");
  body = body.replace(/\[SECTION_NUMBER, e\.g\. 8\.2\]/g, vars.section || "8.2");
  body = body.replace(/\[SECTION_NUMBER\]/g, vars.section || "8.2");
  body = body.replace(/\[AGREEMENT_DATE\]/g, vars.agreementDate || "January 15, 2024");
  body = body.replace(/\[EFFECTIVE_DATE\]/g, vars.effectiveDate || "October 22, 2026");
  body = body.replace(/\[SENDER_NAME\]/g, vars.senderName || storage.getUser().name);
  body = body.replace(/\[SENDER_TITLE\]/g, vars.senderTitle || storage.getUser().role);

  res.json({
    templateId: tpl.id,
    title: tpl.title,
    category: tpl.category,
    draftText: body,
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
  const { text, done, taskId } = req.body;
  const c = storage.getCaseById(req.params.id);
  if (!c) return res.status(404).json({ error: "Case not found" });

  if (taskId) {
    const task = c.tasks.find(t => t.id === taskId);
    if (task) {
      if (done !== undefined) task.done = done;
      if (text) task.text = text;
      storage.updateCase(c.id, { tasks: c.tasks });
    }
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

module.exports = router;
