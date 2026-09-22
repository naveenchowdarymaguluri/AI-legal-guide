const express = require("express");
const path = require("path");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api", apiRoutes);

// View Helper
const serveView = (filename) => (req, res) => {
  res.sendFile(path.join(__dirname, "../views", filename));
};

// Web Page Routes
app.get("/", serveView("index.html"));
app.get("/auth", serveView("auth.html"));
app.get("/login", serveView("auth.html"));
app.get("/signup", serveView("auth.html"));
app.get("/dashboard", serveView("dashboard.html"));
app.get("/assistant", serveView("assistant.html"));
app.get("/ai-assistant", serveView("assistant.html"));
app.get("/documents", serveView("documents.html"));
app.get("/analysis", serveView("analysis.html"));
app.get("/document-analysis", serveView("analysis.html"));
app.get("/compare", serveView("compare.html"));
app.get("/document-comparison", serveView("compare.html"));
app.get("/research", serveView("research.html"));
app.get("/legal-research", serveView("research.html"));
app.get("/drafts", serveView("drafts.html"));
app.get("/cases", serveView("cases.html"));
app.get("/pricing", serveView("pricing.html"));
app.get("/how-it-works", serveView("how-it-works.html"));
app.get("/security", serveView("security.html"));
app.get("/security-privacy", serveView("security.html"));
app.get("/settings", serveView("settings.html"));
app.get("/states", serveView("states.html"));
app.get("/states-workspace", serveView("states.html"));

// 404 Not Found fallback
app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "../views/states.html"));
  } else {
    res.status(404).json({ error: "Endpoint not found" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`  LegalAI Platform is online at http://localhost:${PORT}`);
  console.log(`  Jurisprudence Precision Engine Active`);
  console.log("==================================================");
});
