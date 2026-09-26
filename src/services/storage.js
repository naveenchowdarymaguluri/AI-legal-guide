const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "../../data/db.json");

const defaultData = {
  user: {
    name: "Elena Vance, Esq.",
    email: "elena.vance@vancelegal.com",
    role: "Lead Corporate Counsel",
    firm: "Vance & Associates LLP",
    vault: "Enterprise Workspace • Vance_Corp_Counsel_Vault",
    plan: "Enterprise Plan",
    activeSince: "2024",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1FUQjK8cFPlzpv7UYlZxPoZ-dcEBxSThB_UEaVFqxRMGpG6IpSz86i54g--Tv6r0Y4sWZ-EGtj-f7Dz7XXrD97YkCF__Chs4DetAt_2PudOgk2oRx53aIUZcluV2HxujrqRcjommNCd7M0fJ3orcbarNoYXdeDggQdij4XxJsApZuWLZy2dJ01lcJBCAod95Xa3h6dpj_lviqTYkzoaKod6003ctFV8LC7kD3Py8HgQDdqyYPlnVMlg"
  },
  settings: {
    modelVersion: "v4.3-REASON",
    strictDoctrine: true,
    zeroRetention: true,
    autoShepardize: true,
    jurisdictions: ["Federal", "California", "Delaware", "New York", "India"],
    apiKeys: [
      { name: "Production Gateway Key", key: "lex_live_89f...28b", created: "2026-08-14", status: "Active" },
      { name: "Staging Pipeline Secret", key: "lex_test_31a...99c", created: "2026-09-02", status: "Active" }
    ],
    team: [
      { name: "Elena Vance, Esq.", email: "elena.vance@vancelegal.com", role: "Owner / Lead Counsel", status: "Active" },
      { name: "Marcus Sterling", email: "marcus.s@vancelegal.com", role: "Senior Associate", status: "Active" },
      { name: "Priya Sharma", email: "priya.sharma@vancelegal.com", role: "Compliance Director", status: "Active" }
    ]
  },
  documents: [
    {
      id: "doc-1",
      title: "Employment Agreement - TechCorp",
      filename: "Employment_Agreement_TechCorp.pdf",
      type: "Executive Contract",
      pages: 24,
      size: "1.4 MB",
      uploadedAt: "2026-09-21T10:30:00Z",
      status: "Analyzed",
      hash: "8f9ba12c443e9d81702f9011baec8198f70231aa82410bf",
      riskScore: 38,
      clausesCount: 16,
      highRisks: 2,
      clauses: [
        {
          id: "c-1",
          section: "Section 8.2",
          title: "Termination Without Cause & Notice Period",
          text: "Either party may terminate this Agreement without cause by providing at least thirty (30) days prior written notice to the other party. Upon notice of termination, Company reserves the sole option to pay base salary in lieu of notice.",
          risk: "Low",
          riskScore: 15,
          statuteRef: "Cal. Labor Code § 2922",
          explanation: "Standard mutual at-will modified notice period. Complies with statutory baseline provisions.",
          verified: true
        },
        {
          id: "c-2",
          section: "Section 8.4",
          title: "Termination for Material Breach",
          text: "Either party may terminate immediately upon written notice if the other party commits a material breach and fails to cure within ten (10) calendar days of receiving formal notice.",
          risk: "Medium",
          riskScore: 45,
          statuteRef: "Restatement (Second) of Contracts § 241",
          explanation: "Cure period of 10 days is somewhat narrow for complex enterprise performance covenants (standard is 30 days).",
          verified: true
        },
        {
          id: "c-3",
          section: "Section 12.1",
          title: "Broad Indemnification & Defense of Claims",
          text: "Executive agrees to indemnify, defend, and hold harmless Company, its officers, and shareholders from any and all third-party liabilities, damages, and legal costs arising from Executive's performance of duties.",
          risk: "High",
          riskScore: 88,
          statuteRef: "Cal. Labor Code § 2802 (Mandatory Employer Indemnification)",
          explanation: "CRITICAL MATERIAL RISK: Under California Labor Code Section 2802, employers must indemnify employees for job-related costs. Shifting third-party indemnification entirely onto the executive is legally void and unenforceable in California.",
          verified: true
        },
        {
          id: "c-4",
          section: "Section 14.3",
          title: "Post-Termination Non-Compete Covenant",
          text: "For a duration of twelve (12) months following termination, Executive shall not directly or indirectly engage in, advise, or invest in any competing enterprise within North America.",
          risk: "High",
          riskScore: 95,
          statuteRef: "Cal. Bus. & Prof. Code § 16600 / Indian Contract Act § 27",
          explanation: "CRITICAL STATUTORY CONFLICT: Post-termination restrictive covenants are strictly void as a matter of public policy under California law (SB 699/AB 1076) and void under Section 27 of Indian Contract Act 1872.",
          verified: true
        }
      ]
    },
    {
      id: "doc-2",
      title: "Master Services Agreement v2.1",
      filename: "Master_Services_Agreement_v2.1.pdf",
      type: "Commercial MSA",
      pages: 18,
      size: "890 KB",
      uploadedAt: "2026-09-18T14:15:00Z",
      status: "Analyzed",
      hash: "a43e8198f70231aa82410bf8f9ba12c443e9d81702f9011b",
      riskScore: 22,
      clausesCount: 14,
      highRisks: 1,
      clauses: [
        {
          id: "c-2-1",
          section: "Section 2.1",
          title: "Service Delivery Standards & Acceptance",
          text: "Provider shall deliver professional SaaS integration services adhering to enterprise standards. Customer shall have fifteen (15) calendar days following milestone delivery to verify deliverables.",
          risk: "Low",
          riskScore: 12,
          statuteRef: "UCC § 2-606 (Acceptance of Goods)",
          explanation: "Standard 15-day inspection window with deemed acceptance upon payment.",
          verified: true
        },
        {
          id: "c-2-2",
          section: "Section 5.3",
          title: "Service Level Agreement (SLA) & Credits",
          text: "Provider covenants to maintain 99.9% monthly platform uptime. In the event of unresolved downtime exceeding 0.1%, Customer shall be entitled to service credits not to exceed 10% of monthly fee.",
          risk: "Low",
          riskScore: 18,
          statuteRef: "Model Enterprise SLA Standard",
          explanation: "Clear service credit remedy as exclusive contractual remedy for downtime.",
          verified: true
        },
        {
          id: "c-2-3",
          section: "Section 9.2",
          title: "Unilateral Price Escalation at Renewal",
          text: "Provider reserves the absolute right to increase annual subscription fees by up to fifteen percent (15%) upon each renewal period without requiring Customer's express written amendment.",
          risk: "High",
          riskScore: 82,
          statuteRef: "Uniform Commercial Code § 2-302 (Unconscionability)",
          explanation: "HIGH RISK: Uncapped 15% automatic escalation significantly exceeds CPI/inflation indices (standard is 3-5% capped).",
          verified: true
        },
        {
          id: "c-2-4",
          section: "Section 14.1",
          title: "Delaware Governing Law & Forum",
          text: "This Agreement and all disputes arising hereunder shall be governed exclusively by the laws of the State of Delaware and adjudicated in the Court of Chancery.",
          risk: "Low",
          riskScore: 10,
          statuteRef: "Del. Code tit. 8",
          explanation: "Authoritative corporate forum selection with mature commercial precedent.",
          verified: true
        }
      ]
    },
    {
      id: "doc-3",
      title: "Mutual NDA - Series B Due Diligence",
      filename: "Mutual_NDA_Series_B.pdf",
      type: "Confidentiality",
      pages: 6,
      size: "340 KB",
      uploadedAt: "2026-09-15T09:00:00Z",
      status: "Analyzed",
      hash: "d81702f9011baec8198f70231aa82410bf8f9ba12c443e9",
      riskScore: 12,
      clausesCount: 8,
      highRisks: 0,
      clauses: [
        {
          id: "c-3-1",
          section: "Section 1.1",
          title: "Scope of Evaluation Purpose",
          text: "Confidential Information shall be accessed and used solely to evaluate potential Series B corporate financing transactions between the parties.",
          risk: "Low",
          riskScore: 10,
          statuteRef: "Defend Trade Secrets Act (DTSA)",
          explanation: "Properly tailored narrow evaluation purpose preventing competitive reverse engineering.",
          verified: true
        },
        {
          id: "c-3-2",
          section: "Section 3.2",
          title: "Trade Secret Safe Harbors & Exclusions",
          text: "Confidential information excludes data publicly known, already in recipient's lawful possession, or independently developed without access.",
          risk: "Low",
          riskScore: 12,
          statuteRef: "Uniform Trade Secrets Act (UTSA)",
          explanation: "Standard trade secret carveouts required for legal enforceability.",
          verified: true
        },
        {
          id: "c-3-3",
          section: "Section 6.1",
          title: "Residual Knowledge & Memory Defense",
          text: "Recipient employees may retain generalized concepts, techniques, and ideas in unaided memory without infringing confidentiality terms.",
          risk: "Medium",
          riskScore: 48,
          statuteRef: "Cal. Civ. Code § 3426.1",
          explanation: "Residuals clause is somewhat broad; could facilitate inadvertent trade secret leakage without written clean-room protocols.",
          verified: true
        }
      ]
    },
    {
      id: "doc-4",
      title: "Commercial Lease Agreement - Suite 400",
      filename: "Commercial_Lease_Suite_400.pdf",
      type: "Real Estate Lease",
      pages: 32,
      size: "2.8 MB",
      uploadedAt: "2026-09-12T16:20:00Z",
      status: "Needs Review",
      hash: "b0bf8f9ba12c443e9d81702f9011baec8198f70231aa8241",
      riskScore: 54,
      clausesCount: 22,
      highRisks: 3,
      clauses: [
        {
          id: "c-4-1",
          section: "Section 4.1",
          title: "Annual Base Rent Escalation",
          text: "Tenant shall pay monthly base rent subject to a five percent (5.0%) compounding annual increase on each anniversary of lease commencement.",
          risk: "Medium",
          riskScore: 42,
          statuteRef: "Standard BOMA Commercial Indices",
          explanation: "Compounding 5% is above current regional commercial lease rates (typical 2.5% to 3.5%).",
          verified: true
        },
        {
          id: "c-4-2",
          section: "Section 6.2",
          title: "Operating Expenses (CAM) Pass-Through Allocation",
          text: "Tenant shall pay proportionate share of all building operating costs, including Landlord's historical capital structural improvements and seismic retrofits amortized over 5 years.",
          risk: "High",
          riskScore: 89,
          statuteRef: "Cal. Civ. Code § 1950.7 / BOMA 2017 Standards",
          explanation: "CRITICAL RISK: Landlord passes through major building structural capital improvements that should be landlord expense, not operating expense.",
          verified: true
        },
        {
          id: "c-4-3",
          section: "Section 11.4",
          title: "Holdover Penalty Assessment Rate",
          text: "In the event Tenant remains in possession following expiration, holdover rent shall be assessed at two hundred fifty percent (250%) of prevailing market base rent.",
          risk: "High",
          riskScore: 92,
          statuteRef: "Cal. Civ. Code § 1671(b) (Illegal Penalty Prohibition)",
          explanation: "CRITICAL UNENFORCEABLE PENALTY: Holdover penalties over 200% are routinely struck down as unlawful liquidated damages penalties under California law (*Ridgley v. Topa Thrift*).",
          verified: true
        }
      ]
    }
  ],
  cases: [
    {
      id: "case-1",
      title: "Apex Dynamics Intellectual Property Audit",
      docket: "D-2026-CV-88219",
      category: "Information Gathering",
      status: "Active",
      jurisdiction: "Delaware Chancery Court",
      client: "Apex Dynamics, Inc.",
      leadCounsel: "Elena Vance, Esq.",
      opposingCounsel: "Morrison & Foerster LLP",
      nextDeadline: "2026-10-15",
      deadlineLabel: "Responsive Pleadings Due",
      summary: "Comprehensive assessment of proprietary SaaS algorithms, employment IP assignment covenants, and third-party open-source licensing compliance.",
      trackedDocsCount: 5,
      tasks: [
        { id: "t-1", text: "Cross-reference IP clauses in founder agreements with CA Labor Code § 2870", done: true },
        { id: "t-2", text: "Generate redline comparison of Master Licensing Agreement v1.0 vs v2.4", done: false },
        { id: "t-3", text: "Audit third-party contributor assignment deeds", done: false }
      ]
    },
    {
      id: "case-2",
      title: "TechCorp Executive Transition & Severance",
      docket: "MATTER-TC-904",
      category: "In Draft",
      status: "Active",
      jurisdiction: "California Northern District",
      client: "TechCorp Enterprise",
      leadCounsel: "Elena Vance, Esq.",
      opposingCounsel: "In-House Advisory",
      nextDeadline: "2026-09-30",
      deadlineLabel: "Executive Separation Protocol Execution",
      summary: "Structuring mutual separation deed, equity vesting acceleration terms, and statutory releases adhering to California Labor Code § 2802.",
      trackedDocsCount: 3,
      tasks: [
        { id: "t-4", text: "Draft comprehensive Section 1542 Civil Code release", done: true },
        { id: "t-5", text: "Confirm severance escrow schedule", done: false }
      ]
    },
    {
      id: "case-3",
      title: "Commercial Lease Escalation Dispute - Suite 400",
      docket: "ARB-SF-2026-441",
      category: "Researching",
      status: "Active",
      jurisdiction: "San Francisco County / AAA Arbitration",
      client: "Vance Holding Partners",
      leadCounsel: "Elena Vance, Esq.",
      opposingCounsel: "Transbay Realty Management",
      nextDeadline: "2026-10-04",
      deadlineLabel: "Notice of Disputed Operating Costs Submission",
      summary: "Challenging retroactive building capital expenditure amortization passes under standard BOMA 2017 calculation standards.",
      trackedDocsCount: 4,
      tasks: [
        { id: "t-6", text: "Extract Section 6 operating expense clause", done: true },
        { id: "t-7", text: "Prepare formal statutory audit demand letter", done: false }
      ]
    }
  ],
  conversations: [
    {
      id: "conv-1",
      title: "Early termination clause review",
      time: "10:42 AM",
      docRef: "Employment Agreement - TechCorp.pdf",
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Can you explain the termination clause in this agreement?",
          timestamp: "2026-09-22T10:42:00Z"
        },
        {
          id: "m-2",
          role: "assistant",
          content: "The agreement provides for both termination without cause and termination for material breach under Section 8:\n\n1. **Without Cause (Section 8.2)**: Either party may terminate with thirty (30) days prior written notice. The Company reserves the right to pay base salary in lieu of notice.\n\n2. **Immediate Termination for Cause (Section 8.4)**: Immediate upon written notice for material breach, subject to a 10-day cure window.\n\n> **Statutory Precedent Note:** In California, employment contracts are presumed at-will under *Cal. Labor Code § 2922*. The notice provision modifies standard at-will terms, establishing an enforceable contractual requirement for 30-day compensation.",
          sources: [
            { title: "Employment Agreement - TechCorp", section: "Section 8.2 & 8.4", confidence: "99.4%" },
            { title: "California Labor Code", section: "§ 2922 (At-Will Baseline)", confidence: "98.1%" }
          ],
          timestamp: "2026-09-22T10:42:04Z"
        }
      ]
    },
    {
      id: "conv-2",
      title: "California lease deposit return rules",
      time: "9:15 AM",
      docRef: "Commercial Lease Agreement",
      messages: [
        {
          id: "m-3",
          role: "user",
          content: "What are the rules and statutory limits on security deposit holding and return in California?",
          timestamp: "2026-09-22T09:15:00Z"
        },
        {
          id: "m-4",
          role: "assistant",
          content: "Under California law:\n- **Residential (*Cal. Civ. Code § 1950.5*)**: Landlord must return security deposit within 21 calendar days of tenant surrender, accompanied by an itemized deduction ledger and receipts for repairs exceeding $125.\n- **Commercial (*Cal. Civ. Code § 1950.7*)**: Landlord may retain funds for rent defaults or repairs. If only held for defaults, balance must be returned within 30 days; if for repair claims, within 2 weeks to 30 days depending on lease specifics.",
          sources: [
            { title: "California Civil Code", section: "§ 1950.5 & § 1950.7", confidence: "99.8%" }
          ],
          timestamp: "2026-09-22T09:15:05Z"
        }
      ]
    },
    {
      id: "conv-3",
      title: "NDA confidentiality exclusions",
      time: "Yesterday",
      docRef: "Mutual NDA.pdf",
      messages: [
        {
          id: "m-5",
          role: "user",
          content: "What are the standard exclusions from Confidential Information in this Mutual NDA?",
          timestamp: "2026-09-21T15:10:00Z"
        },
        {
          id: "m-6",
          role: "assistant",
          content: "Section 3 sets forth standard trade secret safe harbors:\n1. Information publicly known without breach of recipient.\n2. Already in recipient's lawful possession prior to disclosure.\n3. Independently developed without access to confidential materials.\n4. Lawfully obtained from an unencumbered third party.",
          sources: [
            { title: "Mutual NDA", section: "Section 3.2 (Exclusions)", confidence: "99.1%" }
          ],
          timestamp: "2026-09-21T15:10:04Z"
        }
      ]
    }
  ],
  researchItems: [
    {
      id: "res-1",
      title: "Requirements for terminating an employment contract in India",
      jurisdiction: "India (Central & State Shops and Establishments Acts)",
      citation: "Industrial Disputes Act, 1947 § 25F; Industrial Relations Code 2020",
      court: "Supreme Court of India",
      year: "2024 Doctrine",
      summary: "Termination of workmen requires 1 month notice or wages in lieu, plus retrenchment compensation equal to 15 days average pay per completed year of service. For non-workmen/managerial employees, terms governed strictly by employment contract subject to fundamental notice rules.",
      relevantSections: ["Section 25F", "Section 25G (Last Come, First Go)", "Section 27 Contract Act (Non-Compete void)"]
    },
    {
      id: "res-2",
      title: "Enforceability of Post-Employment Non-Compete Covenants in California",
      jurisdiction: "California (State)",
      citation: "Cal. Bus. & Prof. Code § 16600, 16600.1; Edwards v. Arthur Andersen LLP (2008)",
      court: "California Supreme Court",
      year: "2024 Expansion (SB 699)",
      summary: "Every contract by which anyone is restrained from engaging in a lawful profession, trade, or business of any kind is void. SB 699 renders non-compete agreements signed outside California equally void and unenforceable when pursued in California.",
      relevantSections: ["§ 16600", "§ 16600.1 (Mandatory Employer Notice)", "§ 16600.5 (Private Right of Action)"]
    },
    {
      id: "res-3",
      title: "Delaware Corporate Fiduciary Duty: Business Judgment Rule vs Entire Fairness",
      jurisdiction: "Delaware (Chancery & Supreme Court)",
      citation: "Del. Code tit. 8, § 141; Kahn v. M&F Worldwide Corp. (MFW) 88 A.3d 635",
      court: "Delaware Supreme Court",
      year: "2023 Precedent",
      summary: "Where a controlling shareholder buyout transaction is conditioned upfront upon both an independent, fully empowered Special Committee approval and an uncoerced majority-of-the-minority stockholder vote, the standard of review shifts back from Entire Fairness to the deferential Business Judgment Rule.",
      relevantSections: ["DGCL § 141(a)", "DGCL § 144 (Interested Directors)"]
    },
    {
      id: "res-4",
      title: "Commercial Lease Unenforceable Liquidated Damages vs Valid Holdover Rent",
      jurisdiction: "Federal / Common Law",
      citation: "Ridgley v. Topa Thrift & Loan Ass'n (1998) 17 Cal.4th 970",
      court: "California Supreme Court",
      year: "1998 Landmark",
      summary: "A liquidated damages provision is invalid if it bears no reasonable relationship to the range of actual damages the parties could have anticipated. Holdover penalties exceeding 150%-200% of fair market base rent risk invalidation as illegal penalties.",
      relevantSections: ["Cal. Civ. Code § 1671(b)"]
    }
  ],
  draftTemplates: [
    {
      id: "tpl-1",
      category: "Notice",
      title: "Notice of Contractual Termination Without Cause",
      description: "Formal written notice executing standard 30-day notice period under executive employment agreement.",
      body: `NOTICE OF TERMINATION WITHOUT CAUSE

Date: [CURRENT_DATE]
To: [RECIPIENT_NAME], [RECIPIENT_TITLE]
Company: [COMPANY_NAME]
Address: [COMPANY_ADDRESS]

Dear [RECIPIENT_NAME],

Pursuant to Section [SECTION_NUMBER, e.g. 8.2] of that certain Employment Agreement dated [AGREEMENT_DATE] by and between [COMPANY_NAME] ("Company") and the undersigned ("Executive"), this letter serves as formal written notice of termination without cause.

In accordance with Section [SECTION_NUMBER], the effective date of termination shall be thirty (30) calendar days from the delivery date of this notice, specifically [EFFECTIVE_DATE]. 

During this thirty-day transition period, Executive shall:
1. Continue to perform transition responsibilities and orderly handover of ongoing matters;
2. Comply with continuing confidentiality covenants;
3. Return all proprietary company property and equipment prior to the Effective Date.

Please confirm receipt of this notice.

Sincerely,

_______________________________
[SENDER_NAME]
[SENDER_TITLE]
[COMPANY_NAME]`
    },
    {
      id: "tpl-2",
      category: "Agreement",
      title: "Mutual Non-Disclosure Agreement (Standard Corporate)",
      description: "Bilateral confidentiality agreement protecting proprietary code, customer lists, and strategic roadmaps.",
      body: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on [CURRENT_DATE], by and between [PARTY_A_NAME] ("Party A") and [PARTY_B_NAME] ("Party B").

1. PURPOSE. The parties wish to explore a business relationship concerning [BUSINESS_PURPOSE].

2. CONFIDENTIAL INFORMATION. "Confidential Information" means any proprietary information disclosed by either party to the other, whether orally or in writing, marked as confidential or that reasonably should be understood to be confidential.

3. EXCLUSIONS. Confidential Information does not include information that: (a) is or becomes publicly known through no breach of recipient; (b) was already in recipient's lawful possession; (c) is independently developed without reference to the disclosing party's information.

4. OBLIGATIONS. Each party agrees to protect the other's Confidential Information using at least the degree of care it uses for its own confidential information, but not less than a reasonable standard of care, and not to disclose such information for a period of three (3) years.

5. GOVERNING LAW. This Agreement shall be governed by the laws of [GOVERNING_JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

PARTY A: _________________________    PARTY B: _________________________`
    },
    {
      id: "tpl-3",
      category: "Complaint",
      title: "Formal Demand & Cease and Desist (Trade Secret / Breach)",
      description: "Formal legal demand letter regarding unauthorized use of proprietary assets.",
      body: `CEASE AND DESIST DEMAND

CONFIDENTIAL LEGAL CORRESPONDENCE

Date: [CURRENT_DATE]
VIA CERTIFIED MAIL AND ELECTRONIC TRANSMISSION

To: [TARGET_ENTITY / INDIVIDUAL]
Address: [TARGET_ADDRESS]

RE: FORMAL DEMAND TO CEASE AND DESIST UNLAWFUL USE OF PROPRIETARY PROPERTY

Dear [TARGET_NAME],

This office represents [CLIENT_NAME] in connection with intellectual property and contractual matters. 

It has come to our client's immediate attention that you have engaged in the unauthorized use, disclosure, and exploitation of [CLIENT_NAME]'s proprietary trade secrets and confidential information, in direct violation of Section [SECTION_NUM] of the [AGREEMENT_NAME] dated [AGREEMENT_DATE], and applicable statutory provisions including the Defend Trade Secrets Act (18 U.S.C. § 1836) and the Uniform Trade Secrets Act.

DEMAND IS HEREBY MADE THAT YOU IMMEDIATELY:
1. Cease and desist from all further access, use, marketing, or disclosure of our client's materials;
2. Deliver up and preserve all electronic records, drives, and communications containing said information;
3. Provide written confirmation of compliance within five (5) business days, specifically by [DEADLINE_DATE].

Failure to comply will leave our client with no alternative but to seek immediate emergency injunctive relief, compensatory and exemplary damages, and statutory attorneys' fees.

GOVERN YOURSELF ACCORDINGLY.

Very truly yours,

_______________________________
[COUNSEL_NAME], Esq.
Counsel for [CLIENT_NAME]`
    }
  ]
};

class StorageService {
  constructor() {
    this.memoryDb = null;
    this.ensureDb();
  }

  ensureDb() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE)) {
        this.writeDb(defaultData);
      }
    } catch (e) {
      if (!this.memoryDb) {
        this.memoryDb = JSON.parse(JSON.stringify(defaultData));
      }
    }
  }

  readDb() {
    if (this.memoryDb) return this.memoryDb;
    this.ensureDb();
    try {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      this.memoryDb = JSON.parse(raw);
      return this.memoryDb;
    } catch (err) {
      this.memoryDb = JSON.parse(JSON.stringify(defaultData));
      return this.memoryDb;
    }
  }

  writeDb(data) {
    this.memoryDb = data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      // In read-only environments (e.g. Vercel), gracefully persist in memory
    }
  }

  getUser() {
    return this.readDb().user;
  }

  updateUser(patch) {
    const db = this.readDb();
    db.user = { ...db.user, ...patch };
    this.writeDb(db);
    return db.user;
  }

  getSettings() {
    return this.readDb().settings;
  }

  updateSettings(patch) {
    const db = this.readDb();
    db.settings = { ...db.settings, ...patch };
    this.writeDb(db);
    return db.settings;
  }

  getDocuments() {
    return this.readDb().documents || [];
  }

  getDocumentById(id) {
    return this.getDocuments().find(d => d.id === id);
  }

  addDocument(doc) {
    const db = this.readDb();
    db.documents = db.documents || [];
    db.documents.unshift(doc);
    this.writeDb(db);
    return doc;
  }

  deleteDocument(id) {
    const db = this.readDb();
    db.documents = (db.documents || []).filter(d => d.id !== id);
    this.writeDb(db);
    return true;
  }

  getCases() {
    return this.readDb().cases || [];
  }

  getCaseById(id) {
    return this.getCases().find(c => c.id === id);
  }

  addCase(matter) {
    const db = this.readDb();
    db.cases = db.cases || [];
    db.cases.unshift(matter);
    this.writeDb(db);
    return matter;
  }

  updateCase(id, patch) {
    const db = this.readDb();
    const idx = (db.cases || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      db.cases[idx] = { ...db.cases[idx], ...patch };
      this.writeDb(db);
      return db.cases[idx];
    }
    return null;
  }

  getConversations() {
    return this.readDb().conversations || [];
  }

  getConversationById(id) {
    return this.getConversations().find(c => c.id === id);
  }

  addConversation(conv) {
    const db = this.readDb();
    db.conversations = db.conversations || [];
    db.conversations.unshift(conv);
    this.writeDb(db);
    return conv;
  }

  appendMessageToConversation(convId, message) {
    const db = this.readDb();
    const conv = (db.conversations || []).find(c => c.id === convId);
    if (conv) {
      conv.messages.push(message);
      this.writeDb(db);
      return conv;
    }
    return null;
  }

  getResearchItems(query, jurisdiction) {
    const items = this.readDb().researchItems || [];
    if (!query && !jurisdiction) return items;
    return items.filter(it => {
      const q = (query || "").toLowerCase();
      const matchQ = !q || it.title.toLowerCase().includes(q) || it.summary.toLowerCase().includes(q) || it.citation.toLowerCase().includes(q);
      const matchJ = !jurisdiction || it.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase());
      return matchQ && matchJ;
    });
  }

  getDraftTemplates() {
    return this.readDb().draftTemplates || [];
  }

  deleteCase(id) {
    const db = this.readDb();
    db.cases = (db.cases || []).filter(c => c.id !== id);
    this.writeDb(db);
    return true;
  }

  addApiKey(name) {
    const db = this.readDb();
    db.settings = db.settings || {};
    db.settings.apiKeys = db.settings.apiKeys || [];
    const newKey = {
      name: name || "Enterprise Gateway Key",
      key: "lex_live_" + Math.random().toString(36).substring(2, 8) + "..." + Math.random().toString(36).substring(2, 5),
      created: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    db.settings.apiKeys.unshift(newKey);
    this.writeDb(db);
    return newKey;
  }

  revokeApiKey(keyStr) {
    const db = this.readDb();
    if (db.settings && db.settings.apiKeys) {
      db.settings.apiKeys = db.settings.apiKeys.filter(k => k.key !== keyStr);
      this.writeDb(db);
      return true;
    }
    return false;
  }

  addTeamMember(member) {
    const db = this.readDb();
    db.settings = db.settings || {};
    db.settings.team = db.settings.team || [];
    const newMember = {
      name: member.name || "Legal Counsel",
      email: member.email || "counsel@vancelegal.com",
      role: member.role || "Associate Counsel",
      status: "Active"
    };
    db.settings.team.push(newMember);
    this.writeDb(db);
    return newMember;
  }

  removeTeamMember(email) {
    const db = this.readDb();
    if (db.settings && db.settings.team) {
      db.settings.team = db.settings.team.filter(m => m.email !== email);
      this.writeDb(db);
      return true;
    }
    return false;
  }
}

module.exports = new StorageService();
