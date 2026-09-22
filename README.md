# LegalAI Web Platform

A full-stack, enterprise-grade Legal AI Platform built with **Node.js** and **Express**, adhering strictly to the **Jurisprudence Precision** design system exported from Google Stitch.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js (v20+ LTS installed)
- npm (v10+)

### 2. Start the Application
```bash
npm start
```
The application will launch immediately at:
👉 **`http://localhost:3000`**

To run in development watch mode:
```bash
npm run dev
```

---

## 🏛️ Application Architecture & Page Map

| Route | Page Name | Primary Features & Purpose |
|---|---|---|
| `/` | **Landing Page** | Value proposition, Live Evidence Copilot preview, SOC-2 badges, trust metrics, pricing overview. |
| `/auth` | **Authentication** | Sign in, Sign up, SSO / SAML authentication with enterprise vault verification. |
| `/dashboard` | **Executive Dashboard** | Direct Synthesis Canvas, quick legal prompts, active matters summary, recent files, telemetry. |
| `/assistant` | **AI Evidence Copilot** | Multi-turn chat grounded in statutory doctrine, verified citation tags, confidence metrics, conversation history. |
| `/documents` | **Documents Repository** | Drag-and-drop file upload, clause extraction, status filters, SHA-256 citation hashes. |
| `/analysis` | **Document Analysis** | Clause-by-clause tree inspection, risk heatmaps, high-liability flag detection, annotated PDF export. |
| `/compare` | **Document Comparison** | Side-by-side contract diffing, emerald additions, ruby deletions, rationale notes, fullscreen view. |
| `/research` | **Legal Research (LexSearch)** | Multi-jurisdiction search across California, Delaware, Federal & Indian law, Shepardize doctrine. |
| `/drafts` | **Draft Assistant** | Clause generation, template customization (Termination Notice, NDA, Cease & Desist), version history. |
| `/cases` | **Cases & Dockets** | Litigation and corporate matters tracker, milestone task checklists, deadlines, court forums. |
| `/pricing` | **Pricing** | Solo Practitioner, Boutique Firm, and Enterprise Counsel subscription tiers. |
| `/how-it-works` | **How It Works** | RAG pipeline architecture, zero data retention, and vector citation hashing. |
| `/security` | **Security & Privacy** | SOC-2 Type II certification, client-attorney privilege compliance, AES-256-GCM encryption. |
| `/settings` | **Workspace Settings** | Model version selector, Strict Doctrine mode toggle, API keys, team member permissions. |
| `/states` | **UX System States** | Empty states, loading skeletons, error recovery fallbacks, and epistemic boundary safeguards. |

---

## ⚙️ Interactive Global Features

- **Command Palette (`⌘K` / `Ctrl+K`)**: Instant search and navigation across all views, files, and legal actions from anywhere in the app.
- **Persistent JSON Database (`data/db.json`)**: Pre-populated with realistic legal agreements, cases, statutory provisions, and user preferences that persist across server reboots.
- **Multipart Document Uploader (`data/uploads/`)**: Encrypted document ingestion with automatic SHA-256 verification and clause extraction.
- **Universal Notification Toast**: Visual confirmation for saves, downloads, copies, and state changes.

---

## 🧪 REST API Endpoints

- `GET /api/system/status`: Real-time engine health, latency telemetry, and compliance status.
- `GET /api/auth/session`: Active user profile and enterprise tenant permissions.
- `POST /api/assistant/chat`: AI legal synthesis with statutory sources and confidence scores.
- `GET /api/assistant/conversations`: Chat thread history.
- `GET /api/documents`: List of uploaded agreements with filter facets.
- `POST /api/documents/upload`: Multipart file upload and automatic clause parsing.
- `DELETE /api/documents/:id`: Document removal.
- `GET /api/compare`: Redline diffing data between contract versions.
- `GET /api/research`: Full-text statutory and case precedent search.
- `POST /api/drafts/generate`: Dynamic legal draft template generation.
- `GET /api/cases`: Case dossiers, deadlines, and task checklists.
- `POST /api/cases`: Creation of new litigation or advisory matters.
- `POST /api/settings`: Synchronization of workspace preferences.
